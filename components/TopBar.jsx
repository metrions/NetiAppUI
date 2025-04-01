import React from 'react'
import {Image, View, Text, StyleSheet} from "react-native";

export const TopBar = () => {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../static/icon/neti_icon.png')} />
            <Text style={styles.text}>Services</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#232323",
        padding: 10,
        height: 85,
        paddingTop: 40,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    text: {
        fontStyle: 'Verdana',
        fontSize: 16,
        color: "white",
        paddingLeft: 15,
        fontWeight: "bold"
    },
    image: {
        width: 25,
        height: 25,
    }
})