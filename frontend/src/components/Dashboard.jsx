import { useEffect, useState } from "react";
import API_BASE_URL from "../api";

function Dashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);

      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load dashboard history:", error);
      setHistory([]);
    }
  };

  loadHistory();

  window.addEventListener(
    "wastewise-history-updated",
    loadHistory
  );

  return () => {
    window.removeEventListener(
      "wastewise-history-updated",
      loadHistory
    );
  };
}, []);

  const getWasteIcon = (wasteClass) => {
    const icons = {
      Plastic: "🧴",
      Paper: "📄",
      Cardboard: "📦",
      Glass: "🍾",
      Metal: "🥫",
      "Food Organics": "🍎",
      Vegetation: "🌿",
      "Textile Trash": "👕",
      "Miscellaneous Trash": "🗑️",
    };

    return icons[wasteClass] || "♻️";
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp.replace(" ", "T") + "Z");

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalScans = history.length;

  const recyclableCount = history.filter(
    (scan) =>
      scan.recyclable === "Yes" ||
      scan.recyclable === "Yes*",
  ).length;

  const biodegradableCount = history.filter(
    (scan) => scan.waste_type === "Biodegradable",
  ).length;

  const nonBiodegradableCount = history.filter(
    (scan) => scan.waste_type === "Non-biodegradable",
  ).length;

  const distribution = history.reduce((counts, scan) => {
    counts[scan.waste_class] =
      (counts[scan.waste_class] || 0) + 1;

    return counts;
  }, {});

  const distributionItems = Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <section className="dashboard-section" id="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-heading">
          <p className="dashboard-label">WASTE INSIGHTS</p>
          <h2>Your Waste Dashboard</h2>
          <p>Track your scans and understand the waste you encounter.</p>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <span className="dashboard-stat-icon">🔍</span>
            <div>
              <p>Total Scans</p>
              <h3>{totalScans}</h3>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-icon">♻️</span>
            <div>
              <p>Recyclable</p>
              <h3>{recyclableCount}</h3>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-icon">🌱</span>
            <div>
              <p>Biodegradable</p>
              <h3>{biodegradableCount}</h3>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <span className="dashboard-stat-icon">🚯</span>
            <div>
              <p>Non-Biodegradable</p>
              <h3>{nonBiodegradableCount}</h3>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="distribution-card">
            <h3>Waste Distribution</h3>

            <p className="dashboard-card-description">
              Distribution of waste categories from your scans.
            </p>

            <div className="distribution-placeholder">
              {distributionItems.length === 0 ? (
                <p>No scans yet.</p>
              ) : (
                distributionItems.map(([wasteClass, count]) => {
                  const maxCount =
                    distributionItems[0]?.[1] || 1;

                  const width =
                    (count / maxCount) * 100;

                  return (
                    <div
                      className="distribution-bar"
                      key={wasteClass}
                      style={{
                        width: `${width}%`,
                      }}
                    >
                      <span>{wasteClass}</span>
                      <strong>{count}</strong>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="recent-scans-card">
            <h3>Recent Scans</h3>

            <p className="dashboard-card-description">
              Your latest waste identification results.
            </p>

            {history.length === 0 ? (
              <p>No scans yet.</p>
            ) : (
              history.slice(0, 4).map((scan) => (
                <div
                  className="recent-scan-item"
                  key={scan.id}
                >
                  <span>
                    {getWasteIcon(scan.waste_class)}
                  </span>

                  <div>
                    <strong>{scan.waste_class}</strong>

                    <p>
                      {(scan.confidence * 100).toFixed(0)}%
                      {" "}confidence
                    </p>
                  </div>

                  <small>
                    {formatTime(scan.created_at)}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;