// Intermediate.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Intermediate.css'; // Import your CSS file
import TrikonasanaImage from '../images/Trikonasana.jpg'; // Import your images
import VirabhadrasanaImage from '../images/Virabhadrasana.jpg';
import PathahastasanaImage from '../images/Pathahastasana.jpg';
import UtkatasanaImage from '../images/Utkatasana.jpg';
import JanuSirsasanaImage from '../images/JanuSirsasana.jpg';
import DandasanaImage from '../images/Dandasana.jpg';
import NavasanaImage from '../images/Navasana.jpg';
import PaschimottanasanaImage from '../images/Paschimottanasana.jpg';

function Intermediate() {
  return (
    <div className="course-container">
      <h1>Intermediate Course</h1>
      <p>This is the Intermediate Course page.</p>
      <div className="flex-container">
        {/* First Row */}
        <Link to="/trikonasana" className="flex-item">
          <img src={TrikonasanaImage} alt="Trikonasana" />
          <span className="link-text">Trikonasana</span>
        </Link>
        <Link to="/virabhadrasana" className="flex-item">
          <img src={VirabhadrasanaImage} alt="Virabhadrasana" />
          <span className="link-text">Virabhadrasana</span>
        </Link>
        <Link to="/pathahastasana" className="flex-item">
          <img src={PathahastasanaImage} alt="Pathahastasana" />
          <span className="link-text">Pathahastasana</span>
        </Link>
        <Link to="/utkatasana" className="flex-item">
          <img src={UtkatasanaImage} alt="Utkatasana" />
          <span className="link-text">Utkatasana</span>
        </Link>
        {/* Second Row */}
        <Link to="/janusirsasana" className="flex-item">
          <img src={JanuSirsasanaImage} alt="Janu Sirsasana" />
          <span className="link-text">Janu Sirsasana</span>
        </Link>
        <Link to="/dandasana" className="flex-item">
          <img src={DandasanaImage} alt="Dandasana" />
          <span className="link-text">Dandasana</span>
        </Link>
        <Link to="/navasana" className="flex-item">
          <img src={NavasanaImage} alt="Navasana" />
          <span className="link-text">Navasana</span>
        </Link>
        <Link to="/paschimottanasana" className="flex-item">
          <img src={PaschimottanasanaImage} alt="Paschimottanasana" />
          <span className="link-text">Paschimottanasana</span>
        </Link>
      </div>
    </div>
  );
}

export default Intermediate;
