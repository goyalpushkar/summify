import React from 'react';

interface ResultsDisplayProps {
  results: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div >
      <textarea
        value={results}
        readOnly
        style={{ width: "100%", height: "200px" }}
      />
    </div>  
  );
};

export default ResultsDisplay;