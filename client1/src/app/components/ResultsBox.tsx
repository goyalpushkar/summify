"use client";

import React, { useState } from 'react';

interface ResultsBoxProps {
    result: string
  }
  // youtubeUrl: string;
  // webpageUrl: string; 

const ResultsBox: React.FC<ResultsBoxProps> = ({ result }) => {
    const [results, setResults] = useState<string>("");

    const handleButtonClick = async () => {
        // console.log("URL:", customUrl);
        let endpoint = null;
        
    }

    return (
        <div >
            <textarea
                value={results}
                readOnly
                style={{ width: "100%", height: "200px" }}
            />
        </div> 
    )
};

export default ResultsBox;