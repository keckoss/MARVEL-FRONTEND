import axios from "axios";
import Marveloading from "../img/marvel-loading.gif";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://site--marvel-backend--54hcj7vln9rf.code.run/characters?name=${""}`
        );
        setData(response.data.results);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <div className="container">
      <div className="loading">
        <img src={Marveloading} alt="Marvel Loading" />
      </div>
    </div>
  ) : (
    <div className="globalcontain">
      <h1>Liste des personnages Marvel</h1>
      <div className="charalist">
        <ul>
          {data.map((character) => (
            <Link
              to={`/personnages/${character._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="charadetail" key={character._id}>
                <li key={character._id}>
                  <img
                    src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                    alt={character.name}
                  />
                  <h2>{character.name}</h2>
                  {/* <p>{character.description}</p> */}
                </li>
              </div>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
