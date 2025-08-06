import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import EpisodeCard from "../../components/EpisodeCard/EpisodeCard";
import styles from "./SpecialEpisodesList.module.css";

export default function SpecialEpisodesList({ favorites, toggleFavorites }) {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decode the category name from the URL
  const decodedCategoryName = decodeURIComponent(categoryName);

  useEffect(() => {
    document.title = `${decodedCategoryName} Episodes - ReCall The Midwife`;
  }, [decodedCategoryName]);

  useEffect(() => {
    const fetchCategoryEpisodes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/episodes.json");

        if (!response.ok) {
          throw new Error("Failed to fetch episodes data");
        }

        const allEpisodes = await response.json();

        // Filter for episodes that are Special and match the category
        const filteredEpisodes = allEpisodes.filter(
          (episode) =>
            episode.Special === true &&
            episode["Type special"] === decodedCategoryName
        );

        // Sort by ID (or you could sort by date)
        const sortedEpisodes = filteredEpisodes.sort((a, b) => a.Id - b.Id);

        setEpisodes(sortedEpisodes);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching category episodes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryEpisodes();
  }, [decodedCategoryName]);

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <main className={styles.specialEpisodesMain}>
        <div className={styles.loadingContainer}>
          <p>Loading {decodedCategoryName} episodes...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.specialEpisodesMain}>
        <div className={styles.errorContainer}>
          <h1>Error Loading Episodes</h1>
          <p>{error}</p>
          <button onClick={handleBackClick} className={styles.backButton}>
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.specialEpisodesMain}>
      {/* Header Section */}
      <section className={styles.headerSection}>
        <button
          onClick={handleBackClick}
          className={styles.backButton}
          aria-label="Go back to previous page"
        >
          <FaArrowLeft /> Back
        </button>

        <div className={styles.categoryHeader}>
          <h1 className={styles.categoryTitle}>{decodedCategoryName}</h1>
          <p className={styles.episodeCount}>
            {episodes.length === 0
              ? "No episodes found"
              : `${episodes.length} ${
                  episodes.length === 1 ? "Episode" : "Episodes"
                }`}
          </p>
        </div>
      </section>

      {/* Episodes Container */}
      <section className={styles.episodesContainer}>
        {episodes.length === 0 ? (
          <div className={styles.noEpisodesContainer}>
            <h2>No Episodes Found</h2>
            <p>
              There are currently no {decodedCategoryName} episodes available.
            </p>
            <button onClick={handleBackClick} className={styles.backButton}>
              <FaArrowLeft /> Go Back
            </button>
          </div>
        ) : (
          <div className={styles.episodesGrid}>
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.Id}
                episode={episode}
                favorites={favorites}
                toggleFavorites={toggleFavorites}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
