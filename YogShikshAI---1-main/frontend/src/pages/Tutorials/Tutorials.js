// Tutorials.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Tutorials.css'; // Changed import path to Tutorial.css

// Import images
import beginnerImage from '../images/Tadasana.jpg';
import intermediateImage from '../images/Virabhadrasana.jpg';
import advancedImage from '../images/Chakrasana.jpg';

function Tutorials() { // Changed component name to Tutorials
  return (
    <div className="tutorials-container"> {/* Changed class name to tutorials-container */}
      <h2>Tutorials Available : </h2>
      <div className="flash-cards">
        <div className="flash-card">
          <img src={beginnerImage} alt="Beginner Tutorial" className="tutorial-image" /> {/* Changed alt text to "Beginner Tutorial" */}
          <h5>Beginner Tutorial</h5>
          <Link to="/beginner"><button className="transition-button">Start</button></Link>
        </div>
        <div className="flash-card">
          <img src={intermediateImage} alt="Intermediate Tutorial" className="tutorial-image" /> {/* Changed alt text to "Intermediate Tutorial" */}
          <h5>Intermediate Tutorial</h5>
          <Link to="/intermediate"><button className="transition-button">Start</button></Link>
        </div>
        <div className="flash-card">
          <img src={advancedImage} alt="Advanced Tutorial" className="tutorial-image" /> {/* Changed alt text to "Advanced Tutorial" */}
          <h5>Advanced Tutorial</h5>
          <Link to="/advanced"><button className="transition-button">Start</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Tutorials;
