import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { SubjectPanel } from "../components/SubjectPanel";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";

export const SubjectQueueManager = () => {
    const [sessionSubjects, setSessionSubjects] = useState([]);
    const BACK_URL = Constants.expoConfig.extra.BACK_URL;

    useFocusEffect(
        useCallback(() => {
            const fetchSubjects = async () => {
                try {
                    console.log(BACK_URL);
                    console.log(`${BACK_URL}/session`)
                    const response = await axios.get(`${BACK_URL}/session`);
                    setSessionSubjects(response.data);
                    console.log("📡 Загружены предметы:", response.data);
                } catch (error) {
                    console.error("❌ Ошибка загрузки предметов:", error);
                }
            };

            fetchSubjects();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Лабораторные занятия</Text>
            {sessionSubjects.length > 0 ? (
                sessionSubjects.map((subject) => (
                    <SubjectPanel subject={subject} key={subject.id} />
                ))
            ) : (
                <Text style={{ color: "white" }}>Нет данных</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#17161b", padding: 20 },
    welcome: { paddingBottom: 30, fontSize: 24, fontWeight: "bold", color: "#ffffff" },
});
