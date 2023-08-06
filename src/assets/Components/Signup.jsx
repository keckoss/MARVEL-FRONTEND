import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import config from "./config";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    newsletter: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${config.backendUrl}/signup`,
        formData
      );

      setErrorMessage("");
      setSuccessMessage(`Merci pour votre inscription, ${formData.username}!`);
      setSubmitted(true);
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 }); // Save token for 7 days
      }

      // Vous pouvez effectuer d'autres traitements avec les données de la réponse ici
    } catch (error) {
      setSuccessMessage("");
      setSubmitted(true);

      if (error.response) {
        if (error.response.status === 409) {
          setErrorMessage("Un utilisateur avec ces informations existe déjà.");
        } else {
          setErrorMessage("Une erreur est survenue lors de l'inscription.");
        }
      } else {
        setErrorMessage("Une erreur est survenue lors de l'inscription.");
      }
    }
  };

  const handleRetry = () => {
    setErrorMessage("");
    setSubmitted(false);
  };

  if (submitted) {
    if (successMessage) {
      setTimeout(() => {
        window.location.href = "/"; // Redirection après inscription réussie
      }, 5000);

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
    <form className="signupform" onSubmit={handleSubmit}>
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
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
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
      <label>
        Newsletter:
        <input
          type="checkbox"
          name="newsletter"
          checked={formData.newsletter}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default Signup;
