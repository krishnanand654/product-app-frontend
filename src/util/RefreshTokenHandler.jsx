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

    setExpirationTime(expiresIn) {
        const expirationTime = Date.now() + parseInt(expiresIn, 10);
        localStorage.setItem('expiresIn', expirationTime);
    },

    async refreshToken(refreshToken) {
        try {
            const response = await axios.post('http://localhost:3000/auth/refresh-token', { refreshToken });
            const { accessToken } = response.data;

            if (!accessToken) {
                console.error('Invalid response from refresh token endpoint:', response.data);
                throw new Error('Invalid response from refresh token endpoint');
            }

            this.setAccessToken(accessToken);
            console.log("refreshed");
            // Assuming the same expiration time from the original token
            const { expiresIn } = this.getTokensFromStorage();
            if (expiresIn) {
                this.setExpirationTime(expiresIn);
            } else {
                console.warn('No expiration time found in local storage.');
            }

            return accessToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    },

    isTokenExpired() {
        const expiresIn = parseInt(localStorage.getItem('expiresIn'), 10);
        if (isNaN(expiresIn)) {
            console.error('Expiration time is invalid:', expiresIn);
            return true;
        }
        const currentTime = Date.now();
        return currentTime >= expiresIn;
    },

    async checkAndRefreshTokenIfNeeded() {
        if (this.isTokenExpired()) {
            const { refreshToken } = this.getTokensFromStorage();
            if (refreshToken) {
                try {
                    await this.refreshToken(refreshToken);
                } catch (error) {
                    console.error('Error during token refresh:', error);
                }
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

        console.log("Token refresh interval started");
        const tokenRefreshInterval = setInterval(refreshAccessToken, 60000);
        console.log(tokenRefreshInterval);

        return () => {
            console.log("Token refresh interval cleared");
            clearInterval(tokenRefreshInterval);
        };
    }, []);

    return null;
};

export default TokenRefreshHandler;
