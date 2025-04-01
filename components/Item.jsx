import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export const Item = ({ image, text, navigation, page }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(page)}>
            <View>{image}</View>
            <Text style={styles.cardText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 100,
        height: 100,
        backgroundColor: "#1d2022",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    cardText: { color: "#FFF", marginTop: 5 },
});
