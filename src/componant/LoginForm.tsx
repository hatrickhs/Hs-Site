import React, { useState } from "react";
import { api } from "../config/Api";
 

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/signin", { email, password });
      const token = response.data.token;

      localStorage.setItem("jwt", token);
      console.log("Token saved:", token);

      alert("Login successful!");
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed!");
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
