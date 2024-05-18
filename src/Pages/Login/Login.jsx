import { Input, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Login.css';



const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(false);
    const [switchRegister, setSwitchRegister] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(e.target)
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };


    useEffect(() => {

        if (switchRegister == false) {
            if (credentials.username != '' && credentials.password != '') {
                setValid(true);
            } else {
                setValid(false);
            }

        } else {

            if (credentials.username != '' && credentials.password != '' && credentials.email != '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(credentials.email)) {
                    setValid(true);
                } else {
                    setValid(false);
                }
            } else {
                setValid(false);
            }
        }



    }, [credentials])


    console.log(credentials)

    const handleLogin = async () => {

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:3000/auth/login", {
                username: credentials.username,
                password: credentials.password
            });
            if (response.status == 200) {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                localStorage.setItem("expiresIn", response.data.expiresIn);
                setLoading(false);
                navigate('/home');
            }

        } catch (error) {
            console.error('Error login:', error.response.status);
            if (error.response.status == 401) {
                setErrorMessage("Incorrect username or password")
                setError(true)
                setLoading(false);
            }
        }
    }

    const handleRegister = async () => {

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:3000/auth/register", {
                username: credentials.username,
                password: credentials.password,
                email: credentials.email
            });
            if (response.status == 201) {
                setLoading(false);
            } else {
                console.log(response)
            }

        } catch (error) {
            console.error('Error login:', error.response.status);
            if (error.response.status == 400) {
                setErrorMessage(error.response.data.message)
                setError(true)
                setLoading(false);
            }
        }
    }




    return (
        <div className="flex justify-center">

            <div className="login-ctn flex-col gap-4 lg:w-96 md:w-full sm:w-full">
                <img src="https://i.pinimg.com/originals/01/39/93/0139937c2f641ab61fd020844ccfd459.png" className="w-12" />
                <h1 className="font-medium text-2xl">Login</h1>
                <p>Not a user ? <button className="font-medium underline" onClick={() => { setSwitchRegister(!switchRegister) }}>{switchRegister ? "Sign in" : "Join us"}</button></p>
                {error && <p className=" text-red-500">{errorMessage}</p>}
                <div className="flex flex-wrap gap-4 flex-row ">
                    {switchRegister && <Input type="email" label="Email" name="email" onChange={handleChange} className=" lg:w-96 md:w-full sm:w-full" isRequired />}
                    <Input type="text" label="Username" name="username" onChange={handleChange} className=" lg:w-96 md:w-full sm:w-full" isRequired />
                    <Input type="password" label="Password" name="password" onChange={handleChange} className=" lg:w-96 md:w-full sm:w-full" isRequired />
                    <div className="w-full flex justify-end " >
                        {switchRegister ? <Button radius="full" className="bg-black text-white font-medium" onClick={handleRegister} isLoading={loading} isDisabled={!valid} >
                            Join us
                        </Button>
                            :
                            <Button radius="full" className="bg-black text-white font-medium" onClick={handleLogin} isLoading={loading} isDisabled={!valid} >
                                Sign in
                            </Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
