
import * as React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { LOGIN_USER } from "./store/types";

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
    const signIn = (username, password, callback) => {
        // console.log(username, password)
        if(username && password) {
            fetch(`http://localhost:8080/get-user?username=${username}&password=${password}`)
                .then(response => response.json())
                .then(payload => {
                    if(payload) {
                        console.log(payload)
                        setErrors(null)
                        setUser(payload);
                        props.dispatch({ type: LOGIN_USER, payload });
                        callback();
                    }
                });
        } else {
            setErrors("Wrong user or password")
        }
    };
    const signout = (callback) => {
        setUser(null);
        callback();
    };
    const value = { user, errors, signIn, signout, setErrors };
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

