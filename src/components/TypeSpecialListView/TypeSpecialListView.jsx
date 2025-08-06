import styles from "./TypeSpecialListView.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TypeSpecialListView() {
  const [specialsData, setSpecialsData] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecialEpisodes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/episodes.json");

        if (!response.ok) {
          throw new Error(`Failed to fetch episodes data: ${response.status}`);
        }

        const allEpisodes = await response.json();

        // Filter episodes where Special is true
        const specialEpisodes = allEpisodes.filter(
          (episode) => episode.Special === true
        );

        // Group by "Type special" and count episodes
        const groupedByType = specialEpisodes.reduce((acc, episode) => {
          const typeKey = episode["Type special"] || "Other";
          if (!acc[typeKey]) {
            acc[typeKey] = {
              episodes: [],
              count: 0,
            };
          }
          acc[typeKey].episodes.push(episode);
          acc[typeKey].count += 1;
          return acc;
        }, {});

        setSpecialsData(specialEpisodes);
        setCategoryStats(groupedByType);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching special episodes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialEpisodes();
  }, []);

  const handleCategoryClick = (categoryName) => {
    // Navigate to a filtered view, passing the category as a URL parameter
    navigate(`/specials/${encodeURIComponent(categoryName)}`);
  };

  // Get a representative image for each category (first episode's image)
  const getCategoryImage = (categoryName) => {
    const categoryData = categoryStats[categoryName];
    return categoryData?.episodes[0]?.Image || "/images/default-category.png";
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading special episode categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error loading special episodes: {error}</p>
      </div>
    );
  }

  return (
    <main className={styles.categoryContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>Special Episode Categories</h1>
        <p className={styles.subtitle}>
          Explore our collection of special episodes organized by type
        </p>
      </div>

      <section className={styles.categoryGrid}>
        {Object.keys(categoryStats).length === 0 ? (
          <p className={styles.noCategories}>
            No special episode categories found.
          </p>
        ) : (
          Object.entries(categoryStats).map(([categoryName, data]) => (
            <div
              key={categoryName}
              className={styles.categoryCard}
              onClick={() => handleCategoryClick(categoryName)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleCategoryClick(categoryName);
                }
              }}
            >
              <div className={styles.categoryImageContainer}>
                <img
                  src={getCategoryImage(categoryName)}
                  alt={`${categoryName} category`}
                  className={styles.categoryImage}
                />
                <div className={styles.categoryOverlay}>
                  <span className={styles.episodeCount}>
                    {data.count} {data.count === 1 ? "Episode" : "Episodes"}
                  </span>
                </div>
              </div>

              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryTitle}>{categoryName}</h3>
                <p className={styles.categoryDescription}>
                  {getCategoryDescription(categoryName)}
                </p>
                <div className={styles.viewButton}>View Episodes →</div>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

// Helper function to provide descriptions for each category
function getCategoryDescription(categoryName) {
  const descriptions = {
    "Christmas Special": "Festive episodes celebrating the holiday season",
    "Post-season recap": "Recap episodes summarizing entire seasons",
    "Book Review": "Episodes reviewing Call The Midwife books",
    "Listeners Special": "Special episodes created for our listeners",
    "Bonus Episode": "Extra bonus content and behind-the-scenes",
    "Anniversary Special": "Episodes celebrating podcast milestones",
    Episode: "Regular podcast episodes",
  };

  return descriptions[categoryName] || "Special episodes in this category";
}
