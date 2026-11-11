import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <span className="navbar-logo-icon">🌿</span>
        <span>WasteWise</span>
      </div>

      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#scan" onClick={closeMenu}>Scan</a>
        <a href="#dashboard" onClick={closeMenu}>Dashboard</a>
        <a href="#history" onClick={closeMenu}>History</a>
        <a href="#about" onClick={closeMenu}>About</a>
      </nav>

      <div className="navbar-tagline">
        Cleaner Today · Greener Tomorrow
      </div>
    </header>
  );
}

export default Navbar;