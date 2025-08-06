import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Episodes from "./pages/Episodes/Episodes";
import EpisodeDetail from "./components/EpisodeDetail/EpisodeDetail";
import SpecialEpisodesList from "./pages/SpecialEpisodesList/SpecialEpisodesList";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import styles from "./App.module.css";
import {
  getFavoritesFromStorage,
  saveFavoritesToStorage,
} from "./utils/localStorage";

export default function App() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = getFavoritesFromStorage(); // Kalder utility function til at hente data
    setFavorites(savedFavorites); // Opdaterer state med de gemte favoritter
  }, []);

  useEffect(() => {
    saveFavoritesToStorage(favorites); // Kalder utility function med aktuelt favorites state
  }, [favorites]);

  const toggleFavorites = (id) => {
    if (favorites.includes(id)) {
      // Hvis produkt-ID allerede er i favoritter, fjern det
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      // Hvis produkt-ID ikke er i favoritter, tilføj det via spread operator
      setFavorites([...favorites, id]);
    }
  };
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Routes>
          <Route
            path="/"
            element={
              <Home favorites={favorites} toggleFavorites={toggleFavorites} />
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/episodes"
            element={
              <Episodes
                favorites={favorites}
                toggleFavorites={toggleFavorites}
              />
            }
          />
          <Route
            path="/episodes/:Id"
            element={
              <EpisodeDetail
                favorites={favorites}
                toggleFavorites={toggleFavorites}
              />
            }
          />
          <Route
            path="/specials/:categoryName"
            element={
              <SpecialEpisodesList
                favorites={favorites}
                toggleFavorites={toggleFavorites}
              />
            }
          />
        </Routes>
      </main>
      <CookieBanner />
      <Footer />
    </div>
  );
}
