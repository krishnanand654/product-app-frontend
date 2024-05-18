import { useEffect } from 'react';
import axios from 'axios';

const TokenService = {
    getTokensFromStorage() {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const expiresIn = localStorage.getItem('expiresIn');
        return { accessToken, refreshToken, expiresIn };
    },

    setAccessToken(accessToken) {
        localStorage.setItem('accessToken', accessToken);
    },

    parseExpirationTime(expiresInString) {
        const unitMap = { 's': 1000, 'm': 60 * 1000, 'h': 60 * 60 * 1000, 'd': 24 * 60 * 60 * 1000 };
        const regex = /^(\d+)([smhd])$/;
        const match = regex.exec(expiresInString);
        if (!match || !unitMap[match[2]]) {
            console.error('Invalid expiration time format:', expiresInString);
            return null;
        }
        const duration = parseInt(match[1], 10);
        return duration * unitMap[match[2]];
    },

    async refreshToken(refreshToken) {
        try {
            const response = await axios.post('http://localhost:3000/auth/refresh-token', { refreshToken });
            const { accessToken, expiresIn } = response.data;
            this.setAccessToken(accessToken);
            const expirationTime = this.parseExpirationTime(expiresIn);
            if (expirationTime !== null) {
                const now = Date.now();
                localStorage.setItem('expiresIn', now + expirationTime);
            } else {
                console.error('Failed to parse expiration time:', expiresIn);
            }
            return accessToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    },

    isTokenExpired() {
        const expiresIn = parseInt(localStorage.getItem('expiresIn'), 10);
        if (!expiresIn) return true;
        const currentTime = Date.now();
        return currentTime >= expiresIn;
    },

    async checkAndRefreshTokenIfNeeded() {
        if (this.isTokenExpired()) {
            const { refreshToken } = this.getTokensFromStorage();
            if (refreshToken) {
                await this.refreshToken(refreshToken);
            } else {
                console.error('Refresh token not found.');

            }
        }
    }
};

const TokenRefreshHandler = () => {
    useEffect(() => {
        const refreshAccessToken = async () => {
            try {
                await TokenService.checkAndRefreshTokenIfNeeded();
            } catch (error) {
                console.error('Error refreshing access token:', error);

            }
        };
        console.log("refreshed");
        const tokenRefreshInterval = setInterval(refreshAccessToken, 60000);


        return () => clearInterval(tokenRefreshInterval);
    }, []);

    return null;
};

export default TokenRefreshHandler;
