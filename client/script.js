document.addEventListener('DOMContentLoaded', () => {
  const getCaptionsButton = document.getElementById('getCaptions');
    getCaptionsButton.textContent = "Get Captions"
  const getSummaryButton = document.getElementById('getSummaryButton');
  const urlInput = document.getElementById('urlInput');
  const sourceType = document.getElementById('sourceType');
  const captionsCard = document.getElementById('captionsCard');
  const summaryCard = document.getElementById('summaryCard');


  getCaptionsButton.addEventListener('click', async () => {
    const selectedType = sourceType.value;
    const url = urlInput.value;

    if (!url) {
      console.error('Please enter a URL.');
      return;
    }

    let endpoint = '';
    let requestBody = {};

    if (selectedType === 'YouTubeUrl') {
      endpoint = '/api/captions/videoCaptions';
      requestBody = { videoUrl: url };
    } else if (selectedType === 'WebPage') {
      endpoint = '/api/captions/webCaptions';
      requestBody = { webURL: url };
    } else {
      console.error('Invalid URL type selected.');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response:', data);
      displayCaptions(data);
    } catch (error) {
      console.error('Error fetching captions:', error);
    }
  });

  getSummaryButton.addEventListener('click', async () => {
    const selectedType = sourceType.value;
    const url = urlInput.value;

    if (!url) {
      console.error('Please enter a URL.');
      return;
    }

    let endpoint = '';
    let requestBody = {};

    if (selectedType === 'YouTubeUrl') {
      endpoint = '/api/summary/videoSummary';
      requestBody = { videoUrl: url };
    } else if (selectedType === 'WebPage') {
      endpoint = '/api/summary/webSummary';
      requestBody = { webURL: url };
    } else {
      console.error('Invalid URL type selected.');
      return;
    }
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
        const data = await response.json();
        if(!response.ok) throw new Error("HTTP error! status: "+ response.status);

        displaySummary(data);
        console.log("Summary data: ",data);
    } catch (error) {
        console.error('Error getting Summary',error);
    }
  });

  function displayCaptions(captionsData) {
    captionsCard.innerHTML = ''; 
    if (captionsData && captionsData.captions && Array.isArray(captionsData.captions)) {
        captionsData.captions.forEach(caption => {
            const captionElement = document.createElement('p');
            captionElement.textContent = caption.text;
            captionsCard.appendChild(captionElement);
        });
    }
}

function displaySummary(summaryData){
    summaryCard.innerHTML = '';
    if(summaryData && summaryData.summary && typeof summaryData.summary === 'string'){
        const summaryElement = document.createElement('p');
        summaryElement.textContent = summaryData.summary;
        summaryCard.appendChild(summaryElement);
    } else {
        summaryCard.textContent = "Failed to load summary";
    }
}

});