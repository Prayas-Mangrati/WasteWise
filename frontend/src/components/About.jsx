function About() {
  return (
    <>
      <section className="about-section" id="about">
        <div className="about-container">

          <div className="about-content">
            <p className="about-label">ABOUT WASTEWISE</p>

            <h2>
              Smarter Waste Decisions,
              <br />
              One Scan at a Time.
            </h2>

            <p>
              WasteWise uses artificial intelligence to identify common
              waste materials and provide simple disposal guidance.
              The goal is to make waste segregation easier to understand
              and encourage better everyday disposal habits.
            </p>

            <p>
              The system combines computer vision, a web interface,
              and a future hardware scanner to create a practical
              waste-identification experience.
            </p>
          </div>

          <div className="about-features">

            <div className="about-feature">
              <span>🤖</span>
              <div>
                <h3>AI Powered</h3>
                <p>
                  Computer vision identifies the waste category from an image.
                </p>
              </div>
            </div>

            <div className="about-feature">
              <span>♻️</span>
              <div>
                <h3>Disposal Guidance</h3>
                <p>
                  Get simple guidance on recycling, composting and disposal.
                </p>
              </div>
            </div>

            <div className="about-feature">
              <span>📊</span>
              <div>
                <h3>Waste Insights</h3>
                <p>
                  Track scans and understand your waste distribution over time.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">

          <div className="footer-brand">
            <div className="footer-logo">
              <span>🌿</span>
              <strong>WasteWise</strong>
            </div>

            <p>
              Know Your Waste. Make a Difference.
            </p>
          </div>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#scan">Scan</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#history">History</a>
            <a href="#about">About</a>
          </div>

          <p className="footer-copy">
            © 2026 WasteWise. Built for smarter waste management.
          </p>

        </div>
      </footer>
    </>
  )
}

export default About