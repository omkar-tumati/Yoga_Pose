import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './Icon.png';
import './App.css';
import Yoga from './pages/Yoga/Yoga';
import Explore from './pages/Explore/Explore';
import About from './pages/About/About';
// import Tutorials from './pages/Tutorials/Tutorials';
import Beginner from './pages/Beginner/Beginner';
import Intermediate from './pages/Intermediate/Intermediate';
import Advanced from './pages/Advanced/Advanced';
import Video from './pages/Video/Video';

function Home() {
  return (
    <div className="App">
      <div className="main-content">
        <div className="left-half">
          <h1 className="title">
            <span className="green-text">Yoga</span> is all about the shape of life<span className="green-text">.</span>
          </h1>
          <p className="quote">"The better your practice, the brighter your flame."</p>
          <div className="buttons">
            <Link to="/explore">
              <button className="explore">Explore</button>
            </Link>
            <Link to="/Video"> 
              <button className="tutorial">Tutorial</button>
            </Link>
          </div>
        </div>
        <div className="right-half">
          <img src="./yoga_pose_image.jpg" alt="Yoga Pose" />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="nav">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
            <span className="brand-name">YogShikshAI</span>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/tutorials">Courses</Link>
            </li>
            <li>
              <Link to="/">Contact Us</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/tutorials" element={<Tutorials />} /> */}
          <Route path="/tutorials" element={<Yoga />} />
          <Route path="/video" element={<Video />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/beginner" element={<Beginner />} />
          <Route path="/intermediate" element={<Intermediate />} />
          <Route path="/advanced" element={<Advanced />} />
          <Route path='/start' element={<Yoga />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
