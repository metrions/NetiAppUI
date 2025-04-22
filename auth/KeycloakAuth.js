// auth/KeycloakAuth.js
import { makeRedirectUri } from 'expo-auth-session';

// Конфигурация для Keycloak
export const discovery = {
    authorizationEndpoint: 'https://login2.nstu.ru/realms/apps/protocol/openid-connect/auth',
    tokenEndpoint: 'https://login2.nstu.ru/realms/apps/protocol/openid-connect/token',
    revocationEndpoint: 'https://login2.nstu.ru/realms/apps/protocol/openid-connect/logout',
};

const clientId = 'lab-queue-client';
const clientSecret = 'PznWctgVCMznOx5p5Ky2ADJJGHQp8dkr';

// Для Expo можно использовать прокси; redirectUri задаётся через makeRedirectUri
// Формируем редирект URI с явным указанием схемы и пути
export const redirectUri = makeRedirectUri({
  scheme: 'com.neti.queue',
  path: 'callback',
  useProxy: false, // отключаем прокси, если требуется точно использовать нужный URI
});
//export const redirectUri = makeRedirectUri({ useProxy: true });
console.log("redirectUri", redirectUri);

// Функция возвращает конфигурацию запроса для useAuthRequest
export function getAuthRequestConfig() {
    return {
        clientId,
        scopes: ['openid'],
        redirectUri,
    };
}

// Функция для обмена кода авторизации на токены
export async function exchangeCodeForToken(code) {
    const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:
            `grant_type=authorization_code` +
            `&code=${code}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&client_id=${clientId}` +
            `&client_secret=${clientSecret}`
    });
    if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Ошибка получения токена: ${tokenResponse.status} ${errorText}`);
    }
    return await tokenResponse.json();
}
