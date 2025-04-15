import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef, useState, useEffect } from 'react';
import backend from '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';
import { count } from '../../utils/music'; 
import PoseNLP from '../../components/PoseNLP/PoseNLP';
import './Yoga.css';
import { poseImages } from '../../utils/pose_images';
import { POINTS, keypointConnections } from '../../utils/data';
import { drawPoint, drawSegment } from '../../utils/helper';

const poseCategories = {
  beginner: [
    'Tadasana', 'Sukhasana', 'Vajrasana', 'Vrikshasana', 
    'Bhujangasana', 'Setu_Bandasana', 'Uttanpadasana'
  ],
  intermediate: [
    'Trikonasana', 'Virabhadrasana', 'Utkatasana', 
    'Dandasana', 'Janu_Sirsasana', 'Paschimottanasana'
  ],
  advanced: [
    'Ardha_Chandrasana', 'Bakasana', 'Chakrasana', 
    'Gomkhasana', 'Navasana', 'Parsvottanasana', 'Padmasana'
  ]
};

const CLASS_NO = {
  Ardha_Chandrasana: 0,
  Bakasana: 1,
  Bhujangasana: 2,
  Chakrasana: 3,
  Dandasana: 4,
  Gomkhasana: 5,
  Janu_Sirsasana: 6,
  Navasana: 7,
  Padmasana: 8,
  Parsvottanasana: 9,
  Paschimottanasana: 10,
  Pathahastasana: 11,
  Setu_Bandasana: 12,
  Sukhasana: 13,
  Tadasana: 14,
  Trikonasana: 15,
  Utkatasana: 16,
  Uttanpadasana: 17,
  Vajrasana: 18,
  Virabhadrasana: 19,
  Vrikshasana: 20,
};

let interval;
let flag = false;
let skeletonColor = 'rgb(255,255,255)';

function Yoga() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState('Tadasana');
  const [isStartPose, setIsStartPose] = useState(false);
  const [poseKeypoints, setPoseKeypoints] = useState([]);
  const [confidenceScore, setConfidenceScore] = useState(0);

  useEffect(() => {
    const timeDiff = (currentTime - startingTime)/1000;
    if(flag) {
      setPoseTime(timeDiff);
    }
    if((currentTime - startingTime)/1000 > bestPerform) {
      setBestPerform(timeDiff);
    }
  }, [currentTime]);

  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
    setPoseKeypoints([]);
    setConfidenceScore(0);
  }, [currentPose]);

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1);
    let right = tf.gather(landmarks, right_bodypart, 1);
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
    return center;
  }

  function get_pose_size(landmarks, torso_size_multiplier=2.5) {
    let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    let shoulders_center = get_center_point(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER);
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
    let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center_new = tf.expandDims(pose_center_new, 1);

    pose_center_new = tf.broadcastTo(pose_center_new,
        [1, 17, 2]
      );
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
    let max_dist = tf.max(tf.norm(d,'euclidean', 0));

    let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist);
    return pose_size;
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center = tf.expandDims(pose_center, 1);
    pose_center = tf.broadcastTo(pose_center, 
        [1, 17, 2]
      );
    landmarks = tf.sub(landmarks, pose_center);

    let pose_size = get_pose_size(landmarks);
    landmarks = tf.div(landmarks, pose_size);
    return landmarks;
  }

  function landmarks_to_embedding(landmarks) {
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
    let embedding = tf.reshape(landmarks, [1,34]);
    return embedding;
  }

  const runMovenet = async () => {
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const countAudio = new Audio(count);
    countAudio.loop = true;
    interval = setInterval(() => { 
        detectPose(detector, countAudio);
    }, 100);
  };

  const sendToFlaskApp = async (processedInput) => {
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedInput),
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        throw new Error('Failed to send data to Flask app');
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const detectPose = async (detector, countAudio) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0;
      const video = webcamRef.current.video;
      const pose = await detector.estimatePoses(video);
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keypoints = pose[0].keypoints;
        
        setPoseKeypoints(keypoints);
        
        let input = keypoints.map((keypoint) => {
          if(keypoint.score > 0.4) {
            if(!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)');
              let connections = keypointConnections[keypoint.name];
              try {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase();
                  drawSegment(ctx, [keypoint.x, keypoint.y],
                      [keypoints[POINTS[conName]].x,
                       keypoints[POINTS[conName]].y]
                  , skeletonColor);
                });
              } catch(err) {
                // Handle error
              }
            }
          } else {
            notDetected += 1;
          } 
          return [keypoint.x, keypoint.y];
        }); 
        
        if(notDetected > 4) {
          skeletonColor = 'rgb(255,255,255)';
          return;
        }
        
        const processedInput = landmarks_to_embedding(input);

        processedInput.array().then(normalArray => {
          return sendToFlaskApp(normalArray);
        }).then(flaskResponse => {
          if (flaskResponse) {
            flaskResponse.map((data) => {
              const classNo = CLASS_NO[currentPose];
              
              setConfidenceScore(data[0][classNo]);
              
              if(data[0][classNo] > 0.97) {
                if(!flag) {
                  countAudio.play();
                  setStartingTime(new Date(Date()).getTime());
                  flag = true;
                }
                setCurrentTime(new Date(Date()).getTime()); 
                skeletonColor = 'rgb(0,255,0)';
              } else {
                flag = false;
                skeletonColor = 'rgb(255,255,255)';
                countAudio.pause();
                countAudio.currentTime = 0;
              }
            });
          }
        }).catch(error => {
          console.error('Error sending data to Flask app:', error);
        });
      } catch(err) {
        console.log(err);
      }
    }
  };

  function startYoga(){
    setIsStartPose(true); 
    runMovenet();
  } 

  function stopPose() {
    setIsStartPose(false);
    clearInterval(interval);
  }

  if(isStartPose) {
    return (
      <div className="yoga-container">
        <div className="pose-name-display">
          Current Pose: {currentPose.replace('_', ' ')}
        </div>
        
        <div className="performance-container">
          <div className="pose-performance">
            <h4>Pose Time: {poseTime.toFixed(1)} s</h4>
          </div>
          <div className="pose-performance">
            <h4>Best: {bestPerform.toFixed(1)} s</h4>
          </div>
        </div>
        
        <div className="yoga-pose-area">
          <div className="webcam-container">
            <Webcam 
              width='640px'
              height='480px'
              id="webcam"
              ref={webcamRef}
              style={{
                position: 'absolute',
                left: 0,
                top: 100,
                padding: '0px',
              }}
            />
            <canvas
              ref={canvasRef}
              id="my-canvas"
              width='640px'
              height='480px'
              style={{
                position: 'absolute',
                left: 0,
                top: 100,
                zIndex: 1
              }}
            />
            <div>
              <img 
                src={poseImages[currentPose]}
                className="pose-img"
                alt={currentPose}
              />
            </div>
          </div>
          
          <PoseNLP 
            currentPose={currentPose.replace('_', ' ')}
            poseKeypoints={poseKeypoints}
            confidenceScore={confidenceScore}
          />
        </div>
        
        <button
          onClick={stopPose}
          className="secondary-btn"    
        >
          Stop Pose
        </button>
      </div>
    );
  }

  return (
    <div className="yoga-container">
      <div className="pose-categories-container">
        {Object.entries(poseCategories).map(([category, poses]) => (
          <div key={category} className={`pose-category ${category}`}>
            <h2 className="category-title">
              {category.charAt(0).toUpperCase() + category.slice(1)} Poses
            </h2>
            <div className="pose-selection-grid">
              {poses.map((pose) => (
                <div 
                  key={pose} 
                  className={`pose-selection-item ${category}`}
                  onClick={() => {
                    setCurrentPose(pose);
                    startYoga();
                  }}
                >
                  <span className={`difficulty-badge ${category}`}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <img 
                    src={poseImages[pose]} 
                    alt={pose} 
                    className="pose-selection-image" 
                  />
                  <span className="pose-selection-label">
                    {pose.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Yoga;