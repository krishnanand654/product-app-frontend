
import axios from 'axios';



const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
});


axiosInstance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {

        const originalRequest = error.config;

        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            // const refreshToken = localStorage.getItem('refreshToken');
            try {
                const response = await axios.get('http://localhost:3000/auth/refresh-token', {
                    withCredentials: true
                });
                if (response) {

                    localStorage.setItem('accessToken', response.data.accessToken);


                    originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;


                    return axiosInstance(originalRequest);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // window.location.href = "/";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
