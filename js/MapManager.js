// js/MapManager.js - Handles SVG loading and country coloring
class MapManager {
    constructor(timelineData) {
        console.log('🗺️ MapManager: Initializing...');
        
        this.timelineData = timelineData;
        this.svgElement = null;
        this.countryElements = new Map(); // Cache of country elements
        this.currentColors = new Map();   // Current color scheme
        this.zoomLevel = 1.0;
        
        // Country ID mappings for your specific SVG
        this.countryIdMap = {
            // European countries with their SVG IDs
            'fr': 'fr',    // French Republic
            'at': 'at',    // Austrian Empire
            'de': 'de',    // Kingdom of Prussia
            'ru': 'ru',    // Russian Empire
            'tr': 'tr',    // Ottoman Empire
            'gb': 'gb',    // United Kingdom
            'es': 'es',    // Kingdom of Spain
            'pt': 'pt',    // Kingdom of Portugal
            'se': 'se',    // Kingdom of Sweden
            'dk': 'dk',    // Denmark-Norway
            'it': 'it',    // Italian States
            'nl': 'nl',    // Netherlands
            'ch': 'ch',    // Switzerland
            'pl': 'pl',    // Poland
            'be': 'be',    // Belgium
            'lu': 'lu'     // Luxembourg
        };
    }
    
    async initialize() {
        console.log('🗺️ Loading SVG map...');
        
        try {
            // Load the SVG file
            await this.loadSVG();
            
            // Wait for SVG to render
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Cache all country elements
            this.cacheCountryElements();
            
            // Reset all to default colors
            this.resetAllColors();
            
            console.log(`✅ MapManager: Loaded ${this.countryElements.size} country elements`);
            
            // Setup SVG interactions
            this.setupSVGInteractions();
            
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize map:', error);
            this.showMapError(error.message);
            return false;
        }
    }
    
    async loadSVG() {
        const container = document.getElementById('map-container');
        if (!container) {
            throw new Error('Map container not found');
        }
        
        try {
            // Load the SVG file
            const response = await fetch('maps/world-map.svg');
            
            if (!response.ok) {
                throw new Error(`Failed to load SVG: ${response.status}`);
            }
            
            const svgText = await response.text();
            
            // Validate it's an SVG
            if (!svgText.includes('<svg') || !svgText.includes('</svg>')) {
                throw new Error('File is not a valid SVG');
            }
            
            // Insert into container
            container.innerHTML = svgText;
            
            // Get the SVG element
            this.svgElement = container.querySelector('svg');
            if (!this.svgElement) {
                throw new Error('No SVG element found in loaded file');
            }
            
            // Make SVG responsive
            this.svgElement.style.width = '100%';
            this.svgElement.style.height = '100%';
            this.svgElement.style.display = 'block';
            
            console.log('✅ SVG loaded successfully');
            
        } catch (error) {
            console.error('SVG loading error:', error);
            throw error;
        }
    }
    
    cacheCountryElements() {
        console.log('🔍 Caching country elements...');
        
        // Clear previous cache
        this.countryElements.clear();
        
        // Cache all country elements by ID
        Object.entries(this.countryIdMap).forEach(([countryCode, svgId]) => {
            const element = document.getElementById(svgId);
            
            if (element) {
                this.countryElements.set(countryCode, {
                    element: element,
                    svgId: svgId,
                    originalFill: element.style.fill || element.getAttribute('fill') || '#f0f0f0'
                });
                
                console.log(`✅ Cached ${countryCode} (${svgId})`);
            } else {
                console.warn(`⚠️ Could not find element for ${countryCode} (id: ${svgId})`);
            }
        });
        
        // Also cache elements by class for countries that might use classes
        this.cacheElementsByClass();
    }
    
    cacheElementsByClass() {
        // Some SVG maps use classes instead of IDs
        const countryClasses = ['fr', 'de', 'es', 'it', 'gb', 'at', 'ru', 'tr', 'pt'];
        
        countryClasses.forEach(countryClass => {
            const elements = document.querySelectorAll(`.${countryClass}`);
            
            if (elements.length > 0 && !this.countryElements.has(countryClass)) {
                this.countryElements.set(countryClass, {
                    element: elements[0],
                    svgId: countryClass,
                    originalFill: elements[0].style.fill || '#f0f0f0'
                });
                
                console.log(`✅ Cached ${countryClass} by class`);
            }
        });
    }
    
    applyYearStyling(year) {
        console.log(`🎨 Applying colors for year ${year}...`);
        
        // Get data for this year
        const yearData = this.timelineData.getYearData(year);
        if (!yearData) {
            console.warn(`No data available for year ${year}`);
            return;
        }
        
        // Reset all colors first
        this.resetAllColors();
        
        // Clear current colors
        this.currentColors.clear();
        
        // Apply colors for each country in the year data
        let coloredCount = 0;
        
        yearData.countries.forEach(country => {
            const countryInfo = this.countryElements.get(country.svg_id);
            
            if (countryInfo && countryInfo.element) {
                // Apply the color
                this.colorElement(countryInfo.element, country.color);
                
                // Store country data on the element
                this.attachCountryData(countryInfo.element, country, year);
                
                // Store in current colors
                this.currentColors.set(country.svg_id, country.color);
                
                coloredCount++;
                
                console.log(`✅ Colored ${country.name} (${country.svg_id}) with ${country.color}`);
            } else {
                console.warn(`⚠️ Could not color ${country.name} (${country.svg_id}): element not found`);
            }
        });
        
        console.log(`✅ Applied colors to ${coloredCount} countries for ${year}`);
        
        // Update legend
        this.updateLegend(yearData);
    }
    
    colorElement(element, color) {
        if (!element) return false;
        
        // Multiple methods to ensure color applies
        try {
            // Method 1: Direct style (highest priority)
            element.style.fill = color;
            element.style.stroke = '#333';
            element.style.strokeWidth = '1px';
            
            // Method 2: Set attributes (for SVG)
            element.setAttribute('fill', color);
            element.setAttribute('stroke', '#333');
            element.setAttribute('stroke-width', '1');
            
            // Method 3: For <g> elements, color all child paths
            if (element.tagName === 'g' || element.tagName === 'G') {
                const children = element.querySelectorAll('path, polygon, circle');
                children.forEach(child => {
                    child.style.fill = color;
                    child.setAttribute('fill', color);
                });
            }
            
            return true;
            
        } catch (error) {
            console.error('Error coloring element:', error);
            return false;
        }
    }
    
    attachCountryData(element, country, year) {
        if (!element) return;
        
        // Store country data as data attributes
        element.dataset.countryCode = country.svg_id;
        element.dataset.countryName = country.name;
        element.dataset.capital = country.capital || '';
        element.dataset.ruler = country.ruler || '';
        element.dataset.year = year;
        element.dataset.notes = country.notes || '';
        
        // Make it interactive
        element.style.cursor = 'pointer';
        element.classList.add('interactive-country');
    }
    
    resetAllColors() {
        console.log('🔄 Resetting all country colors...');
        
        let resetCount = 0;
        
        // Reset all cached elements to original colors
        for (const [countryCode, countryInfo] of this.countryElements) {
            if (countryInfo && countryInfo.element) {
                // Reset to original color
                countryInfo.element.style.fill = countryInfo.originalFill;
                countryInfo.element.style.stroke = '#999';
                countryInfo.element.style.strokeWidth = '0.5px';
                
                // Reset attributes
                countryInfo.element.setAttribute('fill', countryInfo.originalFill);
                countryInfo.element.setAttribute('stroke', '#999');
                countryInfo.element.setAttribute('stroke-width', '0.5');
                
                resetCount++;
            }
        }
        
        console.log(`✅ Reset ${resetCount} elements to original colors`);
    }
    
    updateLegend(yearData) {
        const legendContainer = document.getElementById('map-legend');
        if (!legendContainer) return;
        
        // Create legend HTML
        let legendHTML = `
            <div class="legend-title">${yearData.year} - ${yearData.title}</div>
            <div class="legend-items">
        `;
        
        // Add items for each colored country
        for (const [countryCode, color] of this.currentColors) {
            const country = yearData.countries.find(c => c.svg_id === countryCode);
            if (country) {
                legendHTML += `
                    <div class="legend-item">
                        <span class="legend-color" style="background: ${color}"></span>
                        <span class="legend-label">${country.name}</span>
                    </div>
                `;
            }
        }
        
        legendHTML += '</div>';
        
        // Update the legend
        legendContainer.innerHTML = legendHTML;
    }
    
    setupSVGInteractions() {
        console.log('🖱️ Setting up SVG interactions...');
        
        // Add event listeners to all interactive countries
        document.querySelectorAll('.interactive-country').forEach(element => {
            // Remove existing listeners first
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // Add new listeners
            this.addCountryInteractions(newElement);
        });
    }
    
    addCountryInteractions(element) {
        if (!element) return;
        
        // Hover enter
        element.addEventListener('mouseenter', (e) => {
            this.highlightCountry(element);
            this.showTooltip(element);
        });
        
        // Hover leave
        element.addEventListener('mouseleave', (e) => {
            this.unhighlightCountry(element);
            this.hideTooltip();
        });
        
        // Click
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleCountryClick(element);
        });
    }
    
    highlightCountry(element) {
        element.style.filter = 'brightness(1.15) drop-shadow(0 0 4px rgba(0,0,0,0.2))';
        element.style.strokeWidth = '2px';
        element.style.stroke = '#000';
        element.style.zIndex = '1000';
    }
    
    unhighlightCountry(element) {
        element.style.filter = 'none';
        element.style.strokeWidth = '1px';
        element.style.stroke = '#333';
        element.style.zIndex = '';
    }
    
    showTooltip(element) {
        const tooltip = document.getElementById('map-tooltip');
        if (!tooltip || !element.dataset.countryName) return;
        
        tooltip.innerHTML = `
            <strong>${element.dataset.countryName}</strong><br>
            ${element.dataset.ruler || ''}<br>
            <small>Click for details</small>
        `;
        
        tooltip.style.display = 'block';
        
        // Position tooltip near cursor
        const mouseMoveHandler = (e) => {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY - tooltip.offsetHeight - 10) + 'px';
        };
        
        document.addEventListener('mousemove', mouseMoveHandler);
        element._tooltipHandler = mouseMoveHandler;
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('map-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
        
        // Clean up event listeners
        document.querySelectorAll('.interactive-country').forEach(el => {
            if (el._tooltipHandler) {
                document.removeEventListener('mousemove', el._tooltipHandler);
                delete el._tooltipHandler;
            }
        });
    }
    
    handleCountryClick(element) {
        const countryCode = element.dataset.countryCode;
        const countryName = element.dataset.countryName;
        const year = element.dataset.year || this.timelineData.currentYear;
        
        console.log(`📍 Country clicked: ${countryName} (${countryCode}) in ${year}`);
        
        // Dispatch custom event for other modules to handle
        const event = new CustomEvent('countrySelected', {
            detail: {
                countryCode: countryCode,
                countryName: countryName,
                year: year,
                element: element
            }
        });
        
        document.dispatchEvent(event);
    }
    
    zoomIn() {
        if (this.zoomLevel < 3.0) {
            this.zoomLevel += 0.1;
            this.applyZoom();
        }
    }
    
    zoomOut() {
        if (this.zoomLevel > 0.5) {
            this.zoomLevel -= 0.1;
            this.applyZoom();
        }
    }
    
    resetZoom() {
        this.zoomLevel = 1.0;
        this.applyZoom();
    }
    
    applyZoom() {
        if (this.svgElement) {
            this.svgElement.style.transform = `scale(${this.zoomLevel})`;
            this.svgElement.style.transformOrigin = 'center center';
        }
    }
    
    showMapError(message) {
        const container = document.getElementById('map-container');
        if (container) {
            container.innerHTML = `
                <div class="map-error">
                    <h3>Map Loading Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }
    
    // Debug methods
    debugShowAllCountries() {
        console.log('=== Country Elements Cache ===');
        for (const [code, info] of this.countryElements) {
            console.log(`${code}:`, {
                found: !!info.element,
                tagName: info.element?.tagName,
                id: info.element?.id,
                currentColor: info.element?.style.fill
            });
        }
    }
    
    testColorCountry(countryCode, color = 'red') {
        const countryInfo = this.countryElements.get(countryCode);
        if (countryInfo && countryInfo.element) {
            this.colorElement(countryInfo.element, color);
            console.log(`✅ Test: Colored ${countryCode} with ${color}`);
            return true;
        } else {
            console.warn(`❌ Test: Could not find ${countryCode}`);
            return false;
        }
    }
}

// Make globally available
window.MapManager = MapManager;
console.log('✅ MapManager module loaded');
