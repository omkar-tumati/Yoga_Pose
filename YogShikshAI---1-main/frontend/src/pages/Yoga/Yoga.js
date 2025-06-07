
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef, useState, useEffect } from 'react';
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

function Yoga() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const countAudioRef = useRef(new Audio(count));
  const detectorRef = useRef(null);
  const intervalRef = useRef(null);
  
  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState('Tadasana');
  const [isStartPose, setIsStartPose] = useState(false);
  const [poseKeypoints, setPoseKeypoints] = useState([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [skeletonColor, setSkeletonColor] = useState('rgb(255,255,255)');
  const [detailedScores, setDetailedScores] = useState({
    poseClass: 0,
    poseDetection: 0,
    keypointAvg: 0,
    final: 0
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      tf.disposeVariables();
      countAudioRef.current.pause();
    };
  }, []);

  // Update pose time and best performance
  // Replace the existing useEffect for timer updates
  useEffect(() => {
    if (startingTime > 0) {
      const timerInterval = setInterval(() => {
        const timeDiff = (Date.now() - startingTime) / 1000;
        setPoseTime(timeDiff);
        setCurrentTime(Date.now());
      }, 100);
      return () => clearInterval(timerInterval);
    }
  }, [startingTime]);

  // Reset state when pose changes
  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
    setPoseKeypoints([]);
    setConfidenceScore(0);
    setStartingTime(0);
    setDetailedScores({ poseClass: 0, poseDetection: 0, keypointAvg: 0, final: 0 });
  }, [currentPose]);

  // TensorFlow helper functions
  const get_center_point = (landmarks, left_bodypart, right_bodypart) => {
    const left = tf.gather(landmarks, left_bodypart, 1);
    const right = tf.gather(landmarks, right_bodypart, 1);
    return tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
  };

  const get_pose_size = (landmarks, torso_size_multiplier = 2.5) => {
    const hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    const shoulders_center = get_center_point(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER);
    const torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
    const pose_center_new = tf.expandDims(get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP), 1);
    const broadcasted_center = tf.broadcastTo(pose_center_new, [1, 17, 2]);
    const d = tf.gather(tf.sub(landmarks, broadcasted_center), 0, 0);
    const max_dist = tf.max(tf.norm(d, 'euclidean', 0));
    return tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist);
  };

  const normalize_pose_landmarks = (landmarks) => {
    const pose_center = tf.expandDims(get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP), 1);
    const broadcasted_center = tf.broadcastTo(pose_center, [1, 17, 2]);
    landmarks = tf.sub(landmarks, broadcasted_center);
    const pose_size = get_pose_size(landmarks);
    return tf.div(landmarks, pose_size);
  };

  const landmarks_to_embedding = (landmarks) => {
    const normalized = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
    return tf.reshape(normalized, [1, 34]);
  };

  // Improved softmax normalization for model predictions
  const applySoftmax = (predictions) => {
    const maxVal = Math.max(...predictions);
    const exp = predictions.map(x => Math.exp(x - maxVal));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(x => x / sum);
  };

  // Pose detection setup
  const runMovenet = async () => {
    try {
      const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER };
      detectorRef.current = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
      countAudioRef.current.loop = true;
      intervalRef.current = setInterval(() => detectPose(), 100);
    } catch (error) {
      console.error('Error initializing pose detector:', error);
    }
  };

  // Send data to Flask backend
  const sendToFlaskApp = async (data) => {
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error sending data to Flask:', error);
      return null;
    }
  };

  // Main pose detection logic with improved confidence calculation
  const detectPose = async () => {
    if (!webcamRef.current || webcamRef.current.video.readyState !== 4) return;

    try {
      const video = webcamRef.current.video;
      const pose = await detectorRef.current.estimatePoses(video);
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // No pose detected
      if (!pose || pose.length === 0) {
        setConfidenceScore(0);
        setSkeletonColor('rgb(255,255,255)');
        setDetailedScores({ poseClass: 0, poseDetection: 0, keypointAvg: 0, final: 0 });
        countAudioRef.current.pause();
        return;
      }

      const keypoints = pose[0].keypoints;
      const poseScore = pose[0].score || 0.5; // Default if undefined
      setPoseKeypoints(keypoints);

      // Draw keypoints and segments
      let validKeypoints = 0;
      let keypointScoreSum = 0;
      const input = keypoints.map((keypoint) => {
        if (keypoint.score > 0.3 && !['left_eye', 'right_eye'].includes(keypoint.name)) {
          validKeypoints++;
          keypointScoreSum += keypoint.score;
          drawPoint(ctx, keypoint.x, keypoint.y, 8, skeletonColor);
          
          const connections = keypointConnections[keypoint.name] || [];
          connections.forEach((connection) => {
            const conName = connection.toUpperCase();
            const targetKeypoint = keypoints[POINTS[conName]];
            if (targetKeypoint?.score > 0.3) {
              drawSegment(
                ctx,
                [keypoint.x, keypoint.y],
                [targetKeypoint.x, targetKeypoint.y],
                skeletonColor
              );
            }
          });
        }
        return [keypoint.x, keypoint.y];
      });

      // Ensure we have enough valid keypoints
      if (validKeypoints < 10) {
        setConfidenceScore(0);
        setSkeletonColor('rgb(255,255,255)');
        setDetailedScores({ poseClass: 0, poseDetection: 0, keypointAvg: 0, final: 0 });
        return;
      }

      // Calculate average keypoint confidence for valid keypoints only
      const avgKeypointScore = keypointScoreSum / validKeypoints;

      const normalizedPoseScore = Math.min(poseScore, 1.0);
      const normalizedKeypointScore = Math.min(avgKeypointScore, 1.0);

      // Process pose and get classification
      const embedding = await landmarks_to_embedding(input).array();
      const flaskResponse = await sendToFlaskApp({
        keypoints: embedding[0],
        poseScore: poseScore
      });

      if (flaskResponse?.data?.[0]) {
        const classNo = CLASS_NO[currentPose];
        const rawPredictions = flaskResponse.data[0];

        // Debug logs
        console.log('Current Pose:', currentPose);
        console.log('Class Number:', classNo);
        console.log('Raw Predictions:', rawPredictions);

        // Apply softmax normalization
        const normalizedPredictions = applySoftmax(rawPredictions);
        const poseClassScore = normalizedPredictions[classNo];

        console.log('Normalized Score for current pose:', poseClassScore);

        // Calculate final score
        const finalScore = (
          0.4 * poseClassScore +           // Increased weight for pose matching
          0.3 * normalizedPoseScore +      // Overall pose detection
          0.3 * normalizedKeypointScore    // Keypoint quality
        );

        // Store detailed scores
        const detailedScoresObj = {
          poseClass: poseClassScore,
          poseDetection: normalizedPoseScore,
          keypointAvg: normalizedKeypointScore,
          final: finalScore
        };

        setDetailedScores(detailedScoresObj);
        setConfidenceScore(finalScore);

        // Adjust green skeleton threshold
        if (finalScore > 0.70 && poseClassScore > 0.3) {  // Added pose match requirement
          setSkeletonColor('rgb(0,255,0)');
          const greenTime = (Date.now() - startingTime) / 1000;
          if (greenTime > bestPerform) {
            setBestPerform(greenTime);
          }
        } else {
          setSkeletonColor('rgb(255,255,255)');
        }

        // Always update current time
        setCurrentTime(Date.now());
      } else {
        // Fallback when no classification is available
        const fallbackScore = (normalizedPoseScore + normalizedKeypointScore) / 2;
        setConfidenceScore(fallbackScore);
        setDetailedScores({
          poseClass: 0,
          poseDetection: normalizedPoseScore,
          keypointAvg: normalizedKeypointScore,
          final: fallbackScore
        });
      }
    } catch (error) {
      console.error('Error in pose detection:', error);
      setConfidenceScore(0);
      setSkeletonColor('rgb(255,255,255)');
      setDetailedScores({ poseClass: 0, poseDetection: 0, keypointAvg: 0, final: 0 });
    }
  };

  const startYoga = () => {
    setIsStartPose(true);
    const now = Date.now();
    setStartingTime(now);
    setCurrentTime(now);
    setBestPerform(0);
    setPoseTime(0);
    setDetailedScores({
      poseClass: 0,
      poseDetection: 0,
      keypointAvg: 0,
      final: 0
    });
    runMovenet();
  };

  const stopPose = () => {
    setIsStartPose(false);
    clearInterval(intervalRef.current);
    countAudioRef.current.pause();
    countAudioRef.current.currentTime = 0;
    // Don't reset best perform when stopping
    setStartingTime(0);
    setCurrentTime(0);
    setPoseTime(0);
  };

  if (isStartPose) {
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
          <div className="pose-performance">
            <h4>Confidence: {(confidenceScore * 100).toFixed(1)}%</h4>
            <div className="detailed-scores" style={{ fontSize: '0.8em', color: '#666' }}>
              <div>Pose: {(detailedScores.poseClass * 100).toFixed(1)}%</div>
              <div>Detection: {(detailedScores.poseDetection * 100).toFixed(1)}%</div>
              <div>Keypoints: {(detailedScores.keypointAvg * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
        
        <div className="yoga-pose-area">
          <div className="webcam-container">
            <Webcam
              width='640px'
              height='480px'
              ref={webcamRef}
              style={{ position: 'absolute', left: 0, top: 100 }}
            />
            <canvas
              ref={canvasRef}
              width='640px'
              height='480px'
              style={{ position: 'absolute', left: 0, top: 100, zIndex: 1 }}
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
            detailedScores={detailedScores}
          />
        </div>
        
        <button onClick={stopPose} className="secondary-btn">
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