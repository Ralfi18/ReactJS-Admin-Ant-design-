import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import { persistConfig } from "./configs";
import { userReducer } from "./reducers";

const rootReducer = combineReducers({ userReducer })
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()); 
const persistor = persistStore(store);

export { store, persistor }
 