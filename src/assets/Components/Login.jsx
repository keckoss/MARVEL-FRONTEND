import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "./config";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [username, setUsername] = useState(""); // State pour stocker l'username

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.backendUrl}/login`, formData);

      setErrorMessage("");
      setSuccessMessage("Connexion réussie !");
      setSubmitted(true);

      const username = response.data.username;
      setUsername(username);
      // Sauvegarde du token dans les cookies
      Cookies.set("token", response.data.token, { expires: 7 }); // Le token expire dans 7 jours
      Cookies.set("username", response.data.username, { expires: 7 });

      // Redirection après connexion réussie (ici, on redirige vers la page d'accueil)
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      setSuccessMessage("");
      setSubmitted(true);

      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Email ou mot de passe incorrect.");
        } else {
          setErrorMessage("Une erreur est survenue lors de la connexion.");
        }
      } else {
        setErrorMessage("Une erreur est survenue lors de la connexion.");
      }
    }
  };

  const handleRetry = () => {
    setErrorMessage("");
    setSubmitted(false);
  };

  if (submitted) {
    if (successMessage) {
      return <div>{successMessage}</div>;
    } else if (errorMessage) {
      return (
        <div>
          {errorMessage}
          <br />
          <button onClick={handleRetry}>Réessayer</button>
        </div>
      );
    }
  }

  return (
    <form className="loginform" onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default Login;
