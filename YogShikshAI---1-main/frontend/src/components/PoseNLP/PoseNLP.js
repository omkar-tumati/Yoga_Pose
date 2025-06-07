import React, { useState, useEffect } from 'react';
import './PoseNLP.css';

const PoseNLP = ({ currentPose, poseKeypoints, confidenceScore, detailedScores }) => {
  const [feedback, setFeedback] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [corrections, setCorrections] = useState([]);

  const analyzePose = (pose, keypoints, confidence, scores) => {
    setFeedback('');
    setCorrections([]);
    
    if (!keypoints || keypoints.length === 0) {
      setFeedback("Please position yourself clearly in the frame.");
      return;
    }

    // Display detailed confidence scores
    const feedbackText = `
      Overall: ${(confidence * 100).toFixed(1)}%
      Pose Match: ${(scores?.poseClass * 100 || 0).toFixed(1)}%
      Detection: ${(scores?.poseDetection * 100 || 0).toFixed(1)}%
      Keypoints: ${(scores?.keypointAvg * 100 || 0).toFixed(1)}%
    `;
    setFeedback(feedbackText);
    
    const newCorrections = [];
    analyzeCommonPosture(keypoints, newCorrections);
    
    switch(pose) {
      case 'Tadasana':
        analyzeTadasana(keypoints, newCorrections);
        break;
      case 'Sukhasana':
        analyzeSukhasana(keypoints, newCorrections);
        break;
      case 'Vajrasana':
        analyzeVajrasana(keypoints, newCorrections);
        break;
            case 'Vrikshasana':
        analyzeVrikshasana(keypoints, newCorrections);
        break;
      case 'Bhujangasana':
        analyzeBhujangasana(keypoints, newCorrections);
        break;
      case 'Setu Bandasana':
      case 'Setu_Bandasana':
        analyzeSetuBandasana(keypoints, newCorrections);
        break;
      case 'Uttanpadasana':
        analyzeUttanpadasana(keypoints, newCorrections);
        break;
      case 'Trikonasana':
        analyzeTrikonasana(keypoints, newCorrections);
        break;
      case 'Virabhadrasana':
        analyzeVirabhadrasana(keypoints, newCorrections);
        break;
      case 'Utkatasana':
        analyzeUtkatasana(keypoints, newCorrections);
        break;
      case 'Dandasana':
        analyzeDandasana(keypoints, newCorrections);
        break;
      case 'Janu Sirsasana':
      case 'Janu_Sirsasana':
        analyzeJanuSirsasana(keypoints, newCorrections);
        break;
      case 'Paschimottanasana':
        analyzePaschimottanasana(keypoints, newCorrections);
        break;
      case 'Ardha Chandrasana':
      case 'Ardha_Chandrasana':
        analyzeArdhaChandrasana(keypoints, newCorrections);
        break;
      case 'Bakasana':
        analyzeBakasana(keypoints, newCorrections);
        break;
      case 'Chakrasana':
        analyzeChakrasana(keypoints, newCorrections);
        break;
      case 'Gomkhasana':
        analyzeGomkhasana(keypoints, newCorrections);
        break;
      case 'Navasana':
        analyzeNavasana(keypoints, newCorrections);
        break;
      case 'Parsvottanasana':
        analyzeParsvottanasana(keypoints, newCorrections);
        break;
      case 'Padmasana':
        analyzePadmasana(keypoints, newCorrections);
        break;
      default:
        break;
    }
    
    setCorrections(newCorrections);
  };

  // Load base instructions when pose changes
  useEffect(() => {
    const baseInstructions = getPoseInstructions(currentPose);
    setInstructions(baseInstructions);
  }, [currentPose]);

  // Analyze pose when keypoints are available
  useEffect(() => {
    if (!poseKeypoints || confidenceScore === undefined) return;
    analyzePose(currentPose, poseKeypoints, confidenceScore, detailedScores);
  }, [currentPose, poseKeypoints, confidenceScore, detailedScores]);

    // Helper functions to analyze poses
  const analyzeCommonPosture = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const nose = keypoints[0];
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    
    // Check shoulder alignment
    if (Math.abs(leftShoulder.y - rightShoulder.y) > 20) {
      corrections.push("Level your shoulders");
    }
    
    // Check hip alignment
    if (Math.abs(leftHip.y - rightHip.y) > 20) {
      corrections.push("Balance your hips");
    }
    
    // Check neck alignment
    const midShouldersX = (leftShoulder.x + rightShoulder.x) / 2;
    if (Math.abs(nose.x - midShouldersX) > 30) {
      corrections.push("Center your head over your spine");
    }
  };

  const analyzeTadasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    const leftAnkle = keypoints[15];
    const rightAnkle = keypoints[16];
    
    // Check if feet are together
    if (Math.abs(leftAnkle.x - rightAnkle.x) > 30) {
      corrections.push("Bring your feet closer together");
    }
    
    // Check if knees are straight
    if (Math.abs(leftKnee.y - leftAnkle.y) < 120) {
      corrections.push("Straighten your legs completely");
    }
    
    // Check if body is aligned vertically
    const hipMidX = (leftHip.x + rightHip.x) / 2;
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    if (Math.abs(hipMidX - shoulderMidX) > 20) {
      corrections.push("Align your shoulders directly over your hips");
    }
  };

  const analyzeSukhasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    
    // Check if spine is straight in seated position
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipMidY = (leftHip.y + rightHip.y) / 2;
    
    if (shoulderMidY > hipMidY - 100) { // Shoulders should be higher than hips in seated position
      corrections.push("Sit up tall, lengthen your spine");
    }
    
    // Shoulders should be relaxed and not hunched
    if (shoulderMidY < hipMidY - 150) {
      corrections.push("Relax your shoulders down and back");
    }
  };

  const analyzeVajrasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    
    // Check if knees are close together
    if (Math.abs(leftHip.x - rightHip.x) > 50) {
      corrections.push("Keep your knees closer together");
    }
    
    // Check if torso is upright
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipMidY = (leftHip.y + rightHip.y) / 2;
    if (shoulderMidY > hipMidY - 100) {
      corrections.push("Lift your chest and sit more upright");
    }
  };

  const analyzeVrikshasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    const leftAnkle = keypoints[15];
    const rightAnkle = keypoints[16];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    
    // Check if standing leg is straight
    const standingLegLength = Math.abs(leftKnee.y - leftAnkle.y);
    if (standingLegLength < 100) {
      corrections.push("Straighten your standing leg completely");
    }
    
    // Check if raised foot is properly placed
    const kneeDistance = Math.abs(leftKnee.x - rightKnee.x);
    if (kneeDistance < 40) {
      corrections.push("Place your foot higher on the inner thigh");
    }
    
    // Check if hips are facing forward
    if (Math.abs(leftHip.x - rightHip.x) > 30) {
      corrections.push("Keep your hips square to the front");
    }
  };

  const analyzeBhujangasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftElbow = keypoints[7];
    const rightElbow = keypoints[8];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    
    // Check if elbows are bent and close to body
    if (Math.abs(leftElbow.x - leftShoulder.x) > 50) {
      corrections.push("Keep elbows closer to your body");
    }
    
    // Check if shoulders are away from ears
    if (leftShoulder.y < leftElbow.y - 40) {
      corrections.push("Draw your shoulders down away from your ears");
    }
    
    // Check if hips are pressing into the ground
    const hipHeight = (leftHip.y + rightHip.y) / 2;
    const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
    if (hipHeight < shoulderHeight + 50) {
      corrections.push("Keep your hips pressing into the ground");
    }
  };

  const analyzeSetuBandasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    
    // Check if hips are lifted high enough
    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipY = (leftHip.y + rightHip.y) / 2;
    if (hipY > shoulderY - 30) {
      corrections.push("Lift your hips higher towards the ceiling");
    }
    
    // Check if knees are aligned with hips
    const kneeWidth = Math.abs(leftKnee.x - rightKnee.x);
    const hipWidth = Math.abs(leftHip.x - rightHip.x);
    if (Math.abs(kneeWidth - hipWidth) > 30) {
      corrections.push("Keep your knees hip-width apart and parallel");
    }
  };

  const analyzeUttanpadasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    const leftAnkle = keypoints[15];
    const rightAnkle = keypoints[16];
    
    // Check if legs are straight
    const leftLegAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    if (leftLegAngle < 160) {
      corrections.push("Straighten your legs completely");
    }
    
    // Check if legs are raised to appropriate height
    if (leftAnkle.y > leftHip.y - 50) {
      corrections.push("Raise your legs higher");
    }
    
    // Check if lower back is pressed into the ground
    if (leftHip.y < leftKnee.y - 50) {
      corrections.push("Press your lower back into the ground");
    }
  };

  const analyzeTrikonasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    
    // Check if front leg is straight
    if (Math.abs(leftKnee.y - leftHip.y) < 80) {
      corrections.push("Keep your front leg completely straight");
    }
    
    // Check if shoulders are stacked vertically
    if (Math.abs(leftShoulder.x - rightShoulder.x) < 80) {
      corrections.push("Open your chest more, shoulders should be stacked");
    }
    
    // Check if hips are open
    if (Math.abs(leftHip.x - rightHip.x) < 50) {
      corrections.push("Open your hips wider");
    }
  };

  const analyzeVirabhadrasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    const leftAnkle = keypoints[15];
    const rightAnkle = keypoints[16];
    
    // Check if front knee is bent at 90 degrees
    if (Math.abs(leftKnee.x - leftAnkle.x) > 40) {
      corrections.push("Align front knee over ankle");
    }
    
    // Check if torso is upright
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    const hipMidX = (leftHip.x + rightHip.x) / 2;
    if (Math.abs(shoulderMidX - hipMidX) > 30) {
      corrections.push("Keep your torso upright, directly over your hips");
    }
    
    // Check if back leg is straight
    if (Math.abs(rightKnee.y - rightAnkle.y) < 80) {
      corrections.push("Straighten your back leg completely");
    }
  };

  const analyzeUtkatasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    const leftAnkle = keypoints[15];
    const rightAnkle = keypoints[16];
    
    // Check if knees are bent enough
    if (leftKnee.y < leftHip.y - 40) {
      corrections.push("Bend your knees deeper");
    }
    
    // Check if knees are aligned with feet
    if (Math.abs(leftKnee.x - leftAnkle.x) > 30) {
      corrections.push("Keep your knees aligned with your feet");
    }
    
    // Check if chest is lifted
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipMidY = (leftHip.y + rightHip.y) / 2;
    if (shoulderMidY > hipMidY - 80) {
      corrections.push("Lift your chest more and lean back slightly");
    }
  };

  const analyzeDandasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    const leftAnkle = keypoints[15];
    const rightAnkle = keypoints[16];
    
    // Check if legs are straight
    if (leftKnee.y < leftHip.y + 30) {
      corrections.push("Straighten your legs completely");
    }
    
    // Check if back is straight
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipMidY = (leftHip.y + rightHip.y) / 2;
    if (shoulderMidY > hipMidY - 100) {
      corrections.push("Sit up taller, lengthen your spine");
    }
    
    // Check if feet are flexed
    if (leftAnkle.y < leftKnee.y - 60) {
      corrections.push("Flex your feet, pointing toes up");
    }
  };

  const analyzeJanuSirsasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    
    // Check if extended leg is straight
    if (leftKnee.y < leftHip.y + 30) {
      corrections.push("Keep your extended leg completely straight");
    }
    
    // Check if folding from hips not back
    const shoulderToHipDistance = Math.abs(leftShoulder.y - leftHip.y);
    if (shoulderToHipDistance < 60) {
      corrections.push("Fold from your hips, not your lower back");
    }
    
    // Check if bent knee is properly positioned
    if (Math.abs(rightKnee.x - rightHip.x) < 40) {
      corrections.push("Open your bent knee wider to the side");
    }
  };

  const analyzePaschimottanasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    
    // Check if legs are straight
    if (leftKnee.y < leftHip.y + 30 || rightKnee.y < rightHip.y + 30) {
      corrections.push("Keep both legs completely straight");
    }
    
    // Check if folding from hips
    const shoulderToHipDistance = Math.abs(leftShoulder.y - leftHip.y);
    if (shoulderToHipDistance < 50) {
      corrections.push("Fold from your hips, not your lower back");
    }
    
    // Check if spine is lengthening
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    const hipMidX = (leftHip.x + rightHip.x) / 2;
    if (Math.abs(shoulderMidX - hipMidX) > 40) {
      corrections.push("Keep your spine aligned as you fold forward");
    }
  };

  const analyzeArdhaChandrasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    const leftAnkle = keypoints[15];
    
    // Check if standing leg is straight
    if (Math.abs(leftKnee.y - leftAnkle.y) < 100) {
      corrections.push("Straighten your standing leg completely");
    }
    
    // Check if hips are open
    if (Math.abs(leftHip.x - rightHip.x) < 50) {
      corrections.push("Stack your hips, opening them to the side");
    }
    
    // Check if shoulders and hips are aligned
    const shoulderLine = Math.abs(leftShoulder.x - rightShoulder.x);
    const hipLine = Math.abs(leftHip.x - rightHip.x);
    if (Math.abs(shoulderLine - hipLine) > 30) {
      corrections.push("Align your shoulders with your hips");
    }
  };

  const analyzeBakasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftElbow = keypoints[7];
    const rightElbow = keypoints[8];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    
    // Check if elbows are bent properly
    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftKnee);
    if (leftElbowAngle > 120) {
      corrections.push("Bend your elbows more");
    }
    
    // Check if knees are positioned correctly on arms
    if (Math.abs(leftKnee.y - leftElbow.y) > 40) {
      corrections.push("Place your knees higher on your upper arms");
    }
    
    // Check if gaze is forward not down
    // Using estimated head position compared to shoulders
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    if (shoulderMidY < leftElbow.y) {
      corrections.push("Look forward, not down at the floor");
    }
  };

  const analyzeChakrasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftElbow = keypoints[7];
    const rightElbow = keypoints[8];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    
    // Check if back is arched enough
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipMidY = (leftHip.y + rightHip.y) / 2;
    if (Math.abs(shoulderMidY - hipMidY) < 100) {
      corrections.push("Arch your back more");
    }
    
    // Check if arms are straight
    const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftHip);
    if (leftArmAngle < 160) {
      corrections.push("Straighten your arms completely");
    }
    
    // Check if weight is distributed evenly
    if (Math.abs(leftShoulder.y - rightShoulder.y) > 30) {
      corrections.push("Distribute weight evenly between hands and feet");
    }
  };

  const analyzeGomkhasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftElbow = keypoints[7];
    const rightElbow = keypoints[8];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    
    // Check if elbows are aligned
    if (Math.abs(leftElbow.y - rightElbow.y) > 40) {
      corrections.push("Work to bring your elbows closer together");
    }
    
    // Check if spine is upright
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    const hipMidX = (leftHip.x + rightHip.x) / 2;
    if (Math.abs(shoulderMidX - hipMidX) > 30) {
      corrections.push("Sit up taller, keep your spine vertical");
    }
    
    // Check if shoulders are relaxed
    if (leftShoulder.y < leftElbow.y - 20) {
      corrections.push("Relax your shoulders down away from ears");
    }
  };

  const analyzeNavasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    const leftAnkle = keypoints[15];
    const rightAnkle = keypoints[16];
    
    // Check if legs are straight
    const legAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    if (legAngle < 160) {
      corrections.push("Straighten your legs more");
    }
    
    // Check if back is at proper angle
    const hipToShoulderAngle = calculateAngle(leftKnee, leftHip, leftShoulder);
    if (hipToShoulderAngle < 30 || hipToShoulderAngle > 60) {
      corrections.push("Adjust your torso to 45 degree angle from floor");
    }
    
    // Check if legs are lifted high enough
    if (leftAnkle.y > leftHip.y) {
      corrections.push("Lift your legs higher");
    }
  };

  const analyzeParsvottanasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    const leftAnkle = keypoints[15];
    const rightAnkle = keypoints[16];
    
    // Check if front leg is straight
    if (Math.abs(leftKnee.y - leftAnkle.y) < 100) {
      corrections.push("Straighten your front leg completely");
    }
    
    // Check if hips are square
    if (Math.abs(leftHip.y - rightHip.y) > 30) {
      corrections.push("Square your hips to the front");
    }
    
    // Check if spine is extended
    const shoulderToHipDistance = Math.abs(leftShoulder.y - leftHip.y);
    if (shoulderToHipDistance < 60) {
      corrections.push("Lengthen through your spine as you fold");
    }
  };

  const analyzePadmasana = (keypoints, corrections) => {
    if (!keypoints || keypoints.length < 17) return;
    
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftKnee = keypoints[13];
    const rightKnee = keypoints[14];
    
    // Check if spine is straight
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipMidY = (leftHip.y + rightHip.y) / 2;
    if (shoulderMidY > hipMidY - 100) {
      corrections.push("Sit up taller, lengthen your spine");
    }
    
    // Check if knees are close to the floor
    if (leftKnee.y < leftHip.y - 40 || rightKnee.y < rightHip.y - 40) {
      corrections.push("Work on bringing your knees closer to the floor");
    }
    
    // Check shoulders are relaxed
    if (leftShoulder.y < leftHip.y - 150) {
      corrections.push("Relax your shoulders down and back");
    }
  };

  const calculateAngle = (p1, p2, p3) => {
    if (!p1 || !p2 || !p3) return 180;
    
    const angleRad = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angleDeg = Math.abs(angleRad * 180 / Math.PI);
    
    if (angleDeg > 180) {
      angleDeg = 360 - angleDeg;
    }
    
    return angleDeg;
  };

  // Get pose instructions
  const getPoseInstructions = (pose) => {
    const poseGuide = {
      'Tadasana': [
        "Stand with feet together or hip-width apart",
        "Distribute weight evenly across feet",
        "Engage thigh muscles and lift kneecaps",
        "Lengthen tailbone toward floor",
        "Draw abdomen in slightly",
        "Broaden chest and roll shoulders back",
        "Let arms hang naturally by sides",
        "Keep head level, gaze forward"
      ],
      'Sukhasana': [
        "Sit on the floor with legs crossed comfortably",
        "Place each foot beneath the opposite knee",
        "Rest your hands on your knees",
        "Sit up tall with spine straight",
        "Relax your shoulders away from your ears",
        "Keep your chest open and breathe deeply",
        "Rest your gaze softly at eye level"
      ],
      'Vajrasana': [
        "Kneel on the floor with knees together",
        "Rest your buttocks on your heels",
        "Place your palms on your thighs",
        "Sit up tall with spine straight",
        "Keep shoulders relaxed and chest open",
        "Look forward with chin parallel to floor",
        "Breathe deeply and hold the pose"
      ],
      'Vrikshasana': [
        "Stand with feet together in Tadasana",
        "Shift weight onto left foot",
        "Place right foot on inner left thigh (above or below knee)",
        "Press foot into thigh and thigh into foot",
        "Join palms at heart center or raise overhead",
        "Fix gaze on a point to maintain balance",
        "Hold the pose while breathing steadily"
      ],
      'Bhujangasana': [
        "Lie on your stomach with legs extended",
        "Place palms under shoulders, elbows close to body",
        "Press tops of feet and thighs into the floor",
        "Inhale and lift chest off the floor",
        "Keep elbows slightly bent and close to body",
        "Keep lower ribs on the floor",
        "Gaze slightly upward without straining neck"
      ],
      'Setu Bandasana': [
        "Lie on your back with knees bent",
        "Place feet hip-width apart, close to buttocks",
        "Arms flat on floor alongside your body",
        "Press feet into floor and lift hips toward ceiling",
        "Clasp hands beneath back or hold ankles",
        "Keep thighs and feet parallel",
        "Hold the pose with steady breathing"
      ],
      'Uttanpadasana': [
        "Lie on your back with legs extended",
        "Place arms alongside your body, palms down",
        "Press lower back into the floor",
        "Inhale and raise both legs to 30-60 degrees",
        "Keep legs straight and together",
        "Engage your core muscles to support your back",
        "Hold the pose while breathing normally"
      ],
      'Trikonasana': [
        "Stand with feet wide apart",
        "Turn right foot out 90° and left foot in slightly",
        "Extend arms to sides at shoulder height",
        "Reach right hand down toward right foot",
        "Extend left arm straight up toward ceiling",
        "Keep both legs straight and chest open",
        "Gaze up at your top hand"
      ],
      'Virabhadrasana': [
        "Stand with feet wide apart",
        "Turn right foot out 90° and left foot in 45°",
        "Bend right knee to 90°, directly over ankle",
        "Keep left leg straight and strong",
        "Raise arms overhead, palms facing each other",
        "Gaze forward or at hands",
        "Hold with powerful energy"
      ],
      'Utkatasana': [
        "Stand with feet together or hip-width apart",
        "Bend knees and lower hips as if sitting in chair",
        "Reach arms overhead, palms facing inward",
        "Keep weight in heels, not toes",
        "Draw tailbone down toward floor",
        "Keep chest lifted and back straight",
        "Gaze forward and breathe deeply"
      ],
      'Dandasana': [
        "Sit on floor with legs extended forward",
        "Place palms on floor beside hips",
        "Press thighs down and point toes up",
        "Sit on sit bones with spine straight",
        "Draw shoulders back and chest forward",
        "Engage leg muscles and flex feet",
        "Look straight ahead with chin parallel to floor"
      ],
      'Janu Sirsasana': [
        "Sit with left leg extended, right knee bent",
        "Place right foot against inner left thigh",
        "Turn torso to face extended leg",
        "Inhale and lengthen spine",
        "Exhale and fold forward from hips",
        "Reach for left foot with both hands",
        "Keep back flat and extended leg straight"
      ],
      'Paschimottanasana': [
        "Sit with both legs extended forward",
        "Flex feet with toes pointing up",
        "Inhale and lengthen spine",
        "Exhale and fold forward from hips",
        "Reach for feet with both hands",
        "Keep legs straight and back lengthened",
        "Rest forehead toward knees"
      ],
      'Ardha Chandrasana': [
        "Start in Triangle pose on right side",
        "Bend right knee slightly",
        "Place right hand on floor or block",
        "Shift weight onto right foot",
        "Lift left leg parallel to floor",
        "Extend left arm toward ceiling",
        "Balance with hips and shoulders stacked",
        "Gaze up at top hand"
      ],
      'Bakasana': [
        "Start in a squat position",
        "Place hands on floor shoulder-width apart",
        "Bend elbows slightly",
        "Lean forward and place knees on upper arms",
        "Shift weight forward onto hands",
        "Lift feet off floor one at a time",
        "Gaze forward and hold the balance"
      ],
      'Chakrasana': [
        "Lie on your back with knees bent",
        "Place hands by ears, fingers pointing toward shoulders",
        "Press feet and hands into floor",
        "Lift hips and chest, coming into wheel pose",
        "Straighten arms and legs",
        "Keep feet parallel and press through heels",
        "Breathe deeply in the backbend"
      ],
      'Gomkhasana': [
        "Sit with legs extended",
        "Cross right leg over left",
        "Bring right heel beside left hip",
        "Bring left foot beside right hip",
        "Reach right arm up, bend elbow behind head",
        "Reach left arm down, bend elbow behind back",
        "Try to clasp hands behind back"
      ],
      'Navasana': [
        "Sit with knees bent, feet on floor",
        "Lean back slightly to balance on sit bones",
        "Lift feet off floor, keeping knees bent",
        "Straighten legs to form V-shape with body",
        "Extend arms parallel to floor",
        "Balance on sit bones with chest lifted",
        "Gaze forward past toes"
      ],
      'Parsvottanasana': [
        "Stand with feet wide apart",
        "Turn right foot out 90° and left foot in 60°",
        "Square hips to front",
        "Bring palms together behind back in prayer",
        "Inhale and lengthen spine",
        "Exhale and fold forward over right leg",
        "Keep both legs straight"
      ],
      'Padmasana': [
        "Sit on floor with legs extended",
        "Bend right knee and place right foot on left thigh",
        "Bend left knee and place left foot on right thigh",
        "Both feet should rest on opposite thighs",
        "Keep spine straight and shoulders relaxed",
        "Rest hands on knees in mudra",
        "Close eyes or gaze softly forward"
      ]
    };

    return poseGuide[pose] || ["Center yourself in frame", "Follow the reference pose"];
  };

  // Render component
  return (
    <div className="pose-nlp-container">
      <h3>AI Pose Coach</h3>
      
      <div className="feedback-container">
        <h4>Feedback:</h4>
        <p className="primary-feedback">
          {feedback || "Waiting for pose detection..."}
        </p>
        
        {corrections.length > 0 && (
          <div className="corrections">
            <h4>Corrections Needed:</h4>
            <ul>
              {corrections.map((correction, index) => (
                <li key={index}>{correction}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="instructions-container">
        <h4>Instructions:</h4>
        <ol>
          {instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default PoseNLP;
