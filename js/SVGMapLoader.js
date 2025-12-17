// ============================================
// SVGMapLoader.js - FINAL FIXED VERSION
// ChronoMap - Historical Map Visualization
// ============================================

// Timeline data embedded directly (no external JSON needed)
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
      }
    ]
  }
];

class SVGMapLoader {
  constructor() {
    this.currentYear = 1800;
    this.countryData = null;
    this.isLoading = false;
    this.debugMode = true;
  }

  log(message, data = null) {
    if (this.debugMode) {
      console.log(`[ChronoMap] ${message}`, data || '');
    }
  }

  error(message, error = null) {
    console.error(`[ChronoMap ERROR] ${message}`, error || '');
  }

  async initialize() {
    this.log("Initializing ChronoMap...");
    
    try {
      this.showLoading(true);
      
      // Step 1: Load the SVG map
      await this.loadWorldMap();
      
      // Step 2: Load timeline data (FIXED - no async/await needed)
      this.loadTimelineData();
      
      // Step 3: Apply 1800 styling
      this.applyYearStyling(1800);
      
      // Step 4: Setup interactions
      this.setupInteractions();
      
      // Step 5: Update UI
      this.updateUI();
      
      this.log("ChronoMap initialized successfully");
      
    } catch (error) {
      this.error("Failed to initialize ChronoMap", error);
    } finally {
      this.showLoading(false);
    }
  }

  async loadWorldMap() {
    this.log("Loading world map...");
    
    const container = document.getElementById('map-container');
    if (!container) {
      throw new Error("Map container not found");
    }
    
    // Try multiple possible paths
    const paths = [
      'maps/world.svg',
      './maps/world.svg'
    ];
    
    for (const path of paths) {
      try {
        this.log(`Trying to load SVG from: ${path}`);
        const response = await fetch(path);
        
        if (response.ok) {
          const svgText = await response.text();
          container.innerHTML = svgText;
          this.log(`SVG loaded successfully from: ${path}`);
          
          // Reset all countries to light gray
          const allPaths = container.querySelectorAll('path');
          allPaths.forEach(el => {
            el.style.fill = '#f0f0f0';
            el.style.stroke = '#999';
            el.style.strokeWidth = '0.5px';
            el.style.cursor = 'default';
            el.style.transition = 'all 0.3s ease';
          });
          
          return; // Success, exit function
        }
      } catch (error) {
        this.log(`Error loading from ${path}:`, error.message);
      }
    }
    
    // If we get here, all paths failed
    this.createFallbackMap();
  }

  createFallbackMap() {
    const container = document.getElementById('map-container');
    container.innerHTML = `
      <svg width="100%" height="500" viewBox="0 0 800 500">
        <rect width="800" height="500" fill="#e8f4f8"/>
        
        <!-- Simplified Europe -->
        <path id="fr" d="M150,250 L250,200 L300,300 L200,320 Z" fill="#1f77b4" stroke="#000"/>
        <path id="de" d="M250,200 L400,180 L450,280 L300,300 Z" fill="#2ca02c" stroke="#000"/>
        <path id="es" d="M100,300 L150,350 L200,400 L80,380 Z" fill="#e377c2" stroke="#000"/>
        <path id="it" d="M300,300 L350,350 L380,400 L320,380 Z" fill="#d62728" stroke="#000"/>
        <path id="gb" d="M200,100 L250,80 L280,150 L230,160 Z" fill="#8c564b" stroke="#000"/>
        
        <!-- Labels -->
        <text x="200" y="280" font-size="12" fill="white" text-anchor="middle">France</text>
        <text x="325" y="240" font-size="12" fill="white" text-anchor="middle">Germany</text>
        <text x="140" y="370" font-size="12" fill="white" text-anchor="middle">Spain</text>
        <text x="340" y="340" font-size="12" fill="white" text-anchor="middle">Italy</text>
        <text x="240" y="120" font-size="12" fill="white" text-anchor="middle">UK</text>
      </svg>
    `;
    this.log("Using fallback map");
  }

  // FIXED: Removed async - data is already available
  loadTimelineData() {
    this.log("Loading timeline data...");
    
    // Use the embedded timelineData
    if (!timelineData || timelineData.length === 0) {
      this.error("No timeline data available");
      this.countryData = {
        year: 1800,
        title: "Europe in 1800",
        description: "Historical borders",
        countries: []
      };
      return;
    }
    
    // Find 1800 data
    this.countryData = timelineData.find(item => item.year === 1800);
    
    if (!this.countryData) {
      this.log("No 1800 data found, using first available year");
      this.countryData = timelineData[0];
      this.currentYear = this.countryData.year;
    }
    
    this.log(`Loaded data for year ${this.countryData.year}`, {
      title: this.countryData.title,
      countries: this.countryData.countries.length
    });
  }

  applyYearStyling(year) {
    this.log(`Applying styling for year ${year}`);
    
    // Update UI elements
    document.getElementById('current-year').textContent = year;
    document.getElementById('era-title').textContent = this.countryData.title;
    document.getElementById('era-description').textContent = this.countryData.description;
    document.getElementById('map-year').textContent = year;
    
    // Reset all to gray first
    const allCountries = document.querySelectorAll('path');
    allCountries.forEach(el => {
      el.style.fill = '#f0f0f0';
      el.style.stroke = '#999';
      el.style.strokeWidth = '0.5px';
    });
    
    // Apply colors to countries in the data
    let coloredCount = 0;
    this.countryData.countries.forEach(country => {
      const element = document.getElementById(country.svg_id);
      if (element) {
        element.style.fill = country.color;
        element.style.stroke = '#333';
        element.style.strokeWidth = '1px';
        element.style.cursor = 'pointer';
        
        // Store data attributes
        element.dataset.countryName = country.name;
        element.dataset.capital = country.capital;
        element.dataset.ruler = country.ruler;
        element.dataset.year = year;
        element.dataset.notes = country.notes || '';
        
        coloredCount++;
      }
    });
    
    this.log(`Colored ${coloredCount} countries for year ${year}`);
    
    // Update country list
    this.updateCountryList();
  }

  updateCountryList() {
    const container = document.getElementById('country-list');
    if (!container) return;
    
    const europeanCountries = this.countryData.countries;
    
    container.innerHTML = `
      <div class="country-grid">
        ${europeanCountries.map(country => `
          <div class="country-card" 
               style="border-color: ${country.color}"
               onclick="window.mapLoader.showCountryDetails('${country.svg_id}')">
            <div class="country-color" style="background: ${country.color}"></div>
            <div class="country-info">
              <h4>${country.name}</h4>
              <p><strong>Ruler:</strong> ${country.ruler}</p>
              <p><strong>Capital:</strong> ${country.capital}</p>
              ${country.area ? `<p><strong>Area:</strong> ${country.area}</p>` : ''}
              ${country.population ? `<p><strong>Population:</strong> ${country.population}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  setupInteractions() {
    this.log("Setting up interactions...");
    
    const container = document.getElementById('map-container');
    if (!container) return;
    
    // Mouseover effect
    container.addEventListener('mouseover', (e) => {
      const target = e.target;
      if (target.tagName === 'PATH' && target.dataset.countryName) {
        this.highlightCountry(target);
      }
    });
    
    // Mouseout effect
    container.addEventListener('mouseout', (e) => {
      const target = e.target;
      if (target.tagName === 'PATH' && target.dataset.countryName) {
        this.unhighlightCountry(target);
      }
    });
    
    // Click for details
    container.addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'PATH' && target.dataset.countryName) {
        this.showCountryDetails(target.id);
      }
    });
    
    // Make mapLoader globally available
    window.mapLoader = this;
  }

  highlightCountry(element) {
    element.style.filter = 'brightness(1.2)';
    element.style.strokeWidth = '2px';
    
    // Show simple tooltip
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
      pointer-events: none;
    `;
    tooltip.innerHTML = `<strong>${element.dataset.countryName}</strong><br>${element.dataset.ruler}`;
    tooltip.id = 'temp-tooltip';
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width/2) + 'px';
    tooltip.style.top = (rect.top - 40) + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    
    // Store reference to remove later
    element._tooltip = tooltip;
  }

  unhighlightCountry(element) {
    element.style.filter = 'none';
    element.style.strokeWidth = '1px';
    
    // Remove tooltip
    if (element._tooltip) {
      element._tooltip.remove();
      delete element._tooltip;
    }
  }

  showCountryDetails(countryId) {
    const element = document.getElementById(countryId);
    if (!element) return;
    
    const countryData = this.countryData.countries.find(c => c.svg_id === countryId);
    if (!countryData) return;
    
    let detailsPanel = document.getElementById('country-details');
    if (!detailsPanel) {
      detailsPanel = document.createElement('div');
      detailsPanel.id = 'country-details';
      document.querySelector('.info-section').appendChild(detailsPanel);
    }
    
    detailsPanel.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-left: 5px solid ${countryData.color}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; color: ${countryData.color}">${countryData.name}</h3>
          <span style="background: #283593; color: white; padding: 5px 15px; border-radius: 15px;">${this.currentYear}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px;">
          <div>
            <strong>Ruler:</strong><br>${countryData.ruler}
          </div>
          <div>
            <strong>Capital:</strong><br>${countryData.capital}
          </div>
          ${countryData.area ? `<div><strong>Area:</strong><br>${countryData.area}</div>` : ''}
          ${countryData.population ? `<div><strong>Population:</strong><br>${countryData.population}</div>` : ''}
        </div>
        ${countryData.notes ? `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;"><strong>Historical Context:</strong><br>${countryData.notes}</div>` : ''}
        <button onclick="document.getElementById('country-details').innerHTML=''" 
                style="margin-top: 15px; padding: 8px 20px; background: #283593; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Close
        </button>
      </div>
    `;
  }

  updateUI() {
    const yearSlider = document.getElementById('year-slider');
    if (yearSlider) {
      yearSlider.value = this.currentYear;
    }
  }

  showLoading(show) {
    const loadingEl = document.querySelector('.loading');
    if (loadingEl) {
      loadingEl.style.display = show ? 'flex' : 'none';
    }
  }

  // Public methods for UI controls
  jumpToYear(year) {
    this.log(`Jumping to year ${year}`);
    this.applyYearStyling(year);
  }

  nextDecade() {
    const nextYear = this.currentYear + 10;
    this.jumpToYear(nextYear);
  }

  prevDecade() {
    const prevYear = this.currentYear - 10;
    this.jumpToYear(prevYear);
  }
}

// Make globally available
window.SVGMapLoader = SVGMapLoader;
console.log("SVGMapLoader loaded successfully!");
