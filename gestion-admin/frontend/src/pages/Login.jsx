import React, { useState } from "react";
import axios from 'axios';
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await axios.post('/api/admin/login', {
        email,
        password
      });

      if (response.status === 200) {
        // On sauvegarde la connexion
        localStorage.setItem("adminId", response.data._id);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/profil");
      }
    } catch (error) {
      console.error("Erreur de connexion: ", error);
      alert("Identifiants incorrects ou problème serveur.");
    }
  };

  return (
    <div className="card-container">
      <div className="card">
        <h4 className="title">Se Connecter</h4>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              autoComplete="off"
              placeholder="Email"
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <input
              autoComplete="off"
              placeholder="Password"
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn" type="submit">
            Valider
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
