import { GET_USER, UPDATE_USER, LOGOUT_USER } from "./types";
import { initialState } from "./configs";

export const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_USER:
            return Object.assign({}, state, { user: action.payload })
        case UPDATE_USER:
            let tmpUser = { ...state.user.data, data: action.payload };
            return { ...state, user: tmpUser }
        case LOGOUT_USER:
            return initialState;
        default:
            return state;
    }
} 
