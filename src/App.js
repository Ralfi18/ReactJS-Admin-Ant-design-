import React from "react"
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
// import io from "socket.io-client";
import { AuthProvider, RequireAuth, RequireNotAuth } from "./Auth";
import LoginPage from "./components/LoginPage";
import MainLayout from "./components/Layout";
import Home from "./components/Home";
import Inventory from "./components/Inventory";
import { connect } from 'react-redux';
// import { SET_SOCKET, UPDATE_INVENTORY } from "./store/types";
// import { AuthContext, useAuth } from "./Auth";

function App({ user, inventory, dispatch }) {
	return (
		<div className="App">
			<AuthProvider loggedUser={user} dispatch={dispatch} >
				<Router>
					<Routes>
						<Route element={<RequireAuth><MainLayout /></RequireAuth>}>
							<Route path="/" element={<Home user={user} />} />
							<Route path="/inventory" element={<Inventory inventory={inventory} dispatch={dispatch} />} />
						</Route>
						<Route path="/login" element={<RequireNotAuth><LoginPage /></RequireNotAuth>} />
					</Routes>
				</Router>
			</AuthProvider>
		</div>
	);
}

const mapStateToProps = (state) => {
	return { 
		user: state.userReducer.user,
		inventory: state.inventory
	};
}

const mapDispatchToProps = (dispatch) => {
	return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
