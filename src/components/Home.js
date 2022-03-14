import React, { useContext, useState } from "react"
import { AuthContext } from "../Auth";

export default function Home({ user }) {
	const [message, setMessage] = useState("");
	const context = useContext(AuthContext)

	function handleSubmit(e) {
		e.preventDefault();
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

