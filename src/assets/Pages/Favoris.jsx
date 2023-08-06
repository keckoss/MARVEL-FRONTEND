import React, { useState, useEffect } from "react";
import axios from "axios";
import Marveloading from "../img/marvel-loading.gif";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import config from "../Components/config";

function Favoris() {
  const [favorisPersonnagesIDs, setFavorisPersonnagesIDs] = useState([]);
  const [favorisComicsIDs, setFavorisComicsIDs] = useState([]);
  const [favorisPersonnagesData, setFavorisPersonnagesData] = useState([]);
  const [favorisComicsData, setFavorisComicsData] = useState([]);
  const token = Cookies.get("token");

  // Fonction pour obtenir les données d'un personnage depuis l'API
  const fetchPersonnageData = async (personnageId) => {
    try {
      const response = await axios.get(
        `${config.backendUrl}/comics/${personnageId}`
      );
      return response.data; // Retourner les données du personnage
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données du personnage :",
        error
      );
      return null;
    }
  };

  // Fonction pour obtenir les données d'un comic depuis l'API
  const fetchComicData = async (comicId) => {
    try {
      const response = await axios.get(`${config.backendUrl}/comic/${comicId}`);
      return response.data; // Retourner les données du comic
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données du comic :",
        error
      );
      return null;
    }
  };

  useEffect(() => {
    const fetchFavorisIDs = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/favorisids`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorisPersonnagesIDs(response.data.favorisPersonnagesIDs);
        setFavorisComicsIDs(response.data.favorisComicsIDs);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    };

    fetchFavorisIDs();
  }, [token]);

  useEffect(() => {
    const fetchDataForFavorites = async () => {
      // Récupérer les données pour chaque personnage en favoris
      const personnagePromises = favorisPersonnagesIDs.map((personnageId) =>
        fetchPersonnageData(personnageId)
      );

      // Récupérer les données pour chaque comic en favoris
      const comicPromises = favorisComicsIDs.map((comicId) =>
        fetchComicData(comicId)
      );

      // Attendre que toutes les promises se terminent
      const personnageData = await Promise.all(personnagePromises);
      const comicData = await Promise.all(comicPromises);

      // Filtrer les données nulles
      const filteredPersonnages = personnageData.filter(
        (data) => data !== null
      );
      const filteredComics = comicData.filter((data) => data !== null);

      setFavorisPersonnagesData(filteredPersonnages);
      setFavorisComicsData(filteredComics);
    };

    fetchDataForFavorites();
  }, [favorisPersonnagesIDs, favorisComicsIDs]);

  // Function to remove a favorite comic from the database and update the state and cookie
  const removeFavoriteComic = async (comicId) => {
    try {
      const response = await axios.post(
        `${config.backendUrl}/favoriscomics`,
        {
          id: comicId,
          add: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If the comic is successfully removed from the database, update the state to remove it from the page
      if (response.status === 200) {
        setFavorisComicsData((prevData) =>
          prevData.filter((comic) => comic._id !== comicId)
        );

        // Remove the comicId from the favorisList cookie as well
        const favorisListCookie = Cookies.get("favorisList");
        if (favorisListCookie) {
          const parsedFavorisList = JSON.parse(favorisListCookie);
          const updatedComicsList = parsedFavorisList.filter(
            (id) => id !== comicId
          );
          Cookies.set("favorisList", JSON.stringify(updatedComicsList));
        }
      }
    } catch (error) {
      console.error("Error while removing favorite:", error);
    }
  };

  // Function to remove a favorite character from the database and update the state and cookie
  const removeFavoriteCharacter = async (characterId) => {
    try {
      const response = await axios.post(
        `${config.backendUrl}/favorischaracter`,
        {
          id: characterId,
          add: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If the character is successfully removed from the database, update the state to remove it from the page
      if (response.status === 200) {
        setFavorisPersonnagesData((prevData) =>
          prevData.filter((character) => character._id !== characterId)
        );

        // Remove the characterId from the favorisList cookie as well
        const favorisListCookie = Cookies.get("favorisList");
        if (favorisListCookie) {
          const parsedFavorisList = JSON.parse(favorisListCookie);
          const updatedCharactersList = parsedFavorisList.filter(
            (id) => id !== characterId
          );
          Cookies.set("favorisList", JSON.stringify(updatedCharactersList));
        }
      }
    } catch (error) {
      console.error("Error while removing favorite:", error);
    }
  };

  return (
    <div className="globalcontain">
      <h1>Mes favoris</h1>
      <div className="favoris-container">
        <div className="comics-favoris">
          <h2>Favoris Comics</h2>
          {favorisComicsData.length > 0 ? (
            <ul>
              {favorisComicsData.map((comicData) => (
                <li key={comicData._id}>
                  <Link
                    to={`/comics/${comicData._id}`}
                    className="link comics"
                    style={{ textDecoration: "none" }}
                  >
                    <img
                      src={`${comicData.thumbnail.path}.${comicData.thumbnail.extension}`}
                      alt={comicData.title}
                      style={{ maxWidth: "150px" }}
                    />
                    <h3>{comicData.title}</h3>
                    <p>{comicData.description}</p>
                  </Link>
                  <button onClick={() => removeFavoriteComic(comicData._id)}>
                    Retirer des favoris
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun comic en favoris</p>
          )}
        </div>
        <div className="personnages-favoris">
          <h2>Favoris Personnages</h2>
          {favorisPersonnagesData.length > 0 ? (
            <ul>
              {favorisPersonnagesData.map((personnageData) => (
                <li key={personnageData._id}>
                  <Link
                    to={`/personnages/${personnageData._id}`}
                    className="link personnages"
                    style={{ textDecoration: "none" }}
                  >
                    <img
                      src={`${personnageData.thumbnail.path}.${personnageData.thumbnail.extension}`}
                      alt={personnageData.name}
                      style={{ maxWidth: "150px" }}
                    />
                    <h3>{personnageData.name}</h3>
                    <p>{personnageData.description}</p>
                  </Link>
                  <button
                    onClick={() => removeFavoriteCharacter(personnageData._id)}
                  >
                    Retirer des favoris
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun personnage en favoris</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Favoris;
