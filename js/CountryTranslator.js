// js/CountryTranslator.js - Fixed Version
class CountryTranslator {
    constructor() {
        console.log("🌍 CountryTranslator initializing...");
        this.countryElements = new Map();
        this.colorCache = new Map();
        this.initialized = false;
    }

    // Scan the SVG and build mapping
    initialize() {
        if (this.initialized) return this;
        
        console.log("🔍 Scanning SVG for country elements...");
        
        // Build mapping based on actual SVG structure
        this.buildCountryMapping();
        
        this.initialized = true;
        console.log(`✅ CountryTranslator ready. Found ${this.countryElements.size} countries.`);
        
        // Debug: show what we found
        this.debug();
        
        return this;
    }

    buildCountryMapping() {
        console.log("🗺️ Building country mapping...");
        
        // European countries mapping for your specific SVG
        const svgMapping = {
            // France - in your SVG: <g class="land coast fr fx" id="fx">
            'fr': { 
                selectors: ['g.fr', 'g.fx', '[id="fx"]', '[class*="fr"]'],
                name: 'French Republic'
            },
            // Austria - <g class="land coast at" id="at">
            'at': {
                selectors: ['g.at', '[id="at"]', '[class*="at"]'],
                name: 'Austrian Empire'
            },
            // Germany/Prussia - <g class="land coast de" id="de">
            'de': {
                selectors: ['g.de', '[id="de"]', '[class*="de"]'],
                name: 'Kingdom of Prussia'
            },
            // Russia
            'ru': {
                selectors: ['g.ru', '[id="ru"]', '[class*="ru"]'],
                name: 'Russian Empire'
            },
            // Ottoman Empire (Turkey)
            'tr': {
                selectors: ['g.tr', '[id="tr"]', '[class*="tr"]'],
                name: 'Ottoman Empire'
            },
            // United Kingdom
            'gb': {
                selectors: ['g.gb', '[id="gb"]', '[class*="gb"]'],
                name: 'United Kingdom'
            },
            // Spain
            'es': {
                selectors: ['g.es', '[id="es"]', '[class*="es"]'],
                name: 'Kingdom of Spain'
            },
            // Portugal
            'pt': {
                selectors: ['g.pt', '[id="pt"]', '[class*="pt"]'],
                name: 'Kingdom of Portugal'
            },
            // Sweden
            'se': {
                selectors: ['g.se', '[id="se"]', '[class*="se"]'],
                name: 'Kingdom of Sweden'
            },
            // Denmark
            'dk': {
                selectors: ['g.dk', '[id="dk"]', '[class*="dk"]'],
                name: 'Denmark-Norway'
            },
            // Italy
            'it': {
                selectors: ['g.it', '[id="it"]', '[class*="it"]'],
                name: 'Italian States'
            }
        };

        // Find each country in the SVG
        Object.entries(svgMapping).forEach(([countryCode, data]) => {
            let element = null;
            
            // Try each selector until we find the element
            for (const selector of data.selectors) {
                try {
                    const found = document.querySelector(selector);
                    if (found) {
                        element = found;
                        console.log(`✅ Found ${data.name} (${countryCode}) with: ${selector}`);
                        break;
                    }
                } catch (e) {
                    console.warn(`Error with selector ${selector}:`, e.message);
                }
            }
            
            if (element) {
                this.countryElements.set(countryCode, {
                    element: element,
                    name: data.name,
                    originalFill: element.style.fill || '#f0f0f0'
                });
            } else {
                console.warn(`❌ Could not find ${data.name} (${countryCode}) in SVG`);
            }
        });
    }

    // Get SVG element for a country code
    getElement(countryCode) {
        const info = this.countryElements.get(countryCode);
        return info ? info.element : null;
    }

    // Get country info
    getCountryInfo(countryCode) {
        return this.countryElements.get(countryCode) || null;
    }

    // Get all country elements
    getAllElements() {
        const elements = [];
        for (const [code, info] of this.countryElements) {
            elements.push({
                code: code,
                element: info.element,
                name: info.name
            });
        }
        return elements;
    }

    // Color a specific country
    colorCountry(countryCode, color, strokeColor = '#333', strokeWidth = '1px') {
        const info = this.countryElements.get(countryCode);
        
        if (!info || !info.element) {
            console.warn(`Cannot color ${countryCode}: country not found in SVG`);
            return false;
        }
        
        try {
            // Apply color to the element
            info.element.style.fill = color;
            info.element.style.stroke = strokeColor;
            info.element.style.strokeWidth = strokeWidth;
            
            // Store original color if not already stored
            if (!this.colorCache.has(countryCode)) {
                this.colorCache.set(countryCode, {
                    originalFill: info.originalFill,
                    currentColor: color
                });
            } else {
                this.colorCache.get(countryCode).currentColor = color;
            }
            
            console.log(`🎨 Colored ${info.name} (${countryCode}) with ${color}`);
            return true;
            
        } catch (error) {
            console.error(`Error coloring ${countryCode}:`, error);
            return false;
        }
    }

    // Color multiple countries at once
    colorCountries(countryMap) {
        let successCount = 0;
        
        Object.entries(countryMap).forEach(([countryCode, color]) => {
            if (this.colorCountry(countryCode, color)) {
                successCount++;
            }
        });
        
        console.log(`✅ Colored ${successCount} out of ${Object.keys(countryMap).length} countries`);
        return successCount;
    }

    // Reset a country to its original color
    resetCountry(countryCode) {
        const info = this.countryElements.get(countryCode);
        const cache = this.colorCache.get(countryCode);
        
        if (!info || !info.element) return false;
        
        const originalColor = cache?.originalFill || '#f0f0f0';
        info.element.style.fill = originalColor;
        info.element.style.stroke = '#999';
        info.element.style.strokeWidth = '0.5px';
        
        console.log(`🔄 Reset ${info.name} (${countryCode}) to original color`);
        return true;
    }

    // Reset all countries to original colors
    resetAllColors() {
        let resetCount = 0;
        
        for (const [countryCode, info] of this.countryElements) {
            if (!info.element) continue;
            
            info.element.style.fill = info.originalFill;
            info.element.style.stroke = '#999';
            info.element.style.strokeWidth = '0.5px';
            resetCount++;
        }
        
        console.log(`🔄 Reset ${resetCount} countries to original colors`);
        return resetCount;
    }

    // Get current color of a country
    getCurrentColor(countryCode) {
        const info = this.countryElements.get(countryCode);
        if (!info || !info.element) return null;
        
        return info.element.style.fill || info.originalFill;
    }

    // Apply hover effect to a country
    highlightCountry(countryCode) {
        const info = this.countryElements.get(countryCode);
        if (!info || !info.element) return false;
        
        // Store original state if not already
        if (!info.element.dataset.originalFilter) {
            info.element.dataset.originalFilter = info.element.style.filter || 'none';
        }
        
        // Apply highlight
        info.element.style.filter = 'brightness(1.15) drop-shadow(0 0 3px rgba(0,0,0,0.3))';
        info.element.style.zIndex = '1000';
        
        return true;
    }

    // Remove hover effect
    unhighlightCountry(countryCode) {
        const info = this.countryElements.get(countryCode);
        if (!info || !info.element) return false;
        
        // Restore original filter
        info.element.style.filter = info.element.dataset.originalFilter || 'none';
        info.element.style.zIndex = '';
        
        return true;
    }

    // Add click interaction to a country
    addClickHandler(countryCode, handler) {
        const info = this.countryElements.get(countryCode);
        if (!info || !info.element) return false;
        
        info.element.style.cursor = 'pointer';
        info.element.addEventListener('click', handler);
        
        // Store handler for later removal
        if (!info.element.dataset.clickHandlers) {
            info.element.dataset.clickHandlers = [];
        }
        info.element.dataset.clickHandlers.push(handler);
        
        return true;
    }

    // Remove click handlers
    removeClickHandlers(countryCode) {
        const info = this.countryElements.get(countryCode);
        if (!info || !info.element || !info.element.dataset.clickHandlers) return false;
        
        // Note: In a real implementation, you'd store and remove specific handlers
        info.element.style.cursor = 'default';
        
        return true;
    }

    // Debug: show all found countries - FIXED VERSION
    debug() {
        console.log("=== CountryTranslator Debug ===");
        console.log(`Total countries mapped: ${this.countryElements.size}`);
        
        console.log("\n📋 Country Mapping:");
        for (const [code, info] of this.countryElements) {
            const elementInfo = {
                found: !!info.element,
                tagName: info.element ? info.element.tagName : 'none',
                id: info.element ? info.element.id || 'no-id' : 'none',
                hasClassName: info.element && typeof info.element.className === 'string',
                children: info.element ? (info.element.children ? info.element.children.length : 0) : 0
            };
            
            // Safely handle className
            if (elementInfo.hasClassName) {
                const className = info.element.className;
                elementInfo.className = className.length > 50 ? 
                    className.substring(0, 50) + '...' : 
                    className;
            } else {
                elementInfo.className = 'no-class';
            }
            
            console.log(`  ${code} (${info.name}):`, elementInfo);
        }
        
        console.log("\n🎨 Current Colors:");
        for (const [code, info] of this.countryElements) {
            const currentColor = this.getCurrentColor(code);
            console.log(`  ${code}: ${currentColor || 'default'}`);
        }
    }

    // Export current mapping for debugging
    exportMapping() {
        const mapping = {};
        
        for (const [code, info] of this.countryElements) {
            mapping[code] = {
                name: info.name,
                selector: this.getSelectorForElement(info.element),
                color: this.getCurrentColor(code)
            };
        }
        
        return mapping;
    }

    // Helper: Get CSS selector for an element
    getSelectorForElement(element) {
        if (!element) return null;
        
        if (element.id) {
            return `#${element.id}`;
        } else if (element.className && typeof element.className === 'string') {
            const firstClass = element.className.split(' ')[0];
            return `${element.tagName.toLowerCase()}.${firstClass}`;
        }
        
        return element.tagName.toLowerCase();
    }

    // Check if country exists in SVG
    hasCountry(countryCode) {
        return this.countryElements.has(countryCode);
    }

    // Get list of all country codes
    getCountryCodes() {
        return Array.from(this.countryElements.keys());
    }

    // Get list of all country names
    getCountryNames() {
        const names = [];
        for (const info of this.countryElements.values()) {
            names.push(info.name);
        }
        return names;
    }
}

// Make globally available
window.CountryTranslator = CountryTranslator;
console.log("✅ CountryTranslator class loaded. Use: new CountryTranslator().initialize()");
