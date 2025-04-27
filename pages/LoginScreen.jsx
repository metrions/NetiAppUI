// LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import { useAuthRequest } from 'expo-auth-session';

// Импортируем необходимые функции и константы из auth/KeycloakAuth
import { discovery, getAuthRequestConfig, exchangeCodeForToken, redirectUri } from '../auth/KeycloakAuth';

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
        <View style={{ padding: 20 }}>
            <Button
                title={loading ? 'Загрузка...' : 'Войти через Keycloak'}
                onPress={() => {
                    console.log('Нажата кнопка авторизации');
                    promptAsync();
                }}
                disabled={!request || loading}
            />

            {tokens && (
                <Text style={{ marginTop: 20 }}>
                    Токен: {tokens.access_token.slice(0, 40)}...
                </Text>
            )}

            {error && (
                <Text style={{ color: 'red', marginTop: 20 }}>
                    Ошибка: {error}
                </Text>
            )}

            {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" />}
        </View>
    );
}
