import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import { TopBar } from "./components/TopBar";
import { BottomBar } from "./components/BottomBar";

import LoginScreen from "./pages/LoginScreen";
import { HomeScreen } from "./pages/HomeScreen";
import { SubjectQueueManager } from "./pages/SubjectQueueManager";
import { SubjectDetailsScreen } from "./pages/SubjectDetailedScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// 2. Компонент с Drawer + TopBar + BottomBar
function MainApp() {
    return (
        <>
            <TopBar />
            <Drawer.Navigator screenOptions={{ headerShown: false }}>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Queue" component={SubjectQueueManager} />
                <Drawer.Screen name="SubjectDetails" component={SubjectDetailsScreen} />
            </Drawer.Navigator>
            <BottomBar />
        </>
    );
}

// 3. Корневой навигатор: сначала Login, потом MainApp
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="MainApp" component={MainApp} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
