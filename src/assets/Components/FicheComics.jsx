import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Marveloading from "../img/marvel-loading.gif";
import Cookies from "js-cookie";

const FicheComics = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const token = Cookies.get("token");

  // Récupérer la liste des favoris depuis le cookie lors du chargement initial de la page
  const initialFavorisList = Cookies.get("favorisList")
    ? JSON.parse(Cookies.get("favorisList"))
    : [];
  const [favorisList, setFavorisList] = useState(initialFavorisList);

  useEffect(() => {
    axios
      .get(`${config.backendUrl}/comic/${id}`)
      .then((response) => {
        const selectedComic = response.data;
        setComic(selectedComic);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Une erreur s'est produite :", error);
      });
  }, [id]);

  useEffect(() => {
    // Update du cookie quand la favlist change
    Cookies.set("favorisList", JSON.stringify(favorisList));
  }, [favorisList]);

  const handleAddToFavorite = async (id) => {
    try {
      // Envoyer une requête POST au serveur pour ajouter le comic aux favoris de l'utilisateur
      await axios.post(
        `${config.backendUrl}/favoriscomics`,
        {
          id: id,
          add: !favorisList.includes(id), // Passer "add" à true s'il n'est pas encore dans les favoris, sinon à false pour le supprimer des favoris.
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Mettre à jour la liste des favoris localement
      if (!favorisList.includes(id)) {
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

  if (!comic) {
    return (
      <div className="container">
        <div className="loading">
          <img src={Marveloading} alt="Marvel Loading" />
        </div>
      </div>
    );
  }

  // verifier si comic dans fav
  const isComicInFavorites = (id) => {
    return favorisList.includes(id);
  };

  return (
    <div className="globalcontain">
      <h2>{comic.title}</h2>
      <img
        src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
        alt={comic.name}
      />
      <div className="ficheperso">
        <button onClick={() => handleAddToFavorite(comic._id)}>
          {isComicInFavorites(comic._id)
            ? "Retirer des favoris"
            : "Ajouter aux favoris"}
        </button>

        {/* <p>{comic.description}</p> */}
      </div>
    </div>
  );
};

export default FicheComics;
