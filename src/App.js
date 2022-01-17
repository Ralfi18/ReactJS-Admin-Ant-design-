import React, { useContext, useState, useEffect } from "react"
import { Routes, BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";
import io from "socket.io-client";
import { AuthProvider, RequireAuth, RequireNotAuth } from "./Auth";
import LoginPage from "./LoginPage";
import MainLayout from "./Layout";
import { connect } from 'react-redux';
import { SET_SOCKET } from "./store/types";
import { AuthContext, useAuth } from "./Auth";
function Home({ user }) {
	// const [socket, setSocket] = useState(null);
	const [message, setMessage] = useState("");
	const context = useContext(AuthContext)
	useEffect(() => {
		// console.log( context.socket )
		if(context.socket) {
			// console.log("HOME: ", context.socket)
			context.socket.on('message', function(msg) {    
				// console.log(context.socket.id)
				console.log( "Message: " + msg )
			});
		}

	}, []);
	function handleSubmit(e) {
		e.preventDefault();
		// console.log(context.socket)
		// console.log(context.socket.id)
		console.log(user.data.token)
		context.socket.emit("message", { token: user.data.token, msg: message });
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
	return (
		<div className="App">
			<AuthProvider loggedUser={user} dispatch={dispatch} >
				<Router>
					<Routes>
						<Route element={<RequireAuth><MainLayout /></RequireAuth>}>
							<Route path="/" element={<Home user={user} />} />
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
