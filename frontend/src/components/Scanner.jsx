import { useRef, useState, useEffect } from "react";

function Scanner() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [webcamOpen, setWebcamOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  useEffect(() => {
    if (webcamOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [webcamOpen]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  const handleCapture = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "webcam-capture.jpg", {
        type: "image/jpeg",
      });

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError("");
      setWebcamOpen(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }, "image/jpeg");
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setResult(data);
      const newScan = {
        id: Date.now(),
        class: data.class,
        confidence: data.confidence,
        type: data.type,
        recyclable: data.recyclable,
        compostable: data.compostable,
        disposal: data.disposal,
        image: preview,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const existingHistory =
        JSON.parse(localStorage.getItem("wastewise_history")) || [];

      localStorage.setItem(
        "wastewise_history",
        JSON.stringify([newScan, ...existingHistory]),
      );
      window.dispatchEvent(new Event("wastewise-history-updated"));
    } catch (err) {
      setError("Could not connect to WasteWise backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="scanner-section" id="scan">
      <div className="scanner-container">
        {/* Scanner Panel */}
        <div className="scanner-panel">
          <h2>Scan Your Waste</h2>

          <div className="scanner-preview">
            {webcamOpen ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="scanner-video"
              />
            ) : preview ? (
              <img
                src={preview}
                alt="Selected waste"
                className="scanner-image-preview"
              />
            ) : (
              <div className="scanner-placeholder">
                📷
                <p>Place your waste item here</p>
                <span>Upload an image or use your webcam</span>
              </div>
            )}
          </div>

          <div className="scanner-actions">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <button
              className="scanner-upload-button"
              onClick={handleUploadClick}
            >
              📷 Upload Image
            </button>

            <button
              className="scanner-webcam-button"
              onClick={async () => {
                try {
                  setError("");

                  if (
                    !navigator.mediaDevices ||
                    !navigator.mediaDevices.getUserMedia
                  ) {
                    setError("Webcam is not supported by this browser.");
                    return;
                  }

                  const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                      width: { ideal: 1280 },
                      height: { ideal: 720 },
                    },
                    audio: false,
                  });

                  streamRef.current = stream;
                  setWebcamOpen(true);
                } catch (err) {
                  console.error("Webcam error:", err);
                  setError("Could not access your webcam.");
                }
              }}
            >
              ◉ Use Webcam
            </button>
          </div>
          {webcamOpen && (
            <button className="scanner-capture-button" onClick={handleCapture}>
              📸 Capture Photo
            </button>
          )}

          {selectedFile && (
            <button
              className="scanner-upload-button"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading
                ? "🔄 Analyzing..."
                : result
                  ? "🔄 Analyze Again"
                  : "🔍 Analyze Waste"}
            </button>
          )}

          {error && <p className="scanner-error">{error}</p>}
        </div>

        {/* Waste Card */}
        <div className="waste-card">
          <div className="waste-card-header">
            <h2>Waste Card</h2>

            {result && (
              <span className="confidence-badge">
                {(result.confidence * 100).toFixed(1)}% Confidence
              </span>
            )}
          </div>

          {result ? (
            <>
              <div className="waste-card-content">
                <div className="waste-card-image">
                  {preview ? (
                    <img
                      src={preview}
                      alt={result.class}
                      className="waste-result-image"
                    />
                  ) : (
                    "♻️"
                  )}
                </div>

                <h3>{result.class}</h3>

                <div className="waste-details">
                  <p>
                    <strong>Category</strong>
                    <span>{result.class}</span>
                  </p>

                  <p>
                    <strong>Type</strong>
                    <span>{result.type}</span>
                  </p>

                  <p>
                    <strong>Disposal</strong>
                    <span>{result.disposal}</span>
                  </p>

                  <p>
                    <strong>Compostable</strong>
                    <span>{result.compostable}</span>
                  </p>

                  <p>
                    <strong>Recyclable</strong>
                    <span>{result.recyclable}</span>
                  </p>
                </div>
              </div>

              <div className="waste-card-actions">
                <div className="recycle-box">
                  ♻️
                  <strong>
                    {result.recyclable === "No"
                      ? "Dispose Properly"
                      : "Recycle"}
                  </strong>
                  <span>Follow the recommended disposal method</span>
                </div>

                <div className="warning-box">
                  🚫
                  <strong>Don't burn it</strong>
                  <span>Follow safe disposal practices</span>
                </div>
              </div>
            </>
          ) : (
            <div className="waste-card-content">
              <div className="waste-card-image">♻️</div>

              <h3>No Waste Scanned</h3>

              <p>Upload an image and analyze it to see the WasteWise result.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Scanner;
