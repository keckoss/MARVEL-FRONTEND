import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Marveloading from "../img/marvel-loading.gif";
import { Link } from "react-router-dom";

const FichePersonnage = () => {
  const { id } = useParams();
  const [personnage, setPersonnage] = useState(null);

  useEffect(() => {
    axios
      .get(`${config.backendUrl}/favoriscomics/${id}`)
      .then((response) => {
        const selectedPersonnage = response.data;
        setPersonnage(selectedPersonnage);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Une erreur s'est produite :", error);
      });
  }, [id]);

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
        <img
          src={`${personnage.thumbnail.path}.${personnage.thumbnail.extension}`}
          alt={personnage.name}
        />

        <p>{personnage.name}</p>
        <p>{personnage.description}</p>
      </div>
      <div>
        <p>Apparait dans</p>
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
