"use client";

import React, { useState } from 'react';

interface CardProps {
  title: string;
  description: string;
  buttonText: string;
  handleButtonClick: (title: string, selectedOption: string, summaryLength: number, url: string) => Promise<void>;
  isSummaryCard: boolean;
  }

const Card: React.FC<CardProps> = ({ title, description, buttonText, handleButtonClick, isSummaryCard}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [url, seturl] = useState('');
  const [summaryLength, setSummaryLength] = useState<number>(1);
  const [urlError, setUrlError] = useState('');

  // const handleSeturl = (url: string) => {
  //   seturl(url)
  //   setUrlError('');
  // }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    setUrlError('');
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    seturl(event.target.value);
  }

  const handleLengthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSummaryLength= event.target.value
    setSummaryLength(parseInt(selectedSummaryLength));
    setUrlError('');
  }
  // const handleButtonClick = async (title: string, selectedOption: string, url: string) => {
    
  // };
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
      <select
        value={selectedOption}
        onChange={handleSelectChange}
        className="block w-50 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
      >
        <option value="">Select an option</option>
          <option value="youtube">YouTube URL</option>
          <option value="webpage">Web Page URL</option>
      </select>
      <br />
      {isSummaryCard && 
        <select
          value={summaryLength}
          onChange={handleLengthChange}
          className="block w-50 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">Select an option</option>
            <option value="0">Short</option>
            <option value="1">Medium</option>
            <option value="2">Long</option>
        </select>
      }
      <br />
      <input
        type="url"
        placeholder="Enter URL"
        value={url}
        onChange={handleUrlChange}
        className="block w-80 p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
      />
      {urlError && <p className="text-red-500 text-sm">{urlError}</p>}
      <button onClick={() => handleButtonClick(title, selectedOption, summaryLength, url)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
      {buttonText}
      </button>
      

    </div>
  );
};

export default Card;
