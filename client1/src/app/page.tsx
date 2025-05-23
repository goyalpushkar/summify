"use client";

import { useState } from "react";
import Card from "./components/Card";
import ResultsDisplay from "./components/ResultsDisplay";

export default function Home() {
  const [results, setResults] = useState<string>("");

  const handleButtonClick = async (title: string, selectedOption: string, summaryLength: number, url: string) => {
      let endpoint: string | null = "https://10.88.0.3:3000";
      // "http://localhost:3000";
      // http://10.88.0.3:3000;
          
      if (title === "Captions"){
        endpoint += "/api/captions"

        if (selectedOption == "youtube"){
          endpoint += "/videoCaptions";
        }
        else if (selectedOption == "webpage"){
          endpoint += "/webCaptions";
        }
      }
      else if (title == "Summary"){
        endpoint += "/api/summary"

        if (selectedOption == "youtube"){
          endpoint += "/videoSummary";
        }
        else if (selectedOption == "webpage"){
          endpoint += "/webSummary";
        }
      }
      else if (title == "Statements"){
        endpoint += "/api/statements"

        if (selectedOption == "youtube"){
          endpoint += "/videoStatements";
        }
        else if (selectedOption == "webpage"){
          endpoint += "/webStatements";
        }
      }
      else{
        endpoint = null
      }

      if (!endpoint) {
        console.error("Invalid title:", title);
        return;
      }

      let requestBody: BodyInit | null | undefined;
      if (title == "Summary"){
        requestBody = JSON.stringify({ url, summaryLength })
      }
      else{
        requestBody = JSON.stringify({ url })
      }
      console.log("Endpoint: " + {endpoint} + " " + "Request Body: " + {requestBody})

      try {
        const response = await fetch(endpoint, 
                                    { method: "POST", 
                                      headers: { "Content-Type": "application/json" },
                                      body: requestBody
                                    });
        const data = await response.json();
        // setResults(JSON.stringify(data, null, 2));
        // return JSON.stringify(data, null, 2)
        console.log("Response Data: " + data)
        const resultText = data[Object.keys(data)[0]];
        setResults(resultText ? resultText : "No result.");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
  };

  const cardsData = [
    {
      title: "Captions", description: "Enter URL to get captions",
      buttonText: "Get Captions",
    },
    {
      title: "Summary", description: "Enter URL to get summary",
      buttonText: "Get Summary",
    },
    { title: "Statements", description: "Enter URL to get Statements",
        buttonText: "Get Statements",
    },
  ];
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 w-full">
          {cardsData.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              handleButtonClick={handleButtonClick}
              isSummaryCard={true ? card.title === 'Summary': false}
              //url={""}
            />
          ))}
          <ResultsDisplay results={results} />
        </div>
      </main>
    </div>
  );
}
