import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

export const persistConfig = {
    key: 'root',
    storage
}

export const initialUserState = {
    user: {
        loggedIn: false,
        data: {
            id: "",
            name: "",
            email: "",
            token: null
        }
    }
}
export const initialSocketState = {
    socket: null
}


export const initialInventoryState = {
    pages: 0,
    perPage: 10,
    data: []
};