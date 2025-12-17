// ============================================
// SVGMapLoader.js - Uses YOUR world.svg file
// ChronoMap - Historical Map Visualization
// ============================================

// Timeline data embedded directly
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
        "population": "29 million"
      },
      {
        "name": "Austrian Empire",
        "svg_id": "at",
        "color": "#ff7f0e",
        "capital": "Vienna",
        "ruler": "Francis II",
        "notes": "Habsburg monarchy, leader of anti-French coalition",
        "area": "698,700 km²",
        "population": "21 million"
      },
      {
        "name": "Kingdom of Prussia",
        "svg_id": "de",
        "color": "#2ca02c",
        "capital": "Berlin",
        "ruler": "Frederick William III",
        "notes": "Major German power, modernizing state",
        "area": "300,000 km²",
        "population": "9.7 million"
      },
      {
        "name": "Russian Empire",
        "svg_id": "ru",
        "color": "#d62728",
        "capital": "Saint Petersburg",
        "ruler": "Paul I",
        "notes": "Largest country in the world, absolute monarchy",
        "area": "16.8 million km²",
        "population": "40 million"
      },
      {
        "name": "Ottoman Empire",
        "svg_id": "tr",
        "color": "#9467bd",
        "capital": "Constantinople",
        "ruler": "Selim III",
        "notes": "Declining empire, controlled Balkans",
        "area": "2.4 million km²",
        "population": "25 million"
      },
      {
        "name": "United Kingdom",
        "svg_id": "gb",
        "color": "#8c564b",
        "capital": "London",
        "ruler": "George III",
        "notes": "Constitutional monarchy, naval superpower",
        "area": "230,000 km²",
        "population": "16 million"
      },
      {
        "name": "Kingdom of Spain",
        "svg_id": "es",
        "color": "#e377c2",
        "capital": "Madrid",
        "ruler": "Charles IV",
        "notes": "Bourbon monarchy, colonial empire in decline",
        "area": "510,000 km²",
        "population": "11.5 million"
      },
      {
        "name": "Kingdom of Portugal",
        "svg_id": "pt",
        "color": "#7f7f7f",
        "capital": "Lisbon",
        "ruler": "Maria I",
        "notes": "Braganza dynasty, British ally",
        "area": "92,000 km²",
        "population": "3.1 million"
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
      
      // Step 1: Load YOUR SVG map
      const mapLoaded = await this.loadWorldMap();
      
      if (!mapLoaded) {
        throw new Error("Failed to load world map");
      }
      
      // Step 2: Load timeline data
      this.loadTimelineData();
      
      // Step 3: Apply 1800 styling to YOUR SVG
      this.applyYearStyling(1800);
      
      // Step 4: Setup interactions
      this.setupInteractions();
      
      // Step 5: Update UI
      this.updateUI();
      
      this.log("ChronoMap initialized successfully with YOUR SVG!");
      
    } catch (error) {
      this.error("Failed to initialize ChronoMap", error);
    } finally {
      this.showLoading(false);
    }
  }

  async loadWorldMap() {
    this.log("Loading YOUR world-map.svg file...");
    
    const container = document.getElementById('map-container');
    if (!container) {
      this.error("Map container element not found");
      return false;
    }
    
    try {
      // Clear container first
      container.innerHTML = '';
      
      // Load YOUR world.svg file
      const response = await fetch('maps/world-map.svg');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const svgText = await response.text();
      
      // Validate it's actually an SVG
      if (!svgText.includes('<svg') || !svgText.includes('</svg>')) {
        throw new Error("File doesn't appear to be valid SVG");
      }
      
      this.log(`SVG loaded successfully. Size: ${svgText.length} bytes`);
      
      // Insert YOUR SVG
      container.innerHTML = svgText;
      
      // Find all country paths/groups in YOUR SVG
      const svgElement = container.querySelector('svg');
      if (!svgElement) {
        throw new Error("No SVG element found in loaded file");
      }
      
      // Make the SVG responsive
      svgElement.style.width = '100%';
      svgElement.style.height = '100%';
      
      // Prepare all countries for styling
      this.prepareCountries();
      
      return true;
      
    } catch (error) {
      this.error("Failed to load world.svg", error);
      this.createFallbackMap(); // Only as last resort
      return false;
    }
  }

  prepareCountries() {
    const container = document.getElementById('map-container');
    
    // Reset all country elements to light gray
    // Try different selectors to find countries in YOUR SVG
    const selectors = ['path', 'g', 'path[id]', 'g[id]', '[id]'];
    
    for (const selector of selectors) {
      const elements = container.querySelectorAll(selector);
      
      if (elements.length > 0) {
        this.log(`Found ${elements.length} elements with selector: ${selector}`);
        
        elements.forEach(el => {
          // Only style elements that look like countries (have IDs)
          if (el.id && el.id.length === 2) { // Country codes are usually 2 letters
            el.style.fill = '#f0f0f0';
            el.style.stroke = '#999';
            el.style.strokeWidth = '0.5px';
            el.style.cursor = 'default';
            el.style.transition = 'all 0.3s ease';
            
            this.log(`Prepared country element: ${el.id}`);
          }
        });
        
        break; // Found elements, stop trying other selectors
      }
    }
  }

  createFallbackMap() {
    this.log("Creating fallback map (shouldn't happen if world.svg exists)");
    
    const container = document.getElementById('map-container');
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #666;">
        <h3>⚠️ Map Loading Issue</h3>
        <p>Unable to load maps/world.svg</p>
        <p>Make sure the file exists at: <code>maps/world.svg</code></p>
        <div style="margin-top: 20px; font-size: 14px;">
          <p>Expected file structure:</p>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; text-align: left;">
ChronoMap/
├── maps/
│   └── world.svg     &lt;-- YOUR SVG FILE SHOULD BE HERE
├── js/
│   └── SVGMapLoader.js
└── index.html</pre>
        </div>
      </div>
    `;
  }

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
    this.log(`Applying 1800 styling to YOUR SVG map`);
    
    if (!this.countryData) {
      this.error("No country data available for styling");
      return;
    }
    
    // Update UI elements
    document.getElementById('current-year').textContent = year;
    document.getElementById('era-title').textContent = this.countryData.title;
    document.getElementById('era-description').textContent = this.countryData.description;
    document.getElementById('map-year').textContent = year;
    
    // Color the countries on YOUR SVG
    let coloredCount = 0;
    let notFoundCount = 0;
    
    this.countryData.countries.forEach(country => {
      const element = document.getElementById(country.svg_id);
      
      if (element) {
        // Apply color and styling
        element.style.fill = country.color;
        element.style.stroke = '#333';
        element.style.strokeWidth = '1px';
        element.style.cursor = 'pointer';
        
        // Store data for interactions
        element.dataset.countryName = country.name;
        element.dataset.capital = country.capital;
        element.dataset.ruler = country.ruler;
        element.dataset.year = year;
        element.dataset.notes = country.notes || '';
        element.dataset.area = country.area || '';
        element.dataset.population = country.population || '';
        
        coloredCount++;
        this.log(`✅ Colored ${country.name} (${country.svg_id}) with ${country.color}`);
      } else {
        notFoundCount++;
        this.log(`❌ Country element not found: ${country.svg_id} (${country.name})`);
      }
    });
    
    this.log(`Styling complete: ${coloredCount} countries colored, ${notFoundCount} not found`);
    
    // Update country list panel
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
    this.log("Setting up interactions for YOUR SVG...");
    
    const container = document.getElementById('map-container');
    if (!container) {
      this.error("Map container not found for interactions");
      return;
    }
    
    // Mouseover - highlight country
    container.addEventListener('mouseover', (e) => {
      const target = e.target;
      if (target.dataset && target.dataset.countryName) {
        this.highlightCountry(target);
      }
    });
    
    // Mouseout - remove highlight
    container.addEventListener('mouseout', (e) => {
      const target = e.target;
      if (target.dataset && target.dataset.countryName) {
        this.unhighlightCountry(target);
      }
    });
    
    // Click - show details
    container.addEventListener('click', (e) => {
      const target = e.target;
      if (target.dataset && target.dataset.countryName) {
        this.showCountryDetails(target.id);
      }
    });
    
    // Make mapLoader globally available
    window.mapLoader = this;
    
    this.log("Interactions setup complete");
  }

  highlightCountry(element) {
    // Store original state
    if (!element.dataset.originalFill) {
      element.dataset.originalFill = element.style.fill;
    }
    
    // Apply highlight effect
    element.style.filter = 'brightness(1.15) drop-shadow(0 0 4px rgba(0,0,0,0.2))';
    element.style.strokeWidth = '2px';
    element.style.stroke = '#000';
    element.style.zIndex = '1000';
    
    // Show tooltip
    this.showTooltip(element);
  }

  unhighlightCountry(element) {
    // Remove highlight effect
    element.style.filter = 'none';
    element.style.strokeWidth = '1px';
    element.style.stroke = '#333';
    element.style.zIndex = '';
    
    // Hide tooltip
    this.hideTooltip();
  }

  showTooltip(element) {
    // Remove any existing tooltip
    this.hideTooltip();
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'chronomap-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      pointer-events: none;
      z-index: 10000;
      max-width: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(5px);
    `;
    
    tooltip.innerHTML = `
      <div style="font-weight: bold; color: #ffd700; margin-bottom: 4px;">
        ${element.dataset.countryName}
      </div>
      <div style="margin-bottom: 2px;"><strong>Ruler:</strong> ${element.dataset.ruler}</div>
      <div><strong>Capital:</strong> ${element.dataset.capital}</div>
      <div style="margin-top: 6px; font-size: 11px; opacity: 0.8;">
        Click for more details
      </div>
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip near cursor
    const updatePosition = (e) => {
      tooltip.style.left = (e.clientX + 15) + 'px';
      tooltip.style.top = (e.clientY - tooltip.offsetHeight - 10) + 'px';
    };
    
    document.addEventListener('mousemove', updatePosition);
    element._tooltipHandler = updatePosition;
  }

  hideTooltip() {
    const tooltip = document.getElementById('chronomap-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
    
    // Remove event listener
    if (this._tooltipHandler) {
      document.removeEventListener('mousemove', this._tooltipHandler);
      delete this._tooltipHandler;
    }
  }

  showCountryDetails(countryId) {
    this.log(`Showing details for: ${countryId}`);
    
    const element = document.getElementById(countryId);
    if (!element) {
      this.error(`Country element not found: ${countryId}`);
      return;
    }
    
    const countryData = this.countryData.countries.find(c => c.svg_id === countryId);
    if (!countryData) {
      this.error(`Country data not found for: ${countryId}`);
      return;
    }
    
    // Create or update details panel
    let detailsPanel = document.getElementById('country-details');
    if (!detailsPanel) {
      detailsPanel = document.createElement('div');
      detailsPanel.id = 'country-details';
      const infoSection = document.querySelector('.info-section');
      if (infoSection) {
        infoSection.appendChild(detailsPanel);
      }
    }
    
    detailsPanel.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); border-left: 5px solid ${countryData.color}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; color: ${countryData.color};">${countryData.name}</h3>
          <span style="background: #283593; color: white; padding: 6px 18px; border-radius: 20px; font-weight: bold;">${this.currentYear}</span>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div style="background: #f8f9fa; padding: 12px; border-radius: 6px;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Ruler</div>
            <div style="font-weight: bold; color: #283593;">${countryData.ruler}</div>
          </div>
          
          <div style="background: #f8f9fa; padding: 12px; border-radius: 6px;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Capital</div>
            <div style="font-weight: bold; color: #283593;">${countryData.capital}</div>
          </div>
          
          ${countryData.area ? `
          <div style="background: #f8f9fa; padding: 12px; border-radius: 6px;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Area</div>
            <div style="font-weight: bold; color: #283593;">${countryData.area}</div>
          </div>` : ''}
          
          ${countryData.population ? `
          <div style="background: #f8f9fa; padding: 12px; border-radius: 6px;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Population</div>
            <div style="font-weight: bold; color: #283593;">${countryData.population}</div>
          </div>` : ''}
        </div>
        
        ${countryData.notes ? `
        <div style="background: #f0f7ff; padding: 15px; border-radius: 6px; border-left: 3px solid ${countryData.color}">
          <div style="font-weight: bold; color: #283593; margin-bottom: 8px;">Historical Context</div>
          <div style="color: #444; line-height: 1.5;">${countryData.notes}</div>
        </div>` : ''}
        
        <button onclick="document.getElementById('country-details').innerHTML=''" 
                style="margin-top: 20px; padding: 10px 24px; background: #283593; color: white; 
                       border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Close Details
        </button>
      </div>
    `;
  }

  updateUI() {
    // Update year slider
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

  showError(message) {
    console.error(`ChronoMap Error: ${message}`);
    
    // Show error in map container
    const container = document.getElementById('map-container');
    if (container) {
      container.innerHTML = `
        <div style="padding: 30px; text-align: center; color: #d32f2f;">
          <h3 style="margin-bottom: 15px;">⚠️ Error</h3>
          <p style="margin-bottom: 20px;">${message}</p>
          <button onclick="location.reload()" 
                  style="padding: 10px 20px; background: #283593; color: white; 
                         border: none; border-radius: 5px; cursor: pointer;">
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
console.log("SVGMapLoader v2.0 loaded - Ready to use YOUR SVG file!");
