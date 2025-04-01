import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { TopBar } from "./components/TopBar";
import { BottomBar } from "./components/BottomBar";
import { Item } from "./components/Item";
import {HomeScreen} from "./pages/HomeScreen";
import {SubjectQueueManager} from "./pages/SubjectQueueManager";
import {SubjectDetailsScreen} from "./pages/SubjectDetailedScreen";

const Drawer = createDrawerNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <TopBar />
            <Drawer.Navigator screenOptions={{ headerShown: false }} id="mainDrawer">
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Queue" component={SubjectQueueManager} />
                <Drawer.Screen name="SubjectDetails" component={SubjectDetailsScreen} />
            </Drawer.Navigator>
            <BottomBar />
        </NavigationContainer>
    );
};

export default App;
