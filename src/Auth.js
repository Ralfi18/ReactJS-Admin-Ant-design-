
import React, { useContext, useState, useEffect } from "react"
import { useLocation, Navigate } from "react-router-dom";
import { LOGIN_USER } from "./store/types";
import io from "socket.io-client";


export const AuthContext = React.createContext(null);
export function useAuth() {
    return React.useContext(AuthContext);
}
export function UserConsumer() {
    return AuthContext.Consumer;
}
export function AuthProvider({ children, ...props }) {
    const [user, setUser] = React.useState(null || props.loggedUser);
    const [errors, setErrors] = React.useState(null);
    const [socket, setSocket] = React.useState(null);
    const signIn = (username, password, callback) => {
        if(username && password) {
            fetch(`http://localhost:8080/get-user?username=${username}&password=${password}`)
                .then(response => response.json())
                .then(payload => {
                    if(payload) {
                        if(payload && payload.loggedIn) {
                            setErrors(null)
                            setUser(payload);
                            props.dispatch({ type: LOGIN_USER, payload });
                            return callback();
                        }
                    }
                    setErrors("Wrong user or password")
                });
        } else {
            setErrors("Wrong user or password")
        }
    };
    const signOut = (callback) => {
        setUser(null);
        callback();
    };
    // Imitates componentDidUpdate but only if user is updated
    useEffect(() => {
        if(user && user.loggedIn) {
            const URL = "http://localhost:8080";
            const tmpSocket = socket ? socket : io(URL, { autoConnect: true });
            setSocket(tmpSocket);
            if(tmpSocket) {
                tmpSocket.on("connect", () => {console.log("SOCKET CONNECTED: ", tmpSocket.id); });
                tmpSocket.on("disconnect", () => {  console.log(tmpSocket.id + " disconnected"); });
                tmpSocket.on("connect_error", () => { console.log('ERROR') });
            }
        }
    }, [user]); 
    const value = { user, errors, signIn, signOut, setErrors, socket };
    return <AuthContext.Provider value={value} >{children}</AuthContext.Provider>;
}
export function RequireAuth({ children }) {
    const auth = useAuth();
    const location = useLocation();
    if ( ! auth.user || !auth.user.loggedIn) {
        return <Navigate to="/login" state={{ from: location }} />;
    }
    return children;
}

export function RequireNotAuth({ children }) {
    const auth = useAuth();
    const location = useLocation();
    if (auth.user && auth.user.loggedIn) {
        return <Navigate to="/" state={{ from: location }} />;
    }
    return children;
}

