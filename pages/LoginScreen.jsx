import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthRequest } from 'expo-auth-session';
import { discovery, getAuthRequestConfig, exchangeCodeForToken } from '../auth/KeycloakAuth';
import axios from 'axios';
import { parseJwt } from '../auth/tokenProcess'; // убедись, что эта функция есть

export default function LoginScreen() {
    const [tokens, setTokens] = useState(null);
    const [userName, setUserName] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const authRequestConfig = getAuthRequestConfig();
    const [request, response, promptAsync] = useAuthRequest(authRequestConfig, discovery);

    useEffect(() => {
        const checkStoredToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                try {
                    const parsed = parseJwt(token);
                    const currentTime = Math.floor(Date.now() / 1000);
                    if (parsed.exp && parsed.exp > currentTime) {
                        setUserName(parsed.name);
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    } else {
                        await AsyncStorage.removeItem('token');
                    }
                } catch (err) {
                    console.error("Ошибка при парсинге токена:", err);
                    await AsyncStorage.removeItem('token');
                }
            }
        };

        checkStoredToken();
    }, []);

    useEffect(() => {
        const exchange = async () => {
            if (response?.type === 'success' && response.params.code) {
                if (!request?.codeVerifier) {
                    setError('Code verifier отсутствует');
                    return;
                }

                setLoading(true);
                try {
                    const tokensData = await exchangeCodeForToken(response.params.code, request.codeVerifier);
                    await AsyncStorage.setItem('token', tokensData.access_token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${tokensData.access_token}`;
                    setTokens(tokensData);

                    const parsed = parseJwt(tokensData.access_token);
                    setUserName(parsed.name);
                } catch (e) {
                    setError(e.message);
                } finally {
                    setLoading(false);
                }
            } else if (response?.type === 'error') {
                setError('Ошибка авторизации');
                setLoading(false);
            }
        };

        exchange();
    }, [response]);

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => promptAsync()}
            disabled={!request || loading}
        >
            <Text style={styles.buttonText}>
                {loading
                    ? 'Загрузка...'
                    : userName
                        ? userName
                        : 'Войти'}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'transparent',
        padding: 0,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
