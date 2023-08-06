import React, { useState, useEffect } from "react";
import axios from "axios";
import Marveloading from "../img/marvel-loading.gif";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import config from "../Components/config";

function Comics() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 9; // Nombre de comics à afficher par page
  const token = Cookies.get("token");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Récupérer la liste des favoris depuis le cookie lors du chargement initial de la page
  const initialFavorisList = Cookies.get("favorisList")
    ? JSON.parse(Cookies.get("favorisList"))
    : [];
  const [favorisList, setFavorisList] = useState(initialFavorisList);

  // Mettre à jour le cookie avec la liste des favoris chaque fois que favorisList change
  useEffect(() => {
    Cookies.set("favorisList", JSON.stringify(favorisList));
  }, [favorisList]);

  const handleAddToFavorite = async (id) => {
    try {
      // Envoyer une requête POST au serveur pour ajouter le comics aux favoris de l'utilisateur
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skip = (page - 1) * perPage; // Calcul du nombre de résultats à ignorer pour afficher la page actuelle
        const response = await axios.get(
          `${config.backendUrl}/comics?title=${search}&limit=${perPage}&skip=${skip}`
        );
        setData(response.data.results);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, [search, page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return isLoading ? (
    <div className="container">
      <div className="loading">
        <img src={Marveloading} alt="Marvel Loading" />
      </div>
    </div>
  ) : (
    <div className="globalcontain">
      <h1>Liste des comics Marvel</h1>
      <div className="search-container">
        <input
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Rechercher un comics..."
        />
      </div>
      <div className="charalist">
        <ul>
          {data.map((comics) => (
            <div className="charadetail" key={comics._id}>
              <span
                onClick={() => handleAddToFavorite(comics._id)}
                className={
                  favorisList.includes(comics._id) ? "favorite" : "notfavorite"
                }
              ></span>
              <li key={comics._id}>
                <Link
                  to={`/comics/${comics._id}`}
                  className="link personnages"
                  key={comics._id}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <img
                    src={`${comics.thumbnail.path}.${comics.thumbnail.extension}`}
                    alt={comics.title}
                  />
                </Link>
                <h2>{comics.title}</h2>
                {/* <p>{comics.description}</p> */}
              </li>
            </div>
          ))}
        </ul>
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>
          Précédent
        </button>
        <button onClick={handleNextPage}>Suivant</button>
      </div>
    </div>
  );
}

export default Comics;
