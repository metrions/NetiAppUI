import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { TimePanel } from "../components/TimePanel";
import { getSessions } from "../api/session";
import { parseJwt } from "../auth/tokenProcess";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SubjectDetailsScreen = ({ route }) => {
    const BACK_URL = "http://192.168.0.105:8080";
    const WS_URL = `${BACK_URL}/sockjs`;
    const { subject } = route.params;

    const [queueData, setQueueData] = useState({ places: [] });
    const stompClientRef = useRef(null);

    // Получение начальных данных
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSessions(subject);
                setQueueData(response);
                console.log("📥 Получены места от сервера:", response);
            } catch (error) {
                console.error("❌ Ошибка при получении данных:", error);
            }
        };

        fetchData();
    }, [subject.id]);

    // Подключение к STOMP
    useEffect(() => {
        const socket = new SockJS(WS_URL);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("✅ STOMP подключен");

                client.subscribe(`/topic/queue/${subject.id}`, (message) => {
                    const response = JSON.parse(message.body);
                    console.log("📨 Сообщение от сервера:", response);
                    setQueueData(response);
                });
            },
            onDisconnect: () => {
                console.log("🔌 STOMP отключен");
            },
            debug: (str) => console.log("🐞", str),
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [subject.id]);

    // Отправка запроса в очередь
    const sendQueueRequest = async (placeNumber) => {
        const client = stompClientRef.current;

        if (!client?.connected) {
            console.log("⚠️ STOMP не подключен");
            return;
        }

        const token = await AsyncStorage.getItem("token");
        const parsedToken = parseJwt(token);

        const request = {
            sessionId: subject.id,
            mail: parsedToken.email,
            name: parsedToken.name,
            placeNumber,
        };

        client.publish({
            destination: `/app/queue/${subject.id}`,
            body: JSON.stringify(request),
        });

        console.log("📤 Отправлен запрос:", request);
    };

    // Вычисление тайм-слотов
    const timeSlots = Array.from({ length: 9 }, (_, index) => {
        const [startHour, startMinute] = subject.startTime.split(":").map(Number);
        const [endHour, endMinute] = subject.endTime.split(":").map(Number);

        const start = new Date(0, 0, 1, startHour, startMinute);
        const end = new Date(0, 0, 1, endHour, endMinute);
        const interval = (end - start) / 9;

        const slotStart = new Date(start.getTime() + index * interval);
        const slotEnd = new Date(slotStart.getTime() + interval);

        return {
            startTime: slotStart.toTimeString().slice(0, 5),
            endTime: slotEnd.toTimeString().slice(0, 5),
            placeNumber: index + 1,
        };
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{subject.subjectName}</Text>
            <Text style={styles.time}>{subject.startTime} - {subject.endTime}</Text>
            <Text style={styles.info}>Группа: {subject.group}</Text>
            <View style={styles.timePanels}>
                {timeSlots.map((slot) => (
                    <TimePanel
                        key={slot.placeNumber}
                        startTime={slot.startTime}
                        endTime={slot.endTime}
                        isAvailable={queueData.places.includes(slot.placeNumber)}
                        occupiedBy={queueData.placeStudents?.[slot.placeNumber]}
                        onPress={() => sendQueueRequest(slot.placeNumber)}
                    />

                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#17161b", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 10 },
    time: { fontSize: 18, color: "#f9a825", marginBottom: 5 },
    info: { fontSize: 16, color: "#bbb" },
    timePanels: { marginTop: 20 },
});
