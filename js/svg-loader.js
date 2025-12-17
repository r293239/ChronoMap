// js/svg-loader.js - Loads and prepares the SVG map

class SVGMapLoader {
    constructor() {
        this.mapContainer = document.getElementById('map');
        this.countries = new Map(); // Stores country elements by ID
        this.currentYear = 1800;
        this.init();
    }
    
    async init() {
        await this.loadSVG();
        this.setupCountryIDs(); // Critical step!
        this.setupInteractivity();
        this.initializeMapForYear(1800);
    }
    
    async loadSVG() {
        try {
            const response = await fetch('maps/world.svg');
            const svgText = await response.text();
            
            // Create a temporary div to parse SVG
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = svgText;
            const svgElement = tempDiv.querySelector('svg');
            
            if (!svgElement) {
                throw new Error('No SVG found in file');
            }
            
            // Add ID to the SVG for easy reference
            svgElement.id = 'world-svg-map';
            
            // Clear loading message and add SVG
            this.mapContainer.innerHTML = '';
            this.mapContainer.appendChild(svgElement);
            
            console.log('SVG map loaded successfully');
            
        } catch (error) {
            console.error('Error loading SVG:', error);
            this.mapContainer.innerHTML = `
                <div style="color: red; padding: 20px;">
                    Error loading map. Make sure maps/world.svg exists.<br>
                    ${error.message}
                </div>`;
        }
    }
    
    setupCountryIDs() {
        // THIS IS THE MOST IMPORTANT FUNCTION
        // You need to add IDs to all European country paths
        
        const countryMappings = {
            // WESTERN EUROPE
            'United Kingdom': 'GBR',
            'Ireland': 'IRL',
            'France': 'FRA',
            'Spain': 'ESP',
            'Portugal': 'PRT',
            
            // CENTRAL EUROPE
            'Germany': 'DEU',
            'Netherlands': 'NLD',
            'Belgium': 'BEL',
            'Luxembourg': 'LUX',
            'Switzerland': 'CHE',
            'Austria': 'AUT',
            
            // NORTHERN EUROPE
            'Sweden': 'SWE',
            'Norway': 'NOR',
            'Denmark': 'DNK',
            'Finland': 'FIN',
            
            // SOUTHERN EUROPE
            'Italy': 'ITA',
            'Greece': 'GRC',
            
            // EASTERN EUROPE
            'Poland': 'POL',
            'Russia': 'RUS',
            'Ukraine': 'UKR',
            'Belarus': 'BLR',
            'Romania': 'ROU',
            'Bulgaria': 'BGR',
            'Czech Republic': 'CZE',
            'Slovakia': 'SVK',
            'Hungary': 'HUN',
            
            // HISTORICAL ENTITIES (will need manual SVG editing)
            'Prussia': 'PRU',
            'Ottoman Empire': 'OTT',
            'Austrian Empire': 'AUE'
        };
        
        // Get all path elements in the SVG
        const paths = document.querySelectorAll('#world-svg-map path');
        
        paths.forEach(path => {
            // Check if this path looks like a country (has fill color)
            const fill = path.getAttribute('fill');
            if (fill && fill !== 'none') {
                // Try to identify country by its shape coordinates
                const countryName = this.guessCountryName(path);
                
                if (countryName && countryMappings[countryName]) {
                    const countryCode = countryMappings[countryName];
                    path.id = countryCode;
                    path.setAttribute('data-name', countryName);
                    path.classList.add('country', 'europe-country');
                    
                    // Store reference
                    this.countries.set(countryCode, path);
                    
                    console.log(`Identified: ${countryName} -> ${countryCode}`);
                }
            }
        });
        
        console.log(`Found ${this.countries.size} European countries`);
    }
    
    guessCountryName(pathElement) {
        // This is a simplified version - you'll need to manually identify countries
        // For now, we'll add a data attribute manually
        
        // TEMPORARY: Add this function to manually tag countries
        return null;
    }
    
    setupInteractivity() {
        // Add hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('country')) {
                e.target.style.strokeWidth = '2';
                e.target.style.stroke = '#333';
                
                // Show country name
                const name = e.target.getAttribute('data-name') || e.target.id;
                this.showTooltip(name, e.clientX, e.clientY);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('country')) {
                e.target.style.strokeWidth = '0.5';
                e.target.style.stroke = '#cccccc';
                this.hideTooltip();
            }
        });
    }
    
    updateMapForYear(year) {
        this.currentYear = year;
        
        // Reset all countries
        this.countries.forEach(country => {
            country.style.fill = '#f0f0f0';
            country.style.opacity = '0.3';
            country.classList.remove('active');
        });
        
        // Get data for this year
        const yearData = this.getYearData(year);
        
        // Apply styles based on year
        yearData.countries.forEach(countryCode => {
            const country = this.countries.get(countryCode);
            if (country) {
                country.style.fill = yearData.colors[countryCode] || '#3498db';
                country.style.opacity = '0.8';
                country.classList.add('active');
            }
        });
        
        // Update year display
        document.getElementById('current-year').textContent = year;
    }
    
    getYearData(year) {
        // Default data - you'll replace this with your timeline.json
        const defaultData = {
            1800: {
                countries: ['FRA', 'GBR', 'ESP', 'PRT', 'AUT', 'RUS', 'PRU', 'OTT'],
                colors: {
                    'FRA': '#4e79a7',
                    'GBR': '#76b7b2',
                    'RUS': '#e15759',
                    'AUT': '#f28e2c',
                    'PRU': '#edc949',
                    'OTT': '#59a14f'
                }
            },
            1815: {
                countries: ['FRA', 'GBR', 'ESP', 'PRT', 'AUT', 'RUS', 'PRU'],
                colors: {
                    'FRA': '#4e79a7',
                    'GBR': '#76b7b2',
                    'RUS': '#e15759'
                }
            }
        };
        
        return defaultData[year] || defaultData[1800];
    }
    
    showTooltip(name, x, y) {
        let tooltip = document.getElementById('map-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'map-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 3px;
                font-size: 12px;
                pointer-events: none;
                z-index: 1000;
                display: none;
            `;
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = name;
        tooltip.style.left = (x + 10) + 'px';
        tooltip.style.top = (y - 10) + 'px';
        tooltip.style.display = 'block';
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('map-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.svgMap = new SVGMapLoader();
});
