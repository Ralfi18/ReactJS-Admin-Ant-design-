import { 
    LOGIN_USER, 
    UPDATE_USER, 
    LOGOUT_USER, 
    SET_SOCKET, 
    DELETE_SOCKET,
    SET_INVENTORIES,
    CLEAR_INVENTORY,
    UPDATE_INVENTORY
} from "./types";
import { initialUserState, initialSocketState, initialInventoryState } from "./configs";

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


export const inventoryReducer = (state = initialInventoryState, action) => {
    switch(action.type) {
        case SET_INVENTORIES:
            return Object.assign({}, state, { data: action.payload })
        case UPDATE_INVENTORY:
            const inventory = [...state.data];
            const index = inventory.findIndex(x => x.id == action.payload.id);
            console.log(action.payload)
            if(inventory[index]) {
                console.log(inventory[index])
                inventory[index] = action.payload;
            }
            const new_state = { ...state, data: inventory }
            return new_state;
        case CLEAR_INVENTORY:
            return initialInventoryState
        default:
            return state;
    }
} 
