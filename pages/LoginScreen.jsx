import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthRequest } from 'expo-auth-session';
import { discovery, getAuthRequestConfig, exchangeCodeForToken } from '../auth/KeycloakAuth';
import axios from "axios";

export default function LoginScreen() {
    const [tokens, setTokens] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const authRequestConfig = getAuthRequestConfig();
    const [request, response, promptAsync] = useAuthRequest(authRequestConfig, discovery);

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
            <Text style={styles.buttonText}>{loading ? 'Загрузка...' : 'Войти'}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
