// Advanced.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Advanced.css'; // Import your CSS file
import ParsvottanasanaImage from '../images/Parsvottanasana.jpg'; // Import your images
import BakasanaImage from '../images/Bakasana.jpg';
import ChakrasanaImage from '../images/Chakrasana.jpg';

function Advanced() {
  return (
    <div className="course-container">
      <h1>Advanced Course</h1>
      <p>This is the Advanced Course page.</p>
      <div className="flex-container">
        {/* First Row */}
        <Link to="/parsvottanasana" className="flex-item">
          <img src={ParsvottanasanaImage} alt="Parsvottanasana" />
          <span className="link-text">Parsvottanasana</span>
        </Link>
        <Link to="/bakasana" className="flex-item">
          <img src={BakasanaImage} alt="Bakasana" />
          <span className="link-text">Bakasana</span>
        </Link>
        <Link to="/chakrasana" className="flex-item">
          <img src={ChakrasanaImage} alt="Chakrasana" />
          <span className="link-text">Chakrasana</span>
        </Link>
      </div>
    </div>
  );
}

export default Advanced;
