import React from 'react';
import './yogaposes.css';
import TadasanaImage from '../images/Tadasana.jpg';
import VrikshasanaImage from '../images/Vrikshasana.jpg';
import SukhasanaImage from '../images/Sukhasana.jpg';
import VajrasanaImage from '../images/Vajrasana.jpg';
import GomukhasanaImage from '../images/Gomukhasana.jpg';
import SetuBandhasanaImage from '../images/SetuBandhasana.jpg';
import UttanpadasanaImage from '../images/Uttanpadasana.jpg';
import ArdhaChandrasanaImage from '../images/ArdhaChandrasana.jpg';
import PadmasanaImage from '../images/Padmasana.jpg';
import BhujangasanaImage from '../images/Bhujangasana.jpg';
import TrikonasanaImage from '../images/Trikonasana.jpg';
import VirabhadrasanaImage from '../images/Virabhadrasana.jpg';
import PathahastasanaImage from '../images/Pathahastasana.jpg';
import UtkatasanaImage from '../images/Utkatasana.jpg';
import JanuSirsasanaImage from '../images/JanuSirsasana.jpg';
import DandasanaImage from '../images/Dandasana.jpg';
import NavasanaImage from '../images/Navasana.jpg';
import PaschimottanasanaImage from '../images/Paschimottanasana.jpg';
import ParsvottanasanaImage from '../images/Parsvottanasana.jpg';
import BakasanaImage from '../images/Bakasana.jpg';
import ChakrasanaImage from '../images/Chakrasana.jpg';

const beginnerData = [
  { name: 'Tadasana', image: TadasanaImage },
  { name: 'Vrikshasana', image: VrikshasanaImage },
  { name: 'Sukhasana', image: SukhasanaImage },
  { name: 'Vajrasana', image: VajrasanaImage },
  { name: 'Bhujangasana', image: BhujangasanaImage },
  { name: 'Virabhadrasana', image: VirabhadrasanaImage },
  { name: 'Gomkhasana', image: GomukhasanaImage },
  { name: 'Setu Bandhasana', image: SetuBandhasanaImage },
  { name: 'Uttanpadasana', image: UttanpadasanaImage },
  { name: 'Ardha Chandrasana', image: ArdhaChandrasanaImage },
];

const intermediateData = [
  { name: 'Trikonasana', image: TrikonasanaImage },
  { name: 'Virabhadrasana', image: VirabhadrasanaImage },
  { name: 'Pathahastasana', image: PathahastasanaImage },
  { name: 'Utkatasana', image: UtkatasanaImage },
  { name: 'Padmasana', image: PadmasanaImage },
  { name: 'Janu Sirsasana', image: JanuSirsasanaImage },
  { name: 'Dandasana', image: DandasanaImage },
  { name: 'Navasana', image: NavasanaImage },
  { name: 'Paschimottanasana', image: PaschimottanasanaImage },
];

const advancedData = [
  { name: 'Parsvottanasana', image: ParsvottanasanaImage },
  { name: 'Bakasana', image: BakasanaImage },
  { name: 'Chakrasana', image: ChakrasanaImage },
];

const YogaPoses = () => {
  return (
    <div className="poses-container">
      <div className="poses-section">
        <h2>Beginner</h2>
        <div className="poses-grid">
          {beginnerData.map((pose, index) => (
            <div key={index} className="pose-container">
              <img src={pose.image} alt={pose.name} />
              <p>{pose.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="poses-section">
        <h2>Intermediate</h2>
        <div className="poses-grid">
          {intermediateData.map((pose, index) => (
            <div key={index} className="pose-container">
              <img src={pose.image} alt={pose.name} />
              <p>{pose.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="poses-section">
        <h2>Advanced</h2>
        <div className="poses-grid">
          {advancedData.map((pose, index) => (
            <div key={index} className="pose-container">
              <img src={pose.image} alt={pose.name} />
              <p>{pose.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YogaPoses;
