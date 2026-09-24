import { useEffect, useState } from "react";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = () => {
      const savedHistory =
        JSON.parse(localStorage.getItem("wastewise_history")) || [];

      setHistory(savedHistory);
    };

    loadHistory();

    window.addEventListener("wastewise-history-updated", loadHistory);

    return () => {
      window.removeEventListener("wastewise-history-updated", loadHistory);
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

  return (
    <section className="history-section" id="history">
      <div className="history-container">
        <div className="history-heading">
          <p className="history-label">SCAN RECORDS</p>
          <h2>Scan History</h2>
          <p>View your recent waste identification results.</p>
        </div>

        <div className="history-card">
          <div className="history-header">
            <span>Waste</span>
            <span>Confidence</span>
            <span>Type</span>
            <span>Recyclable</span>
            <span>Time</span>
          </div>

          {history.length === 0 ? (
            <div className="history-row">
              <span>No scans yet</span>
              <span>—</span>
              <span>—</span>
              <span>—</span>
              <span>—</span>
            </div>
          ) : (
            history.map((scan) => (
              <div className="history-row" key={scan.id}>
                <div className="history-waste">
                  <span>{getWasteIcon(scan.class)}</span>
                  <strong>{scan.class}</strong>
                </div>

                <span>{(scan.confidence * 100).toFixed(0)}%</span>

                <span>{scan.type}</span>

                <span
                  className={
                    scan.recyclable === "No"
                      ? "history-status history-status-no"
                      : "history-status"
                  }
                >
                  {scan.recyclable}
                </span>

                <span>{scan.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default History;
