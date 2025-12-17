// js/timeline.js - Timeline data for ChronoMap
const timelineData = [
  {
    "year": 1800,
    "title": "Europe in 1800",
    "description": "After the French Revolutionary Wars, before Napoleon's major conquests",
    "continent": "europe",
    "countries": [
      {
        "name": "French Republic",
        "svg_id": "fr",
        "color": "#1f77b4",
        "capital": "Paris",
        "ruler": "Napoleon Bonaparte (First Consul)",
        "notes": "Revolutionary state, expanding under Napoleon's leadership",
        "area": "Approx. 550,000 km²",
        "population": "29 million"
      },
      {
        "name": "Austrian Empire",
        "svg_id": "at",
        "color": "#ff7f0e",
        "capital": "Vienna",
        "ruler": "Francis II",
        "notes": "Habsburg monarchy, leader of anti-French coalition",
        "area": "Approx. 698,700 km²",
        "population": "21 million"
      },
      {
        "name": "Kingdom of Prussia",
        "svg_id": "de",
        "color": "#2ca02c",
        "capital": "Berlin",
        "ruler": "Frederick William III",
        "notes": "Major German power, modernizing state",
        "area": "Approx. 300,000 km²",
        "population": "9.7 million"
      },
      {
        "name": "Russian Empire",
        "svg_id": "ru",
        "color": "#d62728",
        "capital": "Saint Petersburg",
        "ruler": "Paul I",
        "notes": "Largest country in the world, absolute monarchy",
        "area": "Approx. 16.8 million km²",
        "population": "40 million"
      },
      {
        "name": "Ottoman Empire",
        "svg_id": "tr",
        "color": "#9467bd",
        "capital": "Constantinople (Istanbul)",
        "ruler": "Selim III",
        "notes": "Declining empire, controlled Balkans",
        "area": "Approx. 2.4 million km²",
        "population": "25 million"
      },
      {
        "name": "United Kingdom",
        "svg_id": "gb",
        "color": "#8c564b",
        "capital": "London",
        "ruler": "George III",
        "notes": "Constitutional monarchy, naval superpower",
        "area": "Approx. 230,000 km²",
        "population": "16 million"
      },
      {
        "name": "Kingdom of Spain",
        "svg_id": "es",
        "color": "#e377c2",
        "capital": "Madrid",
        "ruler": "Charles IV",
        "notes": "Bourbon monarchy, colonial empire in decline",
        "area": "Approx. 510,000 km²",
        "population": "11.5 million"
      },
      {
        "name": "Kingdom of Portugal",
        "svg_id": "pt",
        "color": "#7f7f7f",
        "capital": "Lisbon",
        "ruler": "Maria I",
        "notes": "Braganza dynasty, British ally",
        "area": "Approx. 92,000 km²",
        "population": "3.1 million"
      },
      {
        "name": "Kingdom of Sweden",
        "svg_id": "se",
        "color": "#17becf",
        "capital": "Stockholm",
        "ruler": "Gustav IV Adolf",
        "notes": "Lost Finland to Russia in 1809",
        "area": "Approx. 450,000 km²",
        "population": "2.3 million"
      },
      {
        "name": "Denmark-Norway",
        "svg_id": "dk",
        "color": "#bcbd22",
        "capital": "Copenhagen",
        "ruler": "Christian VII",
        "notes": "Personal union of Denmark and Norway",
        "area": "Approx. 487,000 km²",
        "population": "1.9 million"
      }
    ]
  },
  {
    "year": 1815,
    "title": "Congress of Vienna",
    "description": "Post-Napoleonic settlement, restoration of monarchies",
    "continent": "europe",
    "countries": [
      {
        "name": "Kingdom of France",
        "svg_id": "fr",
        "color": "#1f77b4",
        "capital": "Paris",
        "ruler": "Louis XVIII",
        "notes": "Bourbon Restoration, constitutional monarchy"
      },
      {
        "name": "Austrian Empire",
        "svg_id": "at",
        "color": "#ff7f0e",
        "capital": "Vienna",
        "ruler": "Francis I",
        "notes": "Gained Lombardy-Venetia, dominant in Italy"
      }
    ]
  },
  {
    "year": 1789,
    "title": "French Revolution Begins",
    "description": "Start of the French Revolution, absolute monarchy ends",
    "continent": "europe",
    "countries": [
      {
        "name": "Kingdom of France",
        "svg_id": "fr",
        "color": "#aec7e8",
        "capital": "Versailles/Paris",
        "ruler": "Louis XVI",
        "notes": "Absolute monarchy, pre-revolution"
      }
    ]
  }
];

// Make data globally available
window.timelineData = timelineData;

// Helper functions
window.getYearData = function(year) {
  return timelineData.find(item => item.year === year) || null;
};

window.getCountryData = function(year, countryCode) {
  const yearData = getYearData(year);
  if (!yearData) return null;
  
  return yearData.countries.find(country => country.svg_id === countryCode) || null;
};

console.log("Timeline data loaded: " + timelineData.length + " periods available");
console.log("Years available: " + timelineData.map(d => d.year).join(", "));
