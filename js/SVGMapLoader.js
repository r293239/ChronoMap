class SVGMapLoader {
  constructor() {
    this.currentYear = 1800;
    this.countryData = null;
  }

  async initialize() {
    console.log("Loading ChronoMap starting from 1800...");
    
    // Load the SVG map
    await this.loadWorldMap();
    
    // Load timeline data
    await this.loadTimelineData();
    
    // Apply 1800 styling
    this.apply1800Styling();
    
    // Setup interactions
    this.setupInteractions();
    
    console.log("ChronoMap initialized for year 1800");
  }

  async loadWorldMap() {
    try {
      const response = await fetch('maps/world.svg');
      const svgText = await response.text();
      
      // Insert into container
      const container = document.getElementById('map-container');
      container.innerHTML = svgText;
      
      // Reset all countries to light gray
      const countryGroups = container.querySelectorAll('g.land');
      countryGroups.forEach(group => {
        group.style.fill = '#f0f0f0';
        group.style.stroke = '#999';
        group.style.strokeWidth = '0.5px';
        group.style.cursor = 'default';
      });
      
    } catch (error) {
      console.error('Error loading world map:', error);
    }
  }

  async loadTimelineData() {
    try {
      const response = await fetch('data/timeline.json');
      const data = await response.json();
      
      // Find 1800 data
      this.countryData = data.find(item => item.year === 1800);
      
      if (!this.countryData) {
        console.warn('No data found for 1800');
        this.countryData = { countries: [] };
      }
      
    } catch (error) {
      console.error('Error loading timeline data:', error);
    }
  }

  apply1800Styling() {
    if (!this.countryData) return;
    
    // Update UI with 1800 info
    document.getElementById('current-year').textContent = '1800';
    document.getElementById('era-title').textContent = this.countryData.title;
    document.getElementById('era-description').textContent = this.countryData.description;
    
    // Color European countries for 1800
    this.countryData.countries.forEach(country => {
      const countryElement = document.getElementById(country.svg_id);
      
      if (countryElement) {
        // Apply styling
        countryElement.style.fill = country.color;
        countryElement.style.stroke = '#333';
        countryElement.style.strokeWidth = '1px';
        countryElement.style.cursor = 'pointer';
        
        // Store data attributes for interactions
        countryElement.dataset.countryName = country.name;
        countryElement.dataset.capital = country.capital;
        countryElement.dataset.ruler = country.ruler;
        countryElement.dataset.year = '1800';
        countryElement.dataset.notes = country.notes || '';
        
        console.log(`Styled: ${country.name} (${country.svg_id}) with ${country.color}`);
      } else {
        console.warn(`Country not found in SVG: ${country.name} (id: ${country.svg_id})`);
      }
    });
    
    // Update country list
    this.updateCountryList();
  }

  updateCountryList() {
    const listContainer = document.getElementById('country-list');
    const europeanCountries = this.countryData.countries.filter(c => 
      c.continent === 'europe' || !c.continent
    );
    
    listContainer.innerHTML = `
      <h3>European Powers in 1800</h3>
      <div class="country-grid">
        ${europeanCountries.map(country => `
          <div class="country-card" style="border-color: ${country.color}">
            <div class="country-color" style="background: ${country.color}"></div>
            <div class="country-info">
              <h4>${country.name}</h4>
              <p><strong>Ruler:</strong> ${country.ruler}</p>
              <p><strong>Capital:</strong> ${country.capital}</p>
              ${country.notes ? `<p class="notes">${country.notes}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  setupInteractions() {
    const container = document.getElementById('map-container');
    
    // Hover effect
    container.addEventListener('mouseover', (e) => {
      const countryGroup = e.target.closest('g.land');
      if (countryGroup && countryGroup.dataset.countryName) {
        this.highlightCountry(countryGroup);
      }
    });
    
    container.addEventListener('mouseout', (e) => {
      const countryGroup = e.target.closest('g.land');
      if (countryGroup && countryGroup.dataset.countryName) {
        this.unhighlightCountry(countryGroup);
      }
    });
    
    // Click for details
    container.addEventListener('click', (e) => {
      const countryGroup = e.target.closest('g.land');
      if (countryGroup && countryGroup.dataset.countryName) {
        this.showCountryDetails(countryGroup);
      }
    });
  }

  highlightCountry(countryGroup) {
    const originalColor = countryGroup.style.fill;
    countryGroup.style.filter = 'brightness(1.2) drop-shadow(0 0 3px rgba(0,0,0,0.3))';
    
    // Update tooltip
    const tooltip = document.getElementById('country-tooltip');
    tooltip.innerHTML = `
      <strong>${countryGroup.dataset.countryName}</strong><br>
      ${countryGroup.dataset.ruler}<br>
      Capital: ${countryGroup.dataset.capital}
    `;
    tooltip.style.display = 'block';
  }

  unhighlightCountry(countryGroup) {
    countryGroup.style.filter = 'none';
    document.getElementById('country-tooltip').style.display = 'none';
  }

  showCountryDetails(countryGroup) {
    const detailsPanel = document.getElementById('country-details');
    detailsPanel.innerHTML = `
      <div class="details-header">
        <h2>${countryGroup.dataset.countryName}</h2>
        <span class="year-badge">1800</span>
      </div>
      <div class="details-body">
        <p><strong>Ruler:</strong> ${countryGroup.dataset.ruler}</p>
        <p><strong>Capital:</strong> ${countryGroup.dataset.capital}</p>
        ${countryGroup.dataset.notes ? `<p><strong>Historical Context:</strong> ${countryGroup.dataset.notes}</p>` : ''}
        <p><strong>Status in 1800:</strong> ${this.getCountryStatus(countryGroup.dataset.countryName)}</p>
      </div>
    `;
    detailsPanel.style.display = 'block';
  }

  getCountryStatus(countryName) {
    const statusMap = {
      'French Republic': 'Revolutionary state, expanding under Napoleon',
      'Austrian Empire': 'Conservative monarchy, leader of anti-French coalition',
      'Kingdom of Prussia': 'Major German power, modernizing state',
      'Russian Empire': 'Absolute monarchy, largest land empire',
      'Ottoman Empire': 'Declining empire, "Sick Man of Europe"',
      'United Kingdom': 'Constitutional monarchy, naval superpower',
      'Kingdom of Spain': 'Bourbon monarchy, colonial empire',
      'Kingdom of Portugal': 'Braganza dynasty, British ally'
    };
    return statusMap[countryName] || 'Major European power';
  }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  const app = new SVGMapLoader();
  app.initialize();
});
