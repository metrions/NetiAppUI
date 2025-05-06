import React from 'react';
import { Image, View, Text, StyleSheet } from "react-native";
import LoginScreen from "../pages/LoginScreen";

export const TopBar = () => {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Image style={styles.image} source={require('../static/icon/neti_icon.png')} />
                <Text style={styles.text}>Services</Text>
            </View>
            <View style={styles.right}>
                <LoginScreen />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#232323",
        padding: 10,
        height: 85,
        paddingTop: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between" // это делает левую и правую части по краям
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        fontSize: 16,
        color: "white",
        paddingLeft: 15,
        fontWeight: "bold"
    },
    image: {
        width: 25,
        height: 25,
    }
});
