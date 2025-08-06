import styles from "./CategoryEpisodesView.module.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import EpisodeReview from "../components/EpisodeReview/EpisodeReview";
import LikeCounter from "../components/LikeCounter/LikeCounter";

export default function CategoryEpisodesView({ favorites, toggleFavorites }) {
  const { categoryName } = useParams(); // Get category from URL
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Decode the category name from URL
  const decodedCategoryName = decodeURIComponent(categoryName);

  useEffect(() => {
    const fetchCategoryEpisodes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/episodes.json");

        if (!response.ok) {
          throw new Error(`Failed to fetch episodes data: ${response.status}`);
        }

        const allEpisodes = await response.json();

        // Filter for special episodes with matching "Type special"
        const categoryEpisodes = allEpisodes.filter(
          (episode) =>
            episode.Special === true &&
            episode["Type special"] === decodedCategoryName
        );

        // Sort by ID to maintain order
        const sortedEpisodes = categoryEpisodes.sort((a, b) => a.Id - b.Id);

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

  const handleBackToCategories = () => {
    navigate("/specials");
  };

  const handleEpisodeClick = (episodeId) => {
    navigate(`/episodes/${episodeId}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading {decodedCategoryName} episodes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error loading episodes: {error}</p>
        <button onClick={handleBackToCategories} className={styles.backButton}>
          ← Back to Categories
        </button>
      </div>
    );
  }

  return (
    <main className={styles.categoryEpisodesContainer}>
      {/* Header with back button */}
      <div className={styles.headerSection}>
        <button
          onClick={handleBackToCategories}
          className={styles.backButton}
          aria-label="Back to special categories"
        >
          <FaArrowLeft /> Back to Categories
        </button>

        <div className={styles.categoryHeader}>
          <h1 className={styles.categoryTitle}>{decodedCategoryName}</h1>
          <p className={styles.episodeCount}>
            {episodes.length} {episodes.length === 1 ? "Episode" : "Episodes"}
          </p>
        </div>
      </div>

      {/* Episodes Grid */}
      <section className={styles.episodesGrid}>
        {episodes.length === 0 ? (
          <div className={styles.noEpisodes}>
            <p>No episodes found in this category.</p>
            <button
              onClick={handleBackToCategories}
              className={styles.backButton}
            >
              ← Back to Categories
            </button>
          </div>
        ) : (
          episodes.map((episode) => (
            <div key={episode.Id} className={styles.episodeCard}>
              <div className={styles.imageContainer}>
                <img
                  src={episode.Image}
                  alt={episode.Title}
                  className={styles.episodeImage}
                />
                <button
                  className={styles.readMoreBtn}
                  onClick={() => handleEpisodeClick(episode.Id)}
                  aria-label={`Read more about ${episode.Title}`}
                >
                  Read more
                </button>
              </div>

              <div className={styles.redContainer}>
                <div className={styles.likesContainer}>
                  <button
                    aria-label={
                      favorites?.includes(episode.Id) ? "Unlike" : "Like"
                    }
                    onClick={() => toggleFavorites?.(episode.Id)}
                    className={styles.heartButton}
                  >
                    <FaHeart
                      size={24}
                      style={{
                        color: favorites?.includes(episode.Id)
                          ? "var(--lightblue)"
                          : "var(--light)",
                        transition: "color 0.2s",
                      }}
                    />
                  </button>
                  <LikeCounter episodeId={episode.Id} initialLikes={0} />
                </div>
                <div className={styles.reviewContainer}>
                  <p>Review</p>
                  <EpisodeReview episodeId={episode.Id} />
                </div>
              </div>

              <div className={styles.episodeInfo}>
                <h3 className={styles.episodeTitle}>{episode.Title}</h3>
                <p className={styles.publishDate}>
                  Published: {episode.DatePublished}
                </p>
                <details className={styles.episodeDetails}>
                  <summary className={styles.episodeSummary}>
                    Click to read episode summary
                  </summary>
                  <p className={styles.summaryText}>{episode.Summary}</p>
                </details>
              </div>

              <div className={styles.iFrameContainer}>
                <iframe
                  src={episode.iFrameLink}
                  frameBorder="0"
                  width="100%"
                  height="100px"
                  title={`Audio player for ${episode.Title}`}
                ></iframe>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
