// ============================================
// SVGMapLoader.js - Fixed Version
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
      },
      {
        "name": "Kingdom of Sweden",
        "svg_id": "se",
        "color": "#17becf",
        "capital": "Stockholm",
        "ruler": "Gustav IV Adolf",
        "notes": "Soon to lose Finland to Russia",
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

class SVGMapLoader {
  constructor() {
    this.currentYear = 1800;
    this.countryData = null;
    this.isLoading = false;
    this.debugMode = true; // Set to false in production
  }

  log(message, data = null) {
    if (this.debugMode) {
      if (data) {
        console.log(`[ChronoMap] ${message}`, data);
      } else {
        console.log(`[ChronoMap] ${message}`);
      }
    }
  }

  error(message, error = null) {
    console.error(`[ChronoMap ERROR] ${message}`, error || '');
    this.showError(message);
  }

  async initialize() {
    this.log("Initializing ChronoMap...");
    
    try {
      this.showLoading(true);
      
      // Step 1: Load the SVG map
      await this.loadWorldMap();
      
      // Step 2: Load timeline data
      await this.loadTimelineData();
      
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
      './maps/world.svg',
      '/maps/world.svg'
    ];
    
    let svgLoaded = false;
    
    for (const path of paths) {
      try {
        this.log(`Trying to load SVG from: ${path}`);
        const response = await fetch(path);
        
        if (!response.ok) {
          this.log(`Path ${path} failed: ${response.status}`);
          continue;
        }
        
        const svgText = await response.text();
        
        // Basic validation
        if (!svgText.includes('<svg') || !svgText.includes('</svg>')) {
          this.log(`Path ${path} returned invalid SVG`);
          continue;
        }
        
        container.innerHTML = svgText;
        this.log(`SVG loaded successfully from: ${path}`);
        svgLoaded = true;
        
        // Reset all countries to light gray
        const allPaths = container.querySelectorAll('path, g');
        allPaths.forEach(el => {
          el.style.fill = '#f0f0f0';
          el.style.stroke = '#999';
          el.style.strokeWidth = '0.5px';
          el.style.cursor = 'default';
          el.style.transition = 'all 0.3s ease';
        });
        
        break;
        
      } catch (error) {
        this.log(`Error loading from ${path}:`, error.message);
      }
    }
    
    if (!svgLoaded) {
      // Create a fallback map
      this.createFallbackMap();
      this.log("Using fallback map");
    }
  }

  createFallbackMap() {
    const container = document.getElementById('map-container');
    container.innerHTML = `
      <svg width="100%" height="500" viewBox="0 0 800 500">
        <rect width="800" height="500" fill="#e8f4f8"/>
        
        <!-- Simplified Europe -->
        <path id="fr" d="M150,250 L250,200 L300,300 L200,320 Z" fill="#1f77b4" stroke="#000" class="country"/>
        <path id="de" d="M250,200 L400,180 L450,280 L300,300 Z" fill="#2ca02c" stroke="#000" class="country"/>
        <path id="es" d="M100,300 L150,350 L200,400 L80,380 Z" fill="#e377c2" stroke="#000" class="country"/>
        <path id="it" d="M300,300 L350,350 L380,400 L320,380 Z" fill="#d62728" stroke="#000" class="country"/>
        <path id="gb" d="M200,100 L250,80 L280,150 L230,160 Z" fill="#8c564b" stroke="#000" class="country"/>
        
        <!-- Labels -->
        <text x="200" y="280" font-size="12" fill="white" text-anchor="middle">France</text>
        <text x="325" y="240" font-size="12" fill="white" text-anchor="middle">Germany</text>
        <text x="140" y="370" font-size="12" fill="white" text-anchor="middle">Spain</text>
        <text x="340" y="340" font-size="12" fill="white" text-anchor="middle">Italy</text>
        <text x="240" y="120" font-size="12" fill="white" text-anchor="middle">UK</text>
        
        <text x="400" y="480" font-size="14" fill="#666" text-anchor="middle">
          Simplified European Map - Replace with maps/world.svg
        </text>
      </svg>
    `;
  }

  async loadTimelineData() {
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
    
    // Find data for this year
    const yearData = timelineData.find(item => item.year === year);
    if (!yearData) {
      this.log(`No data found for year ${year}`);
      return;
    }
    
    this.currentYear = year;
    this.countryData = yearData;
    
    // Update UI elements
    document.getElementById('current-year').textContent = year;
    document.getElementById('era-title').textContent = yearData.title;
    document.getElementById('era-description').textContent = yearData.description;
    document.getElementById('map-year').textContent = year;
    
    // Reset all to gray first
    const allCountries = document.querySelectorAll('.country, path, g[id]');
    allCountries.forEach(el => {
      if (el.id && el.id.length === 2) { // Only reset country elements
        el.style.fill = '#f0f0f0';
        el.style.stroke = '#999';
        el.style.strokeWidth = '0.5px';
      }
    });
    
    // Apply colors to countries in the data
    let coloredCount = 0;
    yearData.countries.forEach(country => {
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
        element.dataset.area = country.area || '';
        element.dataset.population = country.population || '';
        element.dataset.status = country.status || '';
        
        coloredCount++;
        this.log(`Styled ${country.name} (${country.svg_id})`, { color: country.color });
      } else {
        this.log(`Country element not found: ${country.svg_id} (${country.name})`);
      }
    });
    
    this.log(`Colored ${coloredCount} countries for year ${year}`);
    
    // Update country list
    this.updateCountryList();
  }

  updateCountryList() {
    const container = document.getElementById('country-list');
    if (!container) {
      this.log("Country list container not found");
      return;
    }
    
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
              ${country.notes ? `<p class="notes">${country.notes}</p>` : ''}
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
      if (target.dataset.countryName) {
        this.highlightCountry(target);
      }
    });
    
    // Mouseout effect
    container.addEventListener('mouseout', (e) => {
      const target = e.target;
      if (target.dataset.countryName) {
        this.unhighlightCountry(target);
      }
    });
    
    // Click for details
    container.addEventListener('click', (e) => {
      const target = e.target;
      if (target.dataset.countryName) {
        this.showCountryDetails(target.id);
      }
    });
    
    // Make mapLoader globally available for HTML onclick events
    window.mapLoader = this;
    
    this.log("Interactions setup complete");
  }

  highlightCountry(element) {
    const originalColor = element.style.fill;
    
    // Store original for restoration
    if (!element.dataset.originalColor) {
      element.dataset.originalColor = originalColor;
    }
    
    // Apply highlight
    element.style.filter = 'brightness(1.2) drop-shadow(0 0 5px rgba(0,0,0,0.3))';
    element.style.strokeWidth = '2px';
    element.style.stroke = '#000';
    
    // Show tooltip
    this.showTooltip(
      element.dataset.countryName,
      element.dataset.ruler,
      element.dataset.capital,
      element
    );
  }

  unhighlightCountry(element) {
    // Restore original style
    element.style.filter = 'none';
    element.style.strokeWidth = '1px';
    element.style.stroke = '#333';
    
    // Hide tooltip
    this.hideTooltip();
  }

  showTooltip(countryName, ruler, capital, element) {
    let tooltip = document.getElementById('country-tooltip');
    
    // Create tooltip if it doesn't exist
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'country-tooltip';
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        pointer-events: none;
        z-index: 1000;
        display: none;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(5px);
      `;
      document.body.appendChild(tooltip);
    }
    
    // Position tooltip near cursor
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - 10) + 'px';
    tooltip.style.transform = 'translate(-50%, -100%)';
    
    // Set content
    tooltip.innerHTML = `
      <div style="font-size: 16px; font-weight: bold; color: #ffd700; margin-bottom: 5px;">
        ${countryName}
      </div>
      <div style="margin-bottom: 3px;"><strong>Ruler:</strong> ${ruler}</div>
      <div><strong>Capital:</strong> ${capital}</div>
      <div style="margin-top: 5px; font-size: 12px; opacity: 0.8;">
        Click for details
      </div>
    `;
    
    tooltip.style.display = 'block';
  }

  hideTooltip() {
    const tooltip = document.getElementById('country-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  showCountryDetails(countryId) {
    this.log(`Showing details for country: ${countryId}`);
    
    // Find the country element
    const element = document.getElementById(countryId);
    if (!element) {
      this.error(`Country element not found: ${countryId}`);
      return;
    }
    
    // Find country data
    const countryData = this.countryData.countries.find(c => c.svg_id === countryId);
    if (!countryData) {
      this.error(`Country data not found for: ${countryId}`);
      return;
    }
    
    // Get or create details panel
    let detailsPanel = document.getElementById('country-details');
    if (!detailsPanel) {
      detailsPanel = document.createElement('div');
      detailsPanel.id = 'country-details';
      detailsPanel.style.cssText = `
        display: none;
        margin-top: 25px;
        background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
        border-radius: 10px;
        padding: 25px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        border: 1px solid rgba(255, 215, 0, 0.3);
      `;
      
      const infoSection = document.querySelector('.info-section');
      if (infoSection) {
        infoSection.appendChild(detailsPanel);
      } else {
        document.querySelector('.main-content').appendChild(detailsPanel);
      }
    }
    
    // Populate details
    detailsPanel.innerHTML = `
      <div class="details-header">
        <h2 style="color: ${countryData.color}; margin: 0;">${countryData.name}</h2>
        <span style="background: linear-gradient(45deg, #283593, #5c6bc0); 
                     color: white; padding: 8px 20px; border-radius: 20px; 
                     font-weight: 600;">${this.currentYear}</span>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
        <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
          <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">Ruler</div>
          <div style="font-size: 1.1rem; color: #283593; font-weight: 600;">${countryData.ruler}</div>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
          <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">Capital</div>
          <div style="font-size: 1.1rem; color: #283593; font-weight: 600;">${countryData.capital}</div>
        </div>
        ${countryData.area ? `
        <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
          <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">Area</div>
          <div style="font-size: 1.1rem; color: #283593; font-weight: 600;">${countryData.area}</div>
        </div>` : ''}
        ${countryData.population ? `
        <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
          <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">Population</div>
          <div style="font-size: 1.1rem; color: #283593; font-weight: 600;">${countryData.population}</div>
        </div>` : ''}
      </div>
      
      ${countryData.notes ? `
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
        <h3 style="color: #283593; margin-bottom: 10px;">Historical Context</h3>
        <p style="line-height: 1.6; color: #444;">${countryData.notes}</p>
      </div>` : ''}
      
      <div style="margin-top: 20px; text-align: center;">
        <button onclick="document.getElementById('country-details').style.display='none'" 
                style="padding: 10px 25px; background: #283593; color: white; 
                       border: none; border-radius: 5px; cursor: pointer;">
          Close Details
        </button>
      </div>
    `;
    
    detailsPanel.style.display = 'block';
  }

  updateUI() {
    // Update year slider
    const yearSlider = document.getElementById('year-slider');
    if (yearSlider) {
      yearSlider.value = this.currentYear;
    }
    
    // Update slider label
    const currentLabel = document.querySelector('.slider-current');
    if (currentLabel) {
      currentLabel.textContent = this.currentYear === 1800 ? 
        '1800 (Starting Point)' : this.currentYear.toString();
    }
  }

  showLoading(show) {
    this.isLoading = show;
    
    const loadingEl = document.querySelector('.loading');
    const mapContainer = document.getElementById('map-container');
    
    if (loadingEl) {
      loadingEl.style.display = show ? 'flex' : 'none';
    }
    
    if (mapContainer && show) {
      // Show loading overlay
      mapContainer.style.opacity = '0.5';
      mapContainer.style.pointerEvents = 'none';
    } else if (mapContainer) {
      mapContainer.style.opacity = '1';
      mapContainer.style.pointerEvents = 'auto';
    }
  }

  showError(message) {
    const container = document.getElementById('map-container');
    if (container) {
      container.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #d32f2f;">
          <h3 style="margin-bottom: 15px;">⚠️ Error Loading Map</h3>
          <p style="margin-bottom: 20px;">${message}</p>
          <button onclick="location.reload()" 
                  style="padding: 10px 20px; background: #283593; 
                         color: white; border: none; border-radius: 5px; 
                         cursor: pointer;">
            Reload Page
          </button>
        </div>
      `;
    }
  }

  // Public methods for UI controls
  jumpToYear(year) {
    if (year < 1400 || year > 2025) {
      this.error(`Invalid year: ${year}. Must be between 1400 and 2025.`);
      return;
    }
    
    this.log(`Jumping to year ${year}`);
    this.applyYearStyling(year);
  }

  nextDecade() {
    const nextYear = this.currentYear + 10;
    if (nextYear <= 2025) {
      this.jumpToYear(nextYear);
    }
  }

  prevDecade() {
    const prevYear = this.currentYear - 10;
    if (prevYear >= 1400) {
      this.jumpToYear(prevYear);
    }
  }
}

// Make globally available
window.SVGMapLoader = SVGMapLoader;
console.log("SVGMapLoader loaded. Use: const loader = new SVGMapLoader(); loader.initialize();");
