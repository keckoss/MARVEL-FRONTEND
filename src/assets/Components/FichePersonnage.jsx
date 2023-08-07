import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Marveloading from "../img/marvel-loading.gif";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const FichePersonnage = () => {
  const { id } = useParams();
  const [personnage, setPersonnage] = useState(null);
  const token = Cookies.get("token");

  // Récupérer la liste des favoris depuis le cookie lors du chargement initial de la page
  const initialFavorisList = Cookies.get("favorisList")
    ? JSON.parse(Cookies.get("favorisList"))
    : [];
  const [favorisList, setFavorisList] = useState(initialFavorisList);

  useEffect(() => {
    axios
      .get(`https://site--marvel-backend--54hcj7vln9rf.code.run/comics/comics/${id}`)
      .then((response) => {
        const selectedPersonnage = response.data;
        setPersonnage(selectedPersonnage);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Une erreur s'est produite :", error);
      });
  }, [id]);

  const handleAddToFavorite = async (id) => {
    try {
      // Envoyer une requête POST au serveur pour ajouter le personnage aux favoris de l'utilisateur
      await axios.post(
        "https://site--marvel-backend--54hcj7vln9rf.code.run/comics/favorischaracter",
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

      // Mettre à jour le cookie avec la liste des favoris (after the state update)
      Cookies.set("favorisList", JSON.stringify(favorisList));
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

  // Function to check if the character is already in favorites
  const isCharacterInFavorites = (id) => {
    return favorisList.includes(id);
  };

  return (
    <div className="globalcontain">
      <div className="ficheperso">
        {/* Button to add/remove from favorites */}
        <button
          onClick={() => handleAddToFavorite(personnage._id)}
          className={
            isCharacterInFavorites(personnage._id)
              ? "favorite"
              : "notfavorite"
          }
        >
          {isCharacterInFavorites(personnage._id) ? "Remove Favorite" : "Add to Favorite"}
        </button>

        <img
          src={`${personnage.thumbnail.path}.${personnage.thumbnail.extension}`}
          alt={personnage.name}
        />

        <h2>{personnage.name}</h2>
        <p className="description-text">{personnage.description}</p>
      </div>
      <div className="footperso">
        <h2>Ce personnage apparait dans les comics suivants</h2>
        <div className="charalist">
          <ul>
            {personnage.comics.map((comic) => (
              <Link
                to={`/comics/${comic._id}`}
                className="link personnages"
                key={comic._id}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="charadetail" key={comic._id}>
                  <li>
                    <img
                      src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                      alt={comic.title}
                    />
                    <h2>{comic.title}</h2>
                    {/* <p>{comic.description}</p> */}
                  </li>
                </div>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FichePersonnage;
