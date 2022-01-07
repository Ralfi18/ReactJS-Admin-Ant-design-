import { LOGIN_USER, UPDATE_USER, LOGOUT_USER, SET_SOCKET, DELETE_SOCKET } from "./types";
import { initialUserState, initialSocketState } from "./configs";

export const userReducer = (state = initialUserState, action) => {
    switch(action.type) {
        case LOGIN_USER:
            return Object.assign({}, state, { user: action.payload })
        case UPDATE_USER:
            let tmpUser = { ...state.user.data, data: action.payload };
            return { ...state, user: tmpUser }
        case LOGOUT_USER:
            return initialUserState;
        default:
            return state;
    }
} 

export const socketReducer = (state = initialSocketState, action) => {
    switch(action.type) {
        case SET_SOCKET:
            return Object.assign({}, state, { socket: action.payload })
        // case UPDATE_USER:
        //     let tmpUser = { ...state.user.data, data: action.payload };
        //     return { ...state, user: tmpUser }
        case DELETE_SOCKET:
            return initialSocketState
        default:
            return state;
    }
} 
