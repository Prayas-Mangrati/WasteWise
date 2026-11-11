function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <span className="navbar-logo-icon">🌿</span>
        <span>WasteWise</span>
      </div>

      <nav className="navbar-links">
        <a href="#home">Home</a>
        <a href="#scan">Scan</a>
        <a href="#dashboard">Dashboard</a>
        <a href="#history">History</a>
        <a href="#about">About</a>
      </nav>

      <div className="navbar-tagline">
        Cleaner Today · Greener Tomorrow
      </div>
    </header>
  )
}

export default Navbar