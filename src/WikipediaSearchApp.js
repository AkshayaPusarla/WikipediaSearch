import React, { useState, useEffect } from 'react';
import './style.css'; // Import the CSS file

const WikipediaSearchApp = () => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch the JSON data from the provided URL
  useEffect(() => {
    fetch('https://dpaste.com/79QXDY8TD.txt')
      .then(response => response.json())
      .then(data => {
        setCountryData(data); // Store the JSON data in the state
      })
      .catch(error => console.error('Error fetching country data:', error));
  }, []);

  // Handle input change and filter suggestions
  const handleInputChange = (e) => {
    const userInput = e.target.value.toLowerCase();
    setSearchInput(userInput);
    setHasSearched(false);

    if (userInput.trim() !== '') {
      const filteredSuggestions = countryData.filter(
        (country) =>
          country.country.toLowerCase().includes(userInput) ||
          country.capital.toLowerCase().includes(userInput)
      );
      setSuggestions(filteredSuggestions.slice(0, 5)); // Show top 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  // Handle search action (when pressing enter or selecting a suggestion)
  const handleSearch = () => {
    if (searchInput.trim() === '') return;

    setLoading(true);
    const filteredResults = countryData.filter(
      (country) =>
        country.country.toLowerCase().includes(searchInput) ||
        country.capital.toLowerCase().includes(searchInput)
    );

    setTimeout(() => {
      setSearchResults(filteredResults);
      setLoading(false);
      setHasSearched(true);
      setSuggestions([]); // Clear suggestions after search
    }, 500); // Simulate a short delay to show loading spinner
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion.country); // Set input to the selected suggestion
    handleSearch(); // Trigger search
  };

  // Handle keyup for enter key to trigger search
  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="wikipedia-search-app">
      <h1>Wikipedia Country Search</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
          placeholder="Search by country or capital..."
          className="search-input"
        />
        <div className="suggestions-container">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.country} - {suggestion.capital}
            </div>
          ))}
        </div>
      </div>

      {loading && <div id="spinner">Loading...</div>}

      <div id="searchResults">
        {hasSearched && searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <div key={index} className="result-item">
              <h3 className="result-title">{result.country}</h3>
              <p className="result-capital">Capital: {result.capital}</p>
              <p>Population: {result.population.toLocaleString()}</p>
              <p>Official Language: {Array.isArray(result.official_language) ? result.official_language.join(', ') : result.official_language}</p>
              <p>Currency: {result.currency}</p>
            </div>
          ))
        ) : (
          hasSearched && !loading && <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default WikipediaSearchApp;
