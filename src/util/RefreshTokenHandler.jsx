import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RefreshTokenHandler = async () => {
    const nav = useNavigate();
    console.log("refreshing token");
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            throw new Error("No refresh token found");
        }

        const response = await axios.post('http://localhost:3000/auth/refresh-token', {
            refreshToken: refreshToken
        });

        if (response.data.accessToken) {
            localStorage.setItem("accessToken", response.data.accessToken);
            return true;
        } else {
            throw new Error("No access token in response");
        }
    } catch (error) {
        console.error("Failed to refresh token:", error);
        nav('/');
        return false;
    }
};

export default RefreshTokenHandler;
