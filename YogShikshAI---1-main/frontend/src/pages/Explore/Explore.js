// Explore.js
import React, { useEffect, useState } from 'react';
import './Explore.css'; // Import the Explore component styles

function Explore() {
  const [articles, setArticles] = useState([]);

  // Fetch articles from the API
  useEffect(() => {
    fetchArticles();
  }, []);
  
  const fetchArticles = async () => {
    try {
      const response = await fetch('https://newsapi.org/v2/top-headlines?country=in&category=health&apiKey=9a0fdcaa0714470a9e619c41581ee2af');
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles);
      } else {
        console.error('Failed to fetch articles:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleArticleClick = (url) => {
    window.open(url, '_blank'); // Open the article link in a new tab
  };

  return (
    <div className="explore-container">
      <h1>Explore</h1>
      {articles.map((article, index) => (
        <div
          key={index}
          className="card"
          onClick={() => handleArticleClick(article.url)}
        >
          <div className="card-content">
            <h2>{article.title}</h2>
            <p>{article.description}</p>
          </div>
          {article.urlToImage && (
            <img src={article.urlToImage} alt="Article" className="article-image" />
          )}
        </div>
      ))}
    </div>
  );
}

export default Explore;