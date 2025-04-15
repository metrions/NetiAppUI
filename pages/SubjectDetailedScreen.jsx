import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { TimePanel } from "../components/TimePanel";
import axios from "axios";
import Constants from "expo-constants";

export const SubjectDetailsScreen = ({ route }) => {
    const BACK_URL = Constants.expoConfig.extra.BACK_URL;

    const { subject } = route.params;

    const [stompClient, setStompClient] = useState(null);
    const [queueData, setQueueData] = useState({places: []});
    const [notConnected, setNotConnected] = useState(false);

    const WS_URL = `${BACK_URL}/sockjs`;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${BACK_URL}/session/${subject.id}`);
                setQueueData({ places: response.data });
                console.log(queueData);
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
                setNotConnected(true);
            }
        }

        fetchData();

    }, [subject.id]);

    const sendQueueRequest = (placeNumber) => {
        console.log(stompClient?.connected);

        if (!stompClient?.connected) {
            console.log("STOMP не подключен, пытаемся переподключиться...");
            connectStompClient();
        }

        if (stompClient && stompClient.connected) {
            const request = {
                sessionId: subject.id,
                placeNumber,
            };

            stompClient.publish({
                destination: `/app/queue/${subject.id}`,
                body: JSON.stringify(request),
            });

            console.log("Отправлен запрос в очередь:", request);
        } else {
            console.error("STOMP не подключен или запрос уже отправлен");
        }
    };

    const connectStompClient = () => {
        const socket = new SockJS(WS_URL);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("STOMP подключен");

                client.subscribe(`/topic/queue/${subject.id}`, (message) => {
                    const response = JSON.parse(message.body);
                    console.log("Получено сообщение сразу после подписки: ", response);
                    setQueueData(response);
                });

                setStompClient(client);
            },
            onDisconnect: () => {
                console.log("❌ STOMP отключен");
                setStompClient(null);
            },
            debug: (str) => console.log(str),
        });

        client.activate();
    };

    useEffect(() => {
        connectStompClient();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [subject.id]);

    const timeSlots = Array.from({ length: 9 }, (_, index) => {
        const [startHour, startMinute] = subject.startTime.split(":").map(Number);
        const [endHour, endMinute] = subject.endTime.split(":").map(Number);

        const startDate = new Date(2000, 0, 1, startHour, startMinute);
        const endDate = new Date(2000, 0, 1, endHour, endMinute);

        const diff = endDate - startDate;
        const interval = diff / 9;

        const startTime = new Date(startDate.getTime() + index * interval);
        const endTime = new Date(startTime.getTime() + interval);

        const startTimeString = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
        const endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

        return { startTime: startTimeString, endTime: endTimeString, placeNumber: index + 1 };
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{subject.subjectName}</Text>
            <Text style={styles.time}>
                {subject.startTime} - {subject.endTime}
            </Text>
            <Text style={styles.info}>Группа: {subject.group}</Text>
            <View style={styles.timePanels}>
                {timeSlots.map((slot) => (
                    <TimePanel
                        key={slot.placeNumber}
                        startTime={slot.startTime}
                        endTime={slot.endTime}
                        isAvailable={queueData.places.includes(slot.placeNumber)}
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
});
