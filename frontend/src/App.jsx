import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Scanner from './components/Scanner'
import Categories from './components/Categories'
import Dashboard from './components/Dashboard'
import  History from './components/History'
import About from './components/About'



function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Scanner />
      <Categories />
      <Dashboard />
      <History />
      <About />
    </div>
  )
}

export default App