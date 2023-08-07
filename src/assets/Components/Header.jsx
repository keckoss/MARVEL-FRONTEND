import React, { useState, useEffect } from "react";
import Marvelogo from "../img/marvel-logo.png";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Vérifie si l'utilisateur est connecté en vérifiant la présence du token dans les cookies
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const [username, setUsername] = useState("");

  useEffect(() => {
    const savedUsername = Cookies.get("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  });

  const handleLogout = () => {
    // Déconnexion en supprimant le token des cookies
    Cookies.remove("token");
    Cookies.remove("username");
    setIsLoggedIn(false);
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="header">
      <div>
        <Link to="/">
          <img className="logoimg" src={Marvelogo} alt="Marvel logo" />
        </Link>
      </div>
      <p className="nameheader">Bonjour {username}</p>
      <div className="menudesktop">
        <Link to="/personnages">
          <span className="buttonheader">Personnages</span>
        </Link>
        <Link to="/comics">
          <span className="buttonheader">Comics</span>
        </Link>
        {isLoggedIn ? (
          <Link to="/favoris">
            <span className="buttonheader">Favoris</span>
          </Link>
        ) : (
          <div></div>
        )}

        {isLoggedIn ? (
          <Link onClick={handleLogout}>
            <span className="buttonheader">Se déconnecter</span>
          </Link>
        ) : (
          <Link to="/login">
            <span className="buttonheader">Connexion</span>
          </Link>
        )}
        {isLoggedIn ? (
          <div></div>
        ) : (
          <Link to="/signup">
            <span className="buttonheader">Inscription</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
