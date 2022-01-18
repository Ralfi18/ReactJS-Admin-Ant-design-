
import React, { useContext, useState, useEffect } from "react"
import { useLocation, Navigate } from "react-router-dom";
import { LOGIN_USER, LOGOUT_USER } from "./store/types";
import io from "socket.io-client";
import { message as antd_message  } from 'antd';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {

    return { 
        user: state.userReducer.user
    };
}

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
};


export const AuthContext = React.createContext(null);
export function useAuth() {
    return React.useContext(AuthContext);
}
export function UserConsumer() {
    return AuthContext.Consumer;
}




export function AuthProvider({ children, ...props }) {
    console.log(props)
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
        if(socket && socket.id) {
            socket.emit("logout", socket.id);
        }
        setUser(null);
        setSocket(null);
        callback();
    };
    // Imitates componentDidUpdate but only if user is updated
    useEffect(() => {
        // console.log("props.loggedUser", )
        if(user && user.loggedIn) {
            console.log("loggedIn", socket)
            const URL = "http://localhost:8080";
            const tmpSocket = socket ? socket : io(URL, { autoConnect: true });

            setSocket(tmpSocket);
            if(tmpSocket) {
                tmpSocket.on("connect", (socket) => {
                    if( ! props.loggedUser.loggedIn) {
                        tmpSocket.emit("appInit", { token: user.data.token, msg: "message" });
                    }
                    console.log("Cnnect", props.loggedUser.loggedIn, user)
                });
                tmpSocket.on("disconnect", () => {
                    console.log(socket)
                    // setUser(null);
                    // props.dispatch({ type: LOGOUT_USER, payload: null });
                    // tmpSocket.emit("logout", tmpSocket.id);
                    // setSocket(null);

                    // window.location.href = window.location.href;
                });
                tmpSocket.on("connect_error", (err) => {
                    // window.location.href = window.location.href;
                    console.log("Try to reconect!")
                });
                /** */
                tmpSocket.on('login', function(msg) {    
                    console.log(tmpSocket.id)
                    console.log( "Login message: " + msg )
                    antd_message.success(msg, 3);
                });
                tmpSocket.on('hey', function(msg) {    
                    // console.log(tmpSocket.id)
                    console.log( "Hey: " + msg )
                });

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

