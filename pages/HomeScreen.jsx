import {Image, StyleSheet, Text, View} from "react-native";
import {Item} from "../components/Item";
import React from "react";
import Constants from "expo-constants";

export const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome!</Text>
            <View style={styles.grid}>
                <Item
                    image={<Image source={require("../assets/query.png")} style={styles.image} />}
                    text="Очередь"
                    navigation={navigation}
                    page={"Queue"}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#17161b", padding: 20 },
    welcome: { paddingBottom: 30, fontSize: 24, fontWeight: "bold", color: "#ffffff" },
    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    image: { height: 25, width: 25 },
});