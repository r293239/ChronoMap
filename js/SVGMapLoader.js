// ============================================
// SVGMapLoader.js - Complete Fixed Version
// ChronoMap - Historical Map Visualization
// ============================================

class SVGMapLoader {
    constructor() {
        console.log("🗺️ SVGMapLoader initializing...");
        
        this.currentYear = 1800;
        this.countryData = null;
        this.translator = null;
        this.isLoading = false;
        this.currentColors = {};
        this.debugMode = true;
        
        // Ensure timeline.js is loaded
        if (typeof timelineData === 'undefined') {
            console.error("❌ timelineData not found. Make sure timeline.js is loaded first!");
        } else {
            console.log("✅ timelineData available");
        }
    }

    // Main initialization
    async initialize() {
        console.log("🚀 Starting ChronoMap initialization...");
        
        try {
            this.showLoading(true);
            
            // Step 1: Load the world map
            await this.loadWorldMap();
            
            // Step 2: Load timeline data
            this.loadTimelineData();
            
            // Step 3: Initialize country translator
            this.initializeTranslator();
            
            // Step 4: Apply initial styling (1800)
            this.applyYearStyling(this.currentYear);
            
            // Step 5: Setup all interactions
            this.setupInteractions();
            
            // Step 6: Update UI controls
            this.updateUIControls();
            
            console.log("✅ ChronoMap initialized successfully!");
            
        } catch (error) {
            console.error("❌ ChronoMap initialization failed:", error);
            this.showError("Failed to initialize: " + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    // Load the world map SVG
    async loadWorldMap() {
        console.log("🌍 Loading world map...");
        
        const container = document.getElementById('map-container');
        if (!container) {
            throw new Error("Map container (#map-container) not found in HTML");
        }
        
        try {
            // Try multiple possible file paths
            const paths = [
                'maps/world-map.svg',    // Your actual file
                './maps/world-map.svg',
                '/maps/world-map.svg',
                'maps/world.svg',        // Fallback
                './maps/world.svg'
            ];
            
            let svgLoaded = false;
            
            for (const path of paths) {
                try {
                    console.log(`🔍 Trying to load: ${path}`);
                    const response = await fetch(path);
                    
                    if (response.ok) {
                        const svgText = await response.text();
                        
                        // Basic validation
                        if (svgText.includes('<svg') && svgText.includes('</svg>')) {
                            container.innerHTML = svgText;
                            console.log(`✅ SVG loaded successfully from: ${path}`);
                            svgLoaded = true;
                            
                            // Make SVG responsive
                            const svgElement = container.querySelector('svg');
                            if (svgElement) {
                                svgElement.style.width = '100%';
                                svgElement.style.height = '100%';
                            }
                            break;
                        } else {
                            console.warn(`File ${path} doesn't appear to be valid SVG`);
                        }
                    } else {
                        console.log(`Path ${path} returned: ${response.status}`);
                    }
                } catch (fetchError) {
                    console.log(`Error loading ${path}:`, fetchError.message);
                }
            }
            
            if (!svgLoaded) {
                this.createFallbackMap();
                console.warn("⚠️ Using fallback map - check if world-map.svg exists");
            }
            
        } catch (error) {
            console.error("❌ Failed to load world map:", error);
            this.createFallbackMap();
        }
    }

    // Create fallback map if SVG fails to load
    createFallbackMap() {
        console.log("🔄 Creating fallback map...");
        
        const container = document.getElementById('map-container');
        if (!container) return;
        
        container.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #666; background: #f8f9fa; border-radius: 10px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <h3 style="margin-bottom: 20px; color: #d32f2f;">⚠️ Map Loading Issue</h3>
                <p style="margin-bottom: 15px;">Unable to load <strong>maps/world-map.svg</strong></p>
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
                    <p><strong>Expected file structure:</strong></p>
                    <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0; overflow: auto;">
ChronoMap/
├── maps/
│   └── <strong>world-map.svg</strong>  &lt;-- YOUR SVG FILE
├── js/
│   ├── SVGMapLoader.js
│   └── timeline.js
└── index.html</pre>
                </div>
                <button onclick="location.reload()" 
                        style="padding: 12px 30px; background: #283593; color: white; 
                               border: none; border-radius: 6px; cursor: pointer; 
                               font-weight: bold; margin-top: 20px;">
                    🔄 Reload Page
                </button>
            </div>
        `;
    }

    // Load timeline data from timeline.js
    loadTimelineData() {
        console.log("📅 Loading timeline data...");
        
        if (typeof timelineData === 'undefined') {
            console.error("❌ timelineData is not defined. Check if timeline.js is loaded.");
            
            // Create minimal fallback data
            this.countryData = {
                year: 1800,
                title: "Europe in 1800",
                description: "Historical borders",
                countries: [
                    {
                        name: "French Republic",
                        svg_id: "fr",
                        color: "#1f77b4",
                        capital: "Paris",
                        ruler: "Napoleon Bonaparte"
                    },
                    {
                        name: "Austrian Empire",
                        svg_id: "at", 
                        color: "#ff7f0e",
                        capital: "Vienna",
                        ruler: "Francis II"
                    }
                ]
            };
            return;
        }
        
        // Find data for 1800
        this.countryData = timelineData.find(item => item.year === 1800);
        
        if (!this.countryData) {
            console.warn("⚠️ No 1800 data found, using first available year");
            this.countryData = timelineData[0];
            this.currentYear = this.countryData.year;
        }
        
        console.log(`✅ Loaded data for ${this.countryData.year}: ${this.countryData.countries.length} countries`);
    }

    // Initialize the country translator
    initializeTranslator() {
        console.log("🔄 Initializing CountryTranslator...");
        
        if (typeof CountryTranslator === 'undefined') {
            console.error("❌ CountryTranslator class not found. Make sure CountryTranslator.js is loaded!");
            
            // Create simple fallback translator
            this.translator = {
                getElement: (code) => document.getElementById(code),
                colorCountry: (code, color) => {
                    const el = document.getElementById(code);
                    if (el) {
                        el.style.fill = color;
                        return true;
                    }
                    return false;
                },
                resetAllColors: () => {
                    document.querySelectorAll('path, g').forEach(el => {
                        el.style.fill = '#f0f0f0';
                    });
                },
                getCountryInfo: (code) => ({ name: code })
            };
            return;
        }
        
        // Initialize the real translator
        this.translator = new CountryTranslator().initialize();
        console.log("✅ CountryTranslator initialized");
    }

    // Apply styling for a specific year
    applyYearStyling(year) {
        console.log(`🎨 Applying ${year} styling...`);
        
        if (!this.countryData) {
            console.error("❌ No country data available");
            return;
        }
        
        // Update current year
        this.currentYear = year;
        
        // Update UI elements
        this.updateYearDisplay(year);
        
        // Reset all colors first
        if (this.translator && this.translator.resetAllColors) {
            this.translator.resetAllColors();
        } else {
            // Fallback reset
            document.querySelectorAll('path, g').forEach(el => {
                el.style.fill = '#f0f0f0';
                el.style.stroke = '#999';
            });
        }
        
        // Apply new colors
        let coloredCount = 0;
        this.currentColors = {};
        
        this.countryData.countries.forEach(country => {
            let colored = false;
            
            if (this.translator && this.translator.colorCountry) {
                colored = this.translator.colorCountry(country.svg_id, country.color);
            } else {
                // Fallback coloring
                const element = document.getElementById(country.svg_id);
                if (element) {
                    element.style.fill = country.color;
                    element.style.stroke = '#333';
                    element.style.strokeWidth = '1px';
                    colored = true;
                }
            }
            
            if (colored) {
                coloredCount++;
                this.currentColors[country.svg_id] = country.color;
                
                // Store country data on element for interactions
                const element = this.translator?.getElement?.(country.svg_id) || document.getElementById(country.svg_id);
                if (element) {
                    element.dataset.countryName = country.name;
                    element.dataset.capital = country.capital;
                    element.dataset.ruler = country.ruler;
                    element.dataset.year = year;
                    element.dataset.notes = country.notes || '';
                    element.style.cursor = 'pointer';
                }
            }
        });
        
        console.log(`✅ Colored ${coloredCount} countries for ${year}`);
        
        // Update country list panel
        this.updateCountryList();
        
        // Setup hover interactions
        this.setupHoverInteractions();
    }

    // Update year display in UI
    updateYearDisplay(year) {
        const elements = {
            'current-year': year.toString(),
            'era-title': this.countryData?.title || 'Europe',
            'era-description': this.countryData?.description || 'Historical borders',
            'map-year': year.toString()
        };
        
        Object.entries(elements).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
            }
        });
        
        // Update slider if exists
        const yearSlider = document.getElementById('year-slider');
        if (yearSlider) {
            yearSlider.value = year;
        }
    }

    // Update country list panel
    updateCountryList() {
        const container = document.getElementById('country-list');
        if (!container || !this.countryData) return;
        
        const europeanCountries = this.countryData.countries.filter(c => 
            c.continent === 'europe' || !c.continent // Include all if no continent specified
        );
        
        container.innerHTML = `
            <div class="country-grid">
                ${europeanCountries.map(country => `
                    <div class="country-card" 
                         style="border-color: ${country.color}"
                         onclick="window.mapLoader?.showCountryDetails('${country.svg_id}')">
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

    // Setup hover interactions for countries
    setupHoverInteractions() {
        console.log("🖱️ Setting up hover interactions...");
        
        // Try to get all country elements
        const countryCodes = this.countryData?.countries?.map(c => c.svg_id) || [];
        
        countryCodes.forEach(code => {
            const element = this.translator?.getElement?.(code) || document.getElementById(code);
            if (!element) return;
            
            // Mouse enter - highlight
            element.addEventListener('mouseenter', (e) => {
                this.highlightCountry(element);
                this.showTooltip(element);
            });
            
            // Mouse leave - unhighlight
            element.addEventListener('mouseleave', (e) => {
                this.unhighlightCountry(element);
                this.hideTooltip();
            });
            
            // Click - show details
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showCountryDetails(code);
            });
        });
        
        console.log(`✅ Hover interactions setup for ${countryCodes.length} countries`);
    }

    // Highlight a country (hover effect)
    highlightCountry(element) {
        if (!element) return;
        
        // Store original values
        if (!element.dataset.originalFilter) {
            element.dataset.originalFilter = element.style.filter || 'none';
            element.dataset.originalZIndex = element.style.zIndex || '';
        }
        
        // Apply highlight
        element.style.filter = 'brightness(1.15) drop-shadow(0 0 4px rgba(0,0,0,0.2))';
        element.style.zIndex = '1000';
        element.style.strokeWidth = '2px';
        element.style.stroke = '#000';
    }

    // Remove highlight
    unhighlightCountry(element) {
        if (!element) return;
        
        // Restore original values
        element.style.filter = element.dataset.originalFilter || 'none';
        element.style.zIndex = element.dataset.originalZIndex || '';
        element.style.strokeWidth = '1px';
        element.style.stroke = '#333';
    }

    // Show tooltip for a country
    showTooltip(element) {
        if (!element || !element.dataset.countryName) return;
        
        // Create or get tooltip
        let tooltip = document.getElementById('chronomap-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'chronomap-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                pointer-events: none;
                z-index: 10000;
                max-width: 250px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.1);
                backdrop-filter: blur(5px);
                display: none;
            `;
            document.body.appendChild(tooltip);
        }
        
        // Set content
        tooltip.innerHTML = `
            <div style="font-weight: bold; color: #ffd700; margin-bottom: 5px;">
                ${element.dataset.countryName}
            </div>
            <div style="margin-bottom: 3px;"><strong>Ruler:</strong> ${element.dataset.ruler || 'Unknown'}</div>
            <div><strong>Capital:</strong> ${element.dataset.capital || 'Unknown'}</div>
            <div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">
                Click for details
            </div>
        `;
        
        // Position near cursor
        const updatePosition = (e) => {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY - tooltip.offsetHeight - 10) + 'px';
        };
        
        // Show tooltip
        tooltip.style.display = 'block';
        
        // Update position on mouse move
        const mouseMoveHandler = (e) => updatePosition(e);
        document.addEventListener('mousemove', mouseMoveHandler);
        
        // Store handler for cleanup
        element._tooltipHandler = mouseMoveHandler;
    }

    // Hide tooltip
    hideTooltip() {
        const tooltip = document.getElementById('chronomap-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
        
        // Clean up event listeners
        document.querySelectorAll('[data-country-name]').forEach(el => {
            if (el._tooltipHandler) {
                document.removeEventListener('mousemove', el._tooltipHandler);
                delete el._tooltipHandler;
            }
        });
    }

    // Show country details panel
    showCountryDetails(countryCode) {
        console.log(`📖 Showing details for: ${countryCode}`);
        
        // Find country data
        const country = this.countryData?.countries?.find(c => c.svg_id === countryCode);
        if (!country) {
            console.warn(`Country data not found for: ${countryCode}`);
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
                document.body.appendChild(detailsPanel);
            }
        }
        
        // Populate details
        detailsPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid rgba(40, 53, 147, 0.2);">
                <h2 style="margin: 0; color: ${country.color};">${country.name}</h2>
                <span style="background: linear-gradient(45deg, #283593, #5c6bc0); color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600;">
                    ${this.currentYear}
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">Ruler</div>
                    <div style="font-size: 1.1rem; color: #283593; font-weight: 600;">${country.ruler}</div>
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">Capital</div>
                    <div style="font-size: 1.1rem; color: #283593; font-weight: 600;">${country.capital}</div>
                </div>
                
                ${country.area ? `
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">Area</div>
                    <div style="font-size: 1.1rem; color: #283593; font-weight: 600;">${country.area}</div>
                </div>` : ''}
                
                ${country.population ? `
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">Population</div>
                    <div style="font-size: 1.1rem; color: #283593; font-weight: 600;">${country.population}</div>
                </div>` : ''}
                
                ${country.status ? `
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">Status</div>
                    <div style="font-size: 1.1rem; color: #283593; font-weight: 600;">${country.status}</div>
                </div>` : ''}
            </div>
            
            ${country.notes ? `
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <h3 style="color: #283593; margin-bottom: 10px;">Historical Context</h3>
                <p style="line-height: 1.6; color: #444;">${country.notes}</p>
            </div>` : ''}
            
            <div style="text-align: center;">
                <button onclick="document.getElementById('country-details').style.display='none'" 
                        style="padding: 12px 30px; background: #283593; color: white; 
                               border: none; border-radius: 6px; cursor: pointer; 
                               font-weight: bold; font-size: 1rem;">
                    Close Details
                </button>
            </div>
        `;
        
        // Show panel
        detailsPanel.style.display = 'block';
        
        // Scroll to details if needed
        detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Setup UI controls (slider, buttons)
    setupInteractions() {
        console.log("🎮 Setting up UI interactions...");
        
        // Make mapLoader globally available
        window.mapLoader = this;
        
        // Year slider
        const yearSlider = document.getElementById('year-slider');
        if (yearSlider) {
            let sliderTimeout;
            yearSlider.addEventListener('input', (e) => {
                const year = parseInt(e.target.value);
                
                // Update display immediately
                this.updateYearDisplay(year);
                
                // Debounce the actual map update
                clearTimeout(sliderTimeout);
                sliderTimeout = setTimeout(() => {
                    this.jumpToYear(year);
                }, 300);
            });
            console.log("✅ Year slider setup");
        }
        
        // Navigation buttons
        const setupButton = (id, action) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', action);
                return true;
            }
            return false;
        };
        
        setupButton('prev-decade', () => this.prevDecade());
        setupButton('next-decade', () => this.nextDecade());
        setupButton('jump-1800', () => this.jumpToYear(1800));
        
        console.log("✅ UI controls setup complete");
    }

    // Update UI controls state
    updateUIControls() {
        // Update slider labels
        const currentLabel = document.querySelector('.slider-current');
        if (currentLabel) {
            currentLabel.textContent = this.currentYear === 1800 ? 
                '1800 (Starting Point)' : this.currentYear.toString();
        }
        
        // Update button states based on current year
        const prevButton = document.getElementById('prev-decade');
        const nextButton = document.getElementById('next-decade');
        
        if (prevButton) {
            prevButton.disabled = this.currentYear <= 1400;
        }
        if (nextButton) {
            nextButton.disabled = this.currentYear >= 2025;
        }
    }

    // Show loading state
    showLoading(show) {
        this.isLoading = show;
        
        const loadingEl = document.querySelector('.loading');
        const mapContainer = document.getElementById('map-container');
        
        if (loadingEl) {
            loadingEl.style.display = show ? 'flex' : 'none';
        }
        
        if (mapContainer) {
            mapContainer.style.opacity = show ? '0.5' : '1';
            mapContainer.style.pointerEvents = show ? 'none' : 'auto';
        }
    }

    // Show error message
    showError(message) {
        console.error("ChronoMap Error:", message);
        
        const container = document.getElementById('map-container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #d32f2f; background: #ffebee; border-radius: 10px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                    <h3 style="margin-bottom: 20px;">⚠️ Error</h3>
                    <p style="margin-bottom: 25px; font-size: 1.1rem;">${message}</p>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button onclick="location.reload()" 
                                style="padding: 12px 25px; background: #283593; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                            🔄 Reload Page
                        </button>
                        <button onclick="console.clear(); console.log('Debug mode activated');" 
                                style="padding: 12px 25px; background: #666; color: white; border: none; border-radius: 6px; cursor: pointer;">
                            🐛 Debug Console
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // ================= PUBLIC API =================
    
    // Jump to specific year
    jumpToYear(year) {
        if (isNaN(year) || year < 1400 || year > 2025) {
            console.warn(`Invalid year: ${year}. Must be between 1400 and 2025.`);
            return;
        }
        
        console.log(`⏩ Jumping to year ${year}...`);
        
        // Find data for this year
        if (timelineData) {
            const newData = timelineData.find(item => item.year === year);
            if (newData) {
                this.countryData = newData;
                this.applyYearStyling(year);
                this.updateUIControls();
                return;
            }
        }
        
        // If no specific data for this year, just update the display
        this.currentYear = year;
        this.updateYearDisplay(year);
        this.updateUIControls();
        
        console.log(`✅ Jumped to ${year}`);
    }
    
    // Go to next decade
    nextDecade() {
        const nextYear = this.currentYear + 10;
        if (nextYear <= 2025) {
            this.jumpToYear(nextYear);
        }
    }
    
    // Go to previous decade
    prevDecade() {
        const prevYear = this.currentYear - 10;
        if (prevYear >= 1400) {
            this.jumpToYear(prevYear);
        }
    }
    
    // Debug function
    debug() {
        console.log("=== SVGMapLoader Debug Info ===");
        console.log("Current Year:", this.currentYear);
        console.log("Country Data:", this.countryData);
        console.log("Translator:", this.translator ? "✅ Initialized" : "❌ Not initialized");
        console.log("Current Colors:", this.currentColors);
        console.log("Timeline Data:", timelineData ? `✅ ${timelineData.length} periods` : "❌ Not loaded");
        
        // Check if SVG elements are found
        if (this.countryData?.countries) {
            console.log("\n🔍 Country Element Check:");
            this.countryData.countries.forEach(country => {
                const element = this.translator?.getElement?.(country.svg_id) || document.getElementById(country.svg_id);
                console.log(`${country.name} (${country.svg_id}): ${element ? '✅ Found' : '❌ Not found'}`);
            });
        }
    }
}

// Make globally available
window.SVGMapLoader = SVGMapLoader;
console.log("✅ SVGMapLoader v3.0 loaded. Use: const loader = new SVGMapLoader(); loader.initialize();");
