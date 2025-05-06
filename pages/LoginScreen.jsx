// LoginScreen.js
import React, { useEffect, useState } from 'react';
import {Button, TouchableOpacity, StyleSheet, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuthRequest } from 'expo-auth-session';

// Импортируем необходимые функции и константы из auth/KeycloakAuth
import { discovery, getAuthRequestConfig, exchangeCodeForToken, redirectUri } from '../auth/KeycloakAuth';
import axios from "axios";

export default function LoginScreen() {
    const [tokens, setTokens] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Получаем базовую конфигурацию для useAuthRequest из модуля auth/KeycloakAuth
    const authRequestConfig = getAuthRequestConfig();

    // Хук для авторизации через expo-auth-session
    const [request, response, promptAsync] = useAuthRequest(
        authRequestConfig,
        discovery
    );


    useEffect(() => {
        console.log('useEffect сработал. response:', response);

        const exchange = async () => {
            if (response?.type === 'success' && response.params.code) {
                console.log('Получен code:', response.params.code);

                if (!request?.codeVerifier) {
                    console.error('Code verifier отсутствует в request');
                    setError('Code verifier отсутствует');
                    return;
                }

                setLoading(true);
                try {
                    console.log('Начинаем обмен кода на токен...');
                    const tokensData = await exchangeCodeForToken(response.params.code, request.codeVerifier);
                    console.log('Токены успешно получены:', tokensData);
                    await AsyncStorage.setItem('token', tokensData.access_token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${tokensData.access_token}`;
                    setTokens(tokensData);

                } catch (e) {
                    console.error('Ошибка при получении токена:', e);
                    setError(e.message);
                } finally {
                    console.log('Завершаем загрузку');
                    setLoading(false);
                }
            } else if (response?.type === 'error') {
                console.error('Ошибка при авторизации:', response?.error);
                setError('Ошибка авторизации');
                setLoading(false);
            } else {
                console.log('Ожидание ответа...');
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
            <Text style={styles.buttonText}>{loading ? 'Загрузка...' : 'Войти'}</Text>
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