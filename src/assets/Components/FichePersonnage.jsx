import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Marveloading from "../img/marvel-loading.gif";
import Cookies from "js-cookie";
import config from "./config";

const FichePersonnage = () => {
  const { id } = useParams();
  const [personnage, setPersonnage] = useState(null);
  const token = Cookies.get("token");

  // Récupérer la liste des favoris depuis le cookie lors du chargement initial de la page
  const initialFavorisList = Cookies.get("favorisList")
    ? JSON.parse(Cookies.get("favorisList"))
    : [];
  const [favorisList, setFavorisList] = useState(initialFavorisList);

  // État pour stocker la liste des comics où apparaît le personnage
  const [comics, setComics] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.backendUrl}/comics/${id}`)
      .then((response) => {
        const selectedPersonnage = response.data;
        setPersonnage(selectedPersonnage);
        // Récupérer la liste des comics où apparaît le personnage à partir de la réponse de l'API
        setComics(selectedPersonnage.comics);
      })
      .catch((error) => {
        console.error("Une erreur s'est produite :", error);
      });
  }, [id]);

  useEffect(() => {
    // Mettre à jour le cookie avec la liste des favoris à chaque changement de l'état favorisList
    Cookies.set("favorisList", JSON.stringify(favorisList));
  }, [favorisList]);

  // Vérifier si l'ID du personnage est déjà dans les favoris
  const isPersonnageInFavorites = (id) => {
    return favorisList.includes(id);
  };

  const handleAddToFavorite = async (id) => {
    try {
      // Envoyer une requête POST au serveur pour ajouter le personnage aux favoris de l'utilisateur
      await axios.post(
        `${config.backendUrl}/favorischaracter`,
        {
          id: id,
          add: !isPersonnageInFavorites(id), // Passer "add" à true s'il n'est pas encore dans les favoris, sinon à false pour le supprimer des favoris.
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Mettre à jour la liste des favoris localement
      if (!isPersonnageInFavorites(id)) {
        setFavorisList([...favorisList, id]);
      } else {
        setFavorisList(favorisList.filter((favoriId) => favoriId !== id));
      }
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de l'ajout aux favoris :",
        error
      );
    }
  };

  if (!personnage) {
    return (
      <div className="container">
        <div className="loading">
          <img src={Marveloading} alt="Marvel Loading" />
        </div>
      </div>
    );
  }

  return (
    <div className="globalcontain">
      <div className="ficheperso">
        <h2>{personnage.name}</h2>
        <img
          src={`${personnage.thumbnail.path}.${personnage.thumbnail.extension}`}
          alt={personnage.name}
        />
        <p>{personnage.description}</p>

        <h3>Comics où apparaît {personnage.name}:</h3>
        <div className="comics-grid">
          {comics.map((comic) => (
            <div key={comic._id} className="comic-card">
              <img
                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                alt={comic.title}
              />
              <h4>{comic.title}</h4>
              {/* Vous pouvez également afficher la description du comic ici */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FichePersonnage;
