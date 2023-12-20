import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import { api } from "../../lip/fetch-config";


const Login = () => {
    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined
    })
    
    const navigate = useNavigate()

    const handleChange = (e) => {
        setCredentials((prev) => ({...prev, [e.target.id]: e.target.value}))
    }

    const handleClick = async (e) => {
        e.preventDefault()
        dispatch({type: "LOGIN_START"})
        try {
            const res = await api.post("/api/auth/login", credentials)
            if(res.data.isAdmin) {
              dispatch({type: "LOGIN_SUCCESS", payload: res.data.details})
              navigate("/")
            } else {
              dispatch({type: "LOGIN_FAILURE", payload: {message: "You are not allowed."}})
            }
            
        } catch (err) {
            dispatch({type: "LOGIN_FAILURE", payload: err.response.data})
        }
    }


    const {loading, error, dispatch} = useContext(AuthContext)

    return(
        <div className="login">
            <div className="lContainer">
                <input 
                    type="text"
                    className="lInput"
                    placeholder="username"
                    id="username"
                    onChange={handleChange} 
                />
                <input 
                    type="password"
                    className="lInput"
                    placeholder="password"
                    id="password"
                    onChange={handleChange} 
                />
                <button className="lButton" onClick={handleClick} disabled={loading}>
                    Login
                </button>
                {error && <span>{error.message}</span>}
            </div>
        </div>
    )
}

export default Login