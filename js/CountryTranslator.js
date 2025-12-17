// js/CountryTranslator.js - Translates between timeline IDs and SVG structure
class CountryTranslator {
  constructor() {
    // Map timeline country codes to SVG selectors
    this.countryMap = {
      // European countries for 1800
      'fr': { 
        selector: 'g.fr, [id*="fx"]', // France in your SVG
        element: null
      },
      'at': {
        selector: 'g.at, [id="at"]', // Austria
        element: null
      },
      'de': {
        selector: 'g.de, [id="de"]', // Germany/Prussia
        element: null
      },
      'ru': {
        selector: 'g.ru, [id="ru"]', // Russia
        element: null
      },
      'tr': {
        selector: 'g.tr, [id="tr"]', // Ottoman Empire
        element: null
      },
      'gb': {
        selector: 'g.gb, [id="gb"]', // United Kingdom
        element: null
      },
      'es': {
        selector: 'g.es, [id="es"]', // Spain
        element: null
      },
      'pt': {
        selector: 'g.pt, [id="pt"]', // Portugal
        element: null
      },
      'se': {
        selector: 'g.se, [id="se"]', // Sweden
        element: null
      },
      'dk': {
        selector: 'g.dk, [id="dk"]', // Denmark
        element: null
      },
      'it': {
        selector: 'g.it, [id="it"]', // Italy
        element: null
      }
    };
  }

  // Initialize by finding all elements
  initialize() {
    console.log("🔍 CountryTranslator: Scanning SVG for country elements...");
    
    Object.entries(this.countryMap).forEach(([countryCode, data]) => {
      // Try multiple selectors
      const selectors = data.selector.split(', ');
      let foundElement = null;
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          foundElement = element;
          console.log(`✅ Found ${countryCode} using: ${selector}`);
          break;
        }
      }
      
      this.countryMap[countryCode].element = foundElement;
      
      if (!foundElement) {
        console.warn(`⚠️  ${countryCode} not found with selectors: ${data.selector}`);
      }
    });
    
    console.log("✅ CountryTranslator initialized");
    return this;
  }

  // Get SVG element for a country code
  getElement(countryCode) {
    return this.countryMap[countryCode]?.element || null;
  }

  // Get all elements for coloring
  getAllElements() {
    const elements = [];
    Object.values(this.countryMap).forEach(data => {
      if (data.element) {
        elements.push(data.element);
      }
    });
    return elements;
  }

  // Get country code from SVG element
  getCountryCode(element) {
    for (const [countryCode, data] of Object.entries(this.countryMap)) {
      if (data.element === element) {
        return countryCode;
      }
    }
    return null;
  }

  // Apply color to a specific country
  colorCountry(countryCode, color) {
    const element = this.getElement(countryCode);
    if (element) {
      element.style.fill = color;
      element.style.stroke = '#333';
      element.style.strokeWidth = '1px';
      console.log(`🎨 Colored ${countryCode} with ${color}`);
      return true;
    }
    return false;
  }

  // Reset all countries to default
  resetAllColors() {
    Object.keys(this.countryMap).forEach(countryCode => {
      const element = this.getElement(countryCode);
      if (element) {
        element.style.fill = '#f0f0f0';
        element.style.stroke = '#999';
        element.style.strokeWidth = '0.5px';
      }
    });
    console.log("🔄 Reset all country colors");
  }

  // Debug: Show what was found
  debug() {
    console.log("=== CountryTranslator Debug ===");
    Object.entries(this.countryMap).forEach(([countryCode, data]) => {
      console.log(`${countryCode}: ${data.element ? '✅ Found' : '❌ Missing'}`);
      if (data.element) {
        console.log(`  Element:`, {
          tagName: data.element.tagName,
          id: data.element.id,
          className: data.element.className,
          children: data.element.children?.length || 0
        });
      }
    });
  }
}

// Make globally available
window.CountryTranslator = CountryTranslator;
