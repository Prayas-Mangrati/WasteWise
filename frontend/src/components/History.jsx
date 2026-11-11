import { useEffect, useState } from "react"
import API_BASE_URL from "../api";

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadHistory = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(`${API_BASE_URL}/history`)

      if (!response.ok) {
        throw new Error("Failed to fetch history")
      }

      const data = await response.json()
      setHistory(data)
    } catch (err) {
      console.error(err)
      setError("Unable to load scan history.")
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
  loadHistory()

  window.addEventListener(
    "wastewise-history-updated",
    loadHistory
  )

  return () => {
    window.removeEventListener(
      "wastewise-history-updated",
      loadHistory
    )
  }
}, [])

  const getIcon = (wasteClass) => {
    const icons = {
      Cardboard: "📦",
      "Food Organics": "🍎",
      Glass: "🍾",
      Metal: "🥫",
      "Miscellaneous Trash": "🗑️",
      Paper: "📄",
      Plastic: "🧴",
      "Textile Trash": "👕",
      Vegetation: "🌿",
    }

    return icons[wasteClass] || "♻️"
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ""

    const date = new Date(timestamp.replace(" ", "T") + "Z")

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <section className="history-section" id="history">
      <div className="history-container">

        <div className="history-heading">
          <div className="history-label">
            SCAN HISTORY
          </div>

          <h2>Your Recent Waste Scans</h2>

          <p>
            View your previous waste classifications and disposal guidance.
          </p>
        </div>

        <div className="history-card">

          <div className="history-header">
            <div>WASTE</div>
            <div>TYPE</div>
            <div>DISPOSAL</div>
            <div>RECYCLABLE</div>
            <div>TIME</div>
          </div>

          {loading ? (
            <div className="history-row">
              <div>Loading scan history...</div>
            </div>
          ) : error ? (
            <div className="history-row">
              <div>{error}</div>
            </div>
          ) : history.length === 0 ? (
            <div className="history-row">
              <div>No scans yet.</div>
            </div>
          ) : (
            history.map((scan) => (
              <div className="history-row" key={scan.id}>

                <div className="history-waste">
                  <span>{getIcon(scan.waste_class)}</span>

                  <strong>{scan.waste_class}</strong>
                </div>

                <div>
                  {scan.waste_type}
                </div>

                <div>
                  {scan.disposal}
                </div>

                <div>
                  <span
                    className={
                      scan.recyclable === "Yes" ||
                      scan.recyclable === "Yes*"
                        ? "history-status"
                        : "history-status history-status-no"
                    }
                  >
                    {scan.recyclable}
                  </span>
                </div>

                <div>
                  {formatTime(scan.created_at)}
                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </section>
  )
}

export default History