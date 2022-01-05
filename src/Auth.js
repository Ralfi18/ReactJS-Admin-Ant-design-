
import * as React from "react";
import { useLocation, Navigate } from "react-router-dom";

export const AuthContext = React.createContext(null);
export function useAuth() {
    return React.useContext(AuthContext);
}
export function UserConsumer() {
    return AuthContext.Consumer;
}
export function AuthProvider({ children, ...props }) {
    const [user, setUser] = React.useState(props.user || null);
    const [errors, setErrors] = React.useState(null);
    const signIn = (username, password, callback) => {
        if(username == "rali" && password == "123") {
            setErrors(null)
            setUser(username);
            callback();
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
    if ( ! auth.user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }
    return children;
}

