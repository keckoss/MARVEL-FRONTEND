import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./assets/Components/Header";
import Home from "./assets/Pages/Home";
import FichePersonnage from "./assets/Components/FichePersonnage";

import "./App.css";
import Personnages from "./assets/Pages/Personnages";
import Comics from "./assets/Pages/Comics";
import FicheComics from "./assets/Components/FicheComics";
import Favoris from "./assets/Pages/Favoris";
import Signup from "./assets/Components/Signup";
import Login from "./assets/Components/Login";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personnages" element={<Personnages />} />
        <Route path="/comics" element={<Comics />} />
        <Route path="/personnages/:id" element={<FichePersonnage />} />
        <Route path="/comics/:id" element={<FicheComics />} />
        <Route path="/favoris" element={<Favoris />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
