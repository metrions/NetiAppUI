import React from 'react'
import {View, Image, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const BottomBar = () => (
    <View style={styles.bottomBar}>
        <Icon name="newspaper" size={24} color="#FFF" />
        <Icon name="calendar" size={24} color="#FFF" />
        <Image style={styles.image} source={require("../assets/email.png")} color="#FFF" />
        <Image style={styles.image} source={require("../assets/user.png")} color="#FFF" />
        <Image style={styles.image} source={require("../assets/table.png")} color="#FFF" />
    </View>
);

const styles = StyleSheet.create({
    bottomBar: {
        backgroundColor: "#232323",
        padding: 10,
        height: 55,
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "row",
        position: 'absolute',
        alignItems: "center",
        bottom: 0,
        width: "100%"
    },
    image: {
        width: 20,
        height: 20,
        paddingRight: 10,
        paddingLeft: 10,
    }
})