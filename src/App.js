import React, { useEffect } from "react"
import { Routes, BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";
import io from "socket.io-client";
import { AuthProvider, RequireAuth, RequireNotAuth } from "./Auth";
import LoginPage from "./LoginPage";
import MainLayout from "./Layout";
import { connect } from 'react-redux';

function Home() {
	return (<h1>Home</h1>)
}
const About = () => (<h1>Test</h1>);

function App({ user, dispatch }) {
	// useEffect(() => {
	//   const URL = "http://localhost:8080";
	//   const socket = io(URL, { autoConnect: true });
	//   console.log(socket)
	//   socket.emit('chat message', "ping");
	//   socket.on("connect", () => {  console.log(socket.id); });
	//   socket.on("disconnect", () => {  console.log(socket.id + " disconnected"); });
	// }, []); // Only re-run the effect if count changes
	// const user = localStorage.getItem('user');

	return (
		<div className="App">
			<AuthProvider loggedUser={user} dispatch={dispatch} >
				<Router>
					<Routes>
						<Route element={<RequireAuth><MainLayout /></RequireAuth>}>
							<Route path="/" element={<Home />} />
							<Route path="/about" element={<About />} />
						</Route>
						<Route path="/login" element={<RequireNotAuth><LoginPage /></RequireNotAuth>} />
		
					</Routes>
				</Router>
			</AuthProvider>
		</div>
	);
}

const mapStateToProps = (state) => {
	return { user: state.userReducer.user };
}

const mapDispatchToProps = (dispatch) => {
	return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
