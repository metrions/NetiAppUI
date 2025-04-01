import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {useNavigation} from "@react-navigation/native";

export const SubjectPanel = ({ subject }) => {

    const navigation = useNavigation();

    const navigateToDetails = () => {
        navigation.navigate("SubjectDetails", { subject });
    };


    return (
        <TouchableOpacity onPress={navigateToDetails}>
            <View style={{
                backgroundColor: "#222",
                padding: 12,
                borderRadius: 10,
                marginVertical: 6
            }}>
                <Text style={{ color: "#f9a825", fontWeight: "bold", fontSize: 16 }}>
                    {subject.startTime}-{subject.endTime}
                </Text>
                <Text style={{ color: "#bbb", fontSize: 14, marginBottom: 4 }}>
                    {subject.subjectName}
                </Text>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                    {subject.room}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

