
import React, { useContext, useState, useEffect } from "react"
import { useLocation, Navigate } from "react-router-dom";
import { LOGIN_USER, LOGOUT_USER, SET_INVENTORIES, CLEAR_INVENTORY, UPDATE_INVENTORY} from "./store/types";
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
    console.log("AuthProvider")
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
            // console.log("loggedIn", socket)
            const URL = "http://localhost:8080";
            const tmpSocket = io(URL, { autoConnect: true });
    
            if(tmpSocket && !socket) {
                setSocket(tmpSocket);
                tmpSocket.on("connect", (socket) => {
                    if( ! props.loggedUser.loggedIn) {
                        /** Fetch initial data */
                        tmpSocket.emit("loadProducts", { token: user.data.token });
                    }
                    tmpSocket.emit("appInit", { token: user.data.token, msg: "message" });
                    console.log("Connect", props.loggedUser.loggedIn, user)
                });
                tmpSocket.on("disconnect", () => {
                    // console.log(socket)
                    // setUser(null);
                    // props.dispatch({ type: LOGOUT_USER, payload: null });
                    // tmpSocket.emit("logout", tmpSocket.id);
                    // setSocket(null);

                    // window.location.href = window.location.href;
                });
                tmpSocket.on("loadProducts", (data) => {
                    // window.location.href = window.location.href;
                    // console.log("Try to reconect!")
                    if(data && data.length) {
                        const inventory = JSON.parse(data); 
                        props.dispatch({ type: SET_INVENTORIES, payload: inventory });
                    }
                });
                tmpSocket.on("connect_error", (err) => {
                    // window.location.href = window.location.href;
                    // console.log("Try to reconect!")
                });
                /** */
                tmpSocket.on('login', function(msg) {    
                    // console.log(tmpSocket.id)
                    // console.log( "Login message: " + msg )
                    antd_message.success(msg, 3);
                });
                tmpSocket.on('logout', function(msg) {    
                    setUser(null);
                    props.dispatch({ type: LOGOUT_USER, payload: null });
                    props.dispatch({ type: CLEAR_INVENTORY, payload: null });
                    tmpSocket.emit("logout", tmpSocket.id);
                    setSocket(null);
                });
                tmpSocket.on('updateProduct', function(json) {   
                    console.log("updateProduct") 
                    if(json && json.length) {
                        const product = JSON.parse(json);
                        if(product && product.length == 1) {
                            console.log(product[0])
                            props.dispatch({ type: UPDATE_INVENTORY, payload: product[0] });
                        }
                    }
                });
                tmpSocket.on('hey', function(msg) {    
                    // console.log(tmpSocket.id)
                    // console.log( "Hey: " + msg )
                });
                tmpSocket.on('message', function(msg) {    
                    // console.log(tmpSocket.id)
                    // console.log( "Message: " + msg )
                    antd_message.success(msg, 3);
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

