// js/timeline.js - UPDATED with correct country IDs
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
        "area": "550,000 km²",
        "population": "29 million",
        "status": "Revolutionary Republic"
      },
      {
        "name": "Austrian Empire",
        "svg_id": "at",
        "color": "#ff7f0e",
        "capital": "Vienna",
        "ruler": "Francis II",
        "notes": "Habsburg monarchy, leader of anti-French coalition",
        "area": "698,700 km²",
        "population": "21 million",
        "status": "Empire"
      },
      {
        "name": "Kingdom of Prussia",
        "svg_id": "de",
        "color": "#2ca02c",
        "capital": "Berlin",
        "ruler": "Frederick William III",
        "notes": "Major German power, modernizing state",
        "area": "300,000 km²",
        "population": "9.7 million",
        "status": "Kingdom"
      },
      {
        "name": "Russian Empire",
        "svg_id": "ru",
        "color": "#d62728",
        "capital": "Saint Petersburg",
        "ruler": "Paul I",
        "notes": "Largest country in the world, absolute monarchy",
        "area": "16.8 million km²",
        "population": "40 million",
        "status": "Empire"
      },
      {
        "name": "Ottoman Empire",
        "svg_id": "tr",
        "color": "#9467bd",
        "capital": "Constantinople",
        "ruler": "Selim III",
        "notes": "Declining empire, controlled Balkans",
        "area": "2.4 million km²",
        "population": "25 million",
        "status": "Empire"
      },
      {
        "name": "United Kingdom",
        "svg_id": "gb",
        "color": "#8c564b",
        "capital": "London",
        "ruler": "George III",
        "notes": "Constitutional monarchy, naval superpower",
        "area": "230,000 km²",
        "population": "16 million",
        "status": "Kingdom"
      },
      {
        "name": "Kingdom of Spain",
        "svg_id": "es",
        "color": "#e377c2",
        "capital": "Madrid",
        "ruler": "Charles IV",
        "notes": "Bourbon monarchy, colonial empire in decline",
        "area": "510,000 km²",
        "population": "11.5 million",
        "status": "Kingdom"
      },
      {
        "name": "Kingdom of Portugal",
        "svg_id": "pt",
        "color": "#7f7f7f",
        "capital": "Lisbon",
        "ruler": "Maria I",
        "notes": "Braganza dynasty, British ally",
        "area": "92,000 km²",
        "population": "3.1 million",
        "status": "Kingdom"
      },
      {
        "name": "Kingdom of Sweden",
        "svg_id": "se",
        "color": "#17becf",
        "capital": "Stockholm",
        "ruler": "Gustav IV Adolf",
        "notes": "Will lose Finland to Russia in 1809",
        "area": "450,000 km²",
        "population": "2.3 million",
        "status": "Kingdom"
      },
      {
        "name": "Denmark-Norway",
        "svg_id": "dk",
        "color": "#bcbd22",
        "capital": "Copenhagen",
        "ruler": "Christian VII",
        "notes": "Personal union of Denmark and Norway",
        "area": "487,000 km²",
        "population": "1.9 million",
        "status": "Dual Monarchy"
      },
      {
        "name": "Italian States",
        "svg_id": "it",
        "color": "#ff9896",
        "capital": "Various",
        "ruler": "Multiple rulers",
        "notes": "Collection of small states and kingdoms",
        "area": "Varies",
        "population": "18 million",
        "status": "Various"
      }
    ]
  },
  {
    "year": 1815,
    "title": "Congress of Vienna",
    "description": "Post-Napoleonic European settlement",
    "countries": [
      {
        "name": "Kingdom of France",
        "svg_id": "fr",
        "color": "#aec7e8",
        "capital": "Paris",
        "ruler": "Louis XVIII",
        "notes": "Bourbon Restoration"
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

console.log("✅ timeline.js loaded: " + timelineData.length + " periods available");
console.log("📅 Years available: " + timelineData.map(d => d.year).join(", "));
