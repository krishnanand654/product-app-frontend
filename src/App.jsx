import Login from './Pages/Login/Login'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home/Home'
import './App.css'
// import { useSelector } from 'react-redux';
import Error from './Pages/Error/Error';

function App() {
  const loginStatus = localStorage.getItem("accessToken")

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={loginStatus ? <Home /> : <Error />} />
      </Routes>

    </>
  )
}

export default App
