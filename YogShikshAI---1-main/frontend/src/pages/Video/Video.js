import React, { useRef } from 'react';
import './Video.css'; // Import CSS for styling

function Video() {
  const beginnerScrollRef = useRef(null); // Reference for the beginner scroll container
  const intermediateScrollRef = useRef(null); // Reference for the intermediate scroll container
  const advancedScrollRef = useRef(null); // Reference for the advanced scroll container

  // Function to scroll the beginner container to the right
  const scrollRightBeginner = () => {
    beginnerScrollRef.current.scrollLeft += 600; // Adjust the scroll amount as needed
  };

  // Function to scroll the beginner container to the left
  const scrollLeftBeginner = () => {
    beginnerScrollRef.current.scrollLeft -= 600; // Adjust the scroll amount as needed
  };

  // Function to scroll the intermediate container to the right
  const scrollRightIntermediate = () => {
    intermediateScrollRef.current.scrollLeft += 600; // Adjust the scroll amount as needed
  };

  // Function to scroll the intermediate container to the left
  const scrollLeftIntermediate = () => {
    intermediateScrollRef.current.scrollLeft -= 600; // Adjust the scroll amount as needed
  };

  // Function to scroll the advanced container to the right
  const scrollRightAdvanced = () => {
    advancedScrollRef.current.scrollLeft += 600; // Adjust the scroll amount as needed
  };

  // Function to scroll the advanced container to the left
  const scrollLeftAdvanced = () => {
    advancedScrollRef.current.scrollLeft -= 600; // Adjust the scroll amount as needed
  };

  return (
    <div className="tutorial-container">
      {/* Beginner Videos */}
      <div className="video-row">
        <h2>Beginner</h2>
        <div className="video-container" ref={beginnerScrollRef}>
          {/* List of beginner videos */}
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/Dic293YNJI8?rel=0"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          {/* Add more beginner videos as needed */}
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/fOdrW7nf9gw?rel=0"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/ET_cKo1Ta1s?rel=0"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/d_dh_DwDr84?rel=0"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/vNjX6uZEKU4?rel=0"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/g78vfuC4QBI?rel=0"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        {/* Buttons to scroll */}
        <button className="scroll-button left" onClick={scrollLeftBeginner}>
          &lt;
        </button>
        <button className="scroll-button right" onClick={scrollRightBeginner}>
          &gt;
        </button>
      </div>

      {/* Intermediate Videos */}
      <div className="video-row">
        <h2>Intermediate</h2>
        <div className="video-container" ref={intermediateScrollRef}>
          {/* List of intermediate videos */}
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_7"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_8"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_9"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_10"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_11"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_12"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        {/* Buttons to scroll */}
        <button className="scroll-button left" onClick={scrollLeftIntermediate}>
          &lt;
        </button>
        <button className="scroll-button right" onClick={scrollRightIntermediate}>
          &gt;
        </button>
      </div>

      {/* Advanced Videos */}
      <div className="video-row">
        <h2>Advanced</h2>
        <div className="video-container" ref={advancedScrollRef}>
          {/* List of advanced videos */}
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_13"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_14"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_15"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_16"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_17"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video">
            <iframe
              width="300"
              height="200"
              src="https://www.youtube.com/embed/VIDEO_ID_18"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        {/* Buttons to scroll */}
        <button className="scroll-button left" onClick={scrollLeftAdvanced}>
          &lt;
        </button>
        <button className="scroll-button right" onClick={scrollRightAdvanced}>
          &gt;
        </button>
      </div>
    </div>
  );
}

export default Video;
