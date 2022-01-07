import React, { useState, useEffect } from "react"
import { Routes, BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";
import io from "socket.io-client";
import { AuthProvider, RequireAuth, RequireNotAuth } from "./Auth";
import LoginPage from "./LoginPage";
import MainLayout from "./Layout";
import { connect } from 'react-redux';
import { SET_SOCKET } from "./store/types";

function Home({ socket }) {
	// const [socket, setSocket] = useState(null);
	const [message, setMessage] = useState("");
	// useEffect(() => {
	// 	const URL = "http://localhost:8080";
	// 	const tmpSocket = socket ? socket : io(URL, { autoConnect: true });
	// 	setSocket(tmpSocket);
	// 	tmpSocket.on("connect", () => {
	// 		tmpSocket.send("PING");
	// 		console.log(tmpSocket.id);
	// 	});
	// 	tmpSocket.on("disconnect", () => { console.log(socket.id + " disconnected"); });
	// }, []); // Only re-run the effect if count changes
	function handleSubmit(e) {
		e.preventDefault();
		console.log( socket )
		// socket.emit("message", message);
	}
	return (
		<>
			<form onSubmit={handleSubmit}>
				<input type="text" onChange={(event) => setMessage(event.target.value)} />
				<input type="submit" value="Submit" />
			</form>
		</>
	)
}
const About = () => (<h1>Test</h1>);

function App({ user, dispatch }) {

	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const URL = "http://localhost:8080";
		// console.log(socket)
		let tmpSocket = socket ? socket : io(URL, { autoConnect: true });
		setSocket(tmpSocket);
		console.log(tmpSocket)
		// tmpSocket.on("connect", () => {
		// 	tmpSocket.send("PING");
		// 	console.log(tmpSocket.id);
		// });
		// tmpSocket.on("disconnect", () => { console.log(socket.id + " disconnected"); });
	}, []); // Only re-run the effect if count changes

	return (
		<div className="App">
			<AuthProvider loggedUser={user} dispatch={dispatch} >
				<Router>
					<Routes>
						<Route element={<RequireAuth><MainLayout /></RequireAuth>}>
							<Route path="/" element={<Home socket={socket} />} />
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

	return { 
		user: state.userReducer.user
	};
}

const mapDispatchToProps = (dispatch) => {
	return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
