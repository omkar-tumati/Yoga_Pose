// Beginner.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Beginner.css'; // Import your CSS file
import TadasanaImage from '../images/Tadasana.jpg'; // Import your images
import VrikshasanaImage from '../images/Vrikshasana.jpg';
import SukhasanaImage from '../images/Sukhasana.jpg';
import VajrasanaImage from '../images/Vajrasana.jpg';
import GomukhasanaImage from '../images/Gomukhasana.jpg';
import SetuBandhasanaImage from '../images/SetuBandhasana.jpg';
import UttanpadasanaImage from '../images/Uttanpadasana.jpg';
import ArdhaChandrasanaImage from '../images/ArdhaChandrasana.jpg';
import BhujangasanaImage from '../images/Bhujangasana.jpg';
import TrikonasanaImage from '../images/Trikonasana.jpg'; // Import your images
import VirabhadrasanaImage from '../images/Virabhadrasana.jpg';
import PathahastasanaImage from '../images/Pathahastasana.jpg';
import UtkatasanaImage from '../images/Utkatasana.jpg';
import JanuSirsasanaImage from '../images/JanuSirsasana.jpg';
import DandasanaImage from '../images/Dandasana.jpg';
import NavasanaImage from '../images/Navasana.jpg';
import PaschimottanasanaImage from '../images/Paschimottanasana.jpg';

let poseList = [
  'Vrikshasana', 'Utkatasana', 'Bhujangasana', 'Virabhadrasana', 'Adho Mukha Svanasana',
  'Sarvangasana', 'Trikonasana'
]

function Beginner() {
  return (
    <div className="course-container">
      <h1>Beginner Course</h1>
      <p>This is the Beginner Course page.</p>
      <div className="flex-container">
        {/* First Row */}
        <Link to="/start" className="flex-item">
          <img src={VrikshasanaImage} alt="Vrikshasana" />
          <span className="link-text">Vrikshasana</span>
        </Link>
        <Link to="/start" className="flex-item">
          <img src={UtkatasanaImage} alt="Utkatasana" />
          <span className="link-text">Tadasana</span>
        </Link>
        <Link to="/start" className="flex-item">
          <img src={BhujangasanaImage} alt="Bhujangasana" />
          <span className="link-text">Bhujangasana</span>
        </Link>
        <Link to="/start" className="flex-item">
          <img src={VirabhadrasanaImage} alt="Virabhadrasana" />
          <span className="link-text">Virabhadrasana</span>
        </Link>
        {/* Second Row */}
        <Link to="/start" className="flex-item">
          <img src={TrikonasanaImage} alt="Trikonasana" />
          <span className="link-text">Trikonasana</span>
        </Link>
        
      </div>
    </div>
  );
}

export default Beginner;
