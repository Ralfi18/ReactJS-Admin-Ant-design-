import React, { useEffect } from "react"
import { Routes, BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";
import io from "socket.io-client";
import { AuthProvider, RequireAuth, useAuth, UserConsumer } from "./Auth";
import LoginPage from "./LoginPage";
import MainLayout from "./Layout";


function Home() {
  return(<h1>Home</h1>)
}
const About = () => (<h1>Test</h1>);

function App() {
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
      <AuthProvider>
      <Router>
        <Routes>
          <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="/login" element={<LoginPage />} /> 
          {/* <Route path="about" element={<About />} /> */}
        </Routes>
      </Router>  
      </AuthProvider>
    </div>
  );
}

export default App;
