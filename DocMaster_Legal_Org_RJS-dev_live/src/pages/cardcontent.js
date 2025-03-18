import React, { useState, useEffect } from 'react';

const CardContents = ({ cardId }) => {
  const [cardContent, setCardContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://web1024.ipguide.net:5000/card_content'); // Replace with your API endpoint
        const data = await response.json();

        // Find the card with the matching ID
        const card = data.result_message.find(item => item.id === cardId);

        if (card) {
          setCardContent(card.card_content || 'No content available'); // Handle empty card_content
          console.log(`Fetched content for card ID ${cardId}:`, card.card_content || 'No content available');
        } else {
          setCardContent('No content found for this card.');
          console.log(`No card found for card ID ${cardId}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCardContent('Error loading content.');
      }
    };

    fetchData();
  }, [cardId]);

  // return cardContent || "We offer unique solutions for legal professionals.";
  return cardContent || " ";

};

export default CardContents;
