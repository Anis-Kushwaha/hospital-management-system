import React from "react";
import { useState,useEffect } from "react";


const rollingWords = ["Happy Patient", "Happy Moments", "Smiles on Faces", " Happy Stories", "Happy Experiences"];

function PatientSatisfactionSection() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % rollingWords.length);
        setAnimate(false);
      }, 200);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="result-container" id="happy-pateints">
        <div className="section-header1">
          <span className="section-subtitle">Our Team</span>
          <h2 className="section-title">
            We are Creating the {' '}
            <span className={`rolling-word ${animate ? 'enter' : 'exit'}`}>
              {rollingWords[index]}
            </span>
          </h2>
          <p className="section-description">
             We provide comprehensive healthcare services...
          </p>
        </div>
      </div>
  );
}

export default PatientSatisfactionSection;