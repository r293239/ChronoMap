// ============================================
// SVGMapLoader.js - Complete Fixed Version
// ChronoMap - Historical Map Visualization
// ============================================

class SVGMapLoader {
    constructor() {
        console.log("🗺️ SVGMapLoader initializing...");
        
        this.currentYear = 1800;
        this.currentData = null; // Current year's data
        this.allTimelineData = null; // All timeline data
        this.translator = null;
        this.isLoading = false;
        this.currentColors = {};
        this.availableYears = [];
        
        // Store country elements for quick access
        this.countryElements = new Map();
    }

    // Main initialization
    async initialize() {
        console.log("🚀 Starting ChronoMap initialization...");
        
        try {
            this.showLoading(true);
            
            // Step 1: Load all timeline data
            this.loadAllTimelineData();
            
            // Step 2: Load the world map
            await this.loadWorldMap();
            
            // Wait a bit for SVG to render
            await new Promise(resolve => setTimeout(resolve, 100));
            
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

    // Load ALL timeline data
    loadAllTimelineData() {
        console.log("📅 Loading ALL timeline data...");
        
        if (typeof timelineData === 'undefined') {
            console.error("❌ timelineData is not defined. Check if timeline.js is loaded.");
            
            // Create minimal data
            this.allTimelineData = [
                {
                    year: 1800,
                    title: "Europe in 1800",
                    description: "After the French Revolutionary Wars",
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
                },
                {
                    year: 1815,
                    title: "Congress of Vienna",
                    description: "Post-Napoleonic settlement",
                    countries: [
                        {
                            name: "Kingdom of France",
                            svg_id: "fr",
                            color: "#aec7e8",
                            capital: "Paris",
                            ruler: "Louis XVIII"
                        }
                    ]
                }
            ];
        } else {
            this.allTimelineData = timelineData;
        }
        
        // Extract available years
        this.availableYears = this.allTimelineData.map(d => d.year);
        console.log(`✅ Loaded ${this.allTimelineData.length} periods:`, this.availableYears);
    }

    // Load the world map SVG
    async loadWorldMap() {
        console.log("🌍 Loading world map...");
        
        const container = document.getElementById('map-container');
        if (!container) {
            throw new Error("Map container (#map-container) not found in HTML");
        }
        
        try {
            // Load world-map.svg
            const response = await fetch('maps/world-map.svg');
            
            if (response.ok) {
                const svgText = await response.text();
                
                if (svgText.includes('<svg') && svgText.includes('</svg>')) {
                    container.innerHTML = svgText;
                    console.log(`✅ SVG loaded successfully`);
                    
                    // Make SVG responsive
                    const svgElement = container.querySelector('svg');
                    if (svgElement) {
                        svgElement.style.width = '100%';
                        svgElement.style.height = '100%';
                    }
                    
                    // Store all country elements for quick access
                    this.cacheCountryElements();
                } else {
                    throw new Error("Invalid SVG file");
                }
            } else {
                throw new Error(`Failed to load: ${response.status}`);
            }
            
        } catch (error) {
            console.error("❌ Failed to load world map:", error);
            this.createFallbackMap();
        }
    }

    // Cache all country elements for quick access
    cacheCountryElements() {
        console.log("🔍 Caching country elements...");
        
        // Get all elements with country codes as IDs
        const countryCodes = ['fr', 'at', 'de', 'ru', 'tr', 'gb', 'es', 'pt', 'se', 'dk', 'it'];
        
        countryCodes.forEach(code => {
            const element = document.getElementById(code);
            if (element) {
                this.countryElements.set(code, element);
                console.log(`✅ Cached ${code}:`, {
                    tagName: element.tagName,
                    id: element.id,
                    children: element.children?.length || 0
                });
            } else {
                console.warn(`⚠️  ${code} not found in SVG`);
            }
        });
        
        console.log(`✅ Cached ${this.countryElements.size} country elements`);
    }

    // Initialize the country translator
    initializeTranslator() {
        console.log("🔄 Initializing CountryTranslator...");
        
        if (typeof CountryTranslator === 'undefined') {
            console.error("❌ CountryTranslator class not found!");
            
            // Use our cached elements instead
            console.log("⚠️ Using cached elements instead of translator");
            return;
        }
        
        try {
            this.translator = new CountryTranslator().initialize();
            console.log("✅ CountryTranslator initialized");
        } catch (error) {
            console.error("❌ Failed to initialize translator:", error);
            console.log("⚠️ Falling back to direct element coloring");
        }
    }

    // Apply styling for a specific year
    applyYearStyling(year) {
        console.log(`🎨 Applying ${year} styling...`);
        
        // Find data for this year
        const yearData = this.allTimelineData.find(d => d.year === year);
        if (!yearData) {
            console.error(`❌ No data found for year ${year}`);
            return;
        }
        
        this.currentYear = year;
        this.currentData = yearData;
        
        // Update UI elements
        this.updateYearDisplay(year);
        
        // Reset ALL elements to light gray first
        this.resetAllColors();
        
        // Apply colors for this year
        let coloredCount = 0;
        this.currentColors = {};
        
        yearData.countries.forEach(country => {
            if (this.colorCountryDirectly(country.svg_id, country.color)) {
                coloredCount++;
                this.currentColors[country.svg_id] = country.color;
                
                // Store country data on element
                const element = this.countryElements.get(country.svg_id);
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

    // Color a country directly (fallback method)
    colorCountryDirectly(countryCode, color) {
        // Try multiple methods
        let element = null;
        
        // 1. Try cached element
        element = this.countryElements.get(countryCode);
        
        // 2. Try translator
        if (!element && this.translator && this.translator.getElement) {
            element = this.translator.getElement(countryCode);
        }
        
        // 3. Try direct DOM lookup
        if (!element) {
            element = document.getElementById(countryCode);
        }
        
        if (element) {
            element.style.fill = color;
            element.style.stroke = '#333';
            element.style.strokeWidth = '1px';
            console.log(`🎨 Directly colored ${countryCode} with ${color}`);
            return true;
        }
        
        console.warn(`⚠️ Could not find element for ${countryCode}`);
        return false;
    }

    // Reset all colors to light gray
    resetAllColors() {
        console.log("🔄 Resetting all colors...");
        
        let resetCount = 0;
        
        // Reset all cached elements
        for (const [code, element] of this.countryElements) {
            if (element) {
                element.style.fill = '#f0f0f0';
                element.style.stroke = '#999';
                element.style.strokeWidth = '0.5px';
                resetCount++;
            }
        }
        
        // Also reset via translator if available
        if (this.translator && this.translator.resetAllColors) {
            this.translator.resetAllColors();
        }
        
        console.log(`✅ Reset ${resetCount} elements`);
    }

    // Update year display in UI
    updateYearDisplay(year) {
        const yearData = this.allTimelineData.find(d => d.year === year);
        
        const elements = {
            'current-year': year.toString(),
            'era-title': yearData?.title || 'Historical Map',
            'era-description': yearData?.description || 'Loading...',
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
        if (!container || !this.currentData) return;
        
        container.innerHTML = `
            <div style="margin-bottom: 15px; color: #666; font-size: 0.9rem;">
                Showing: ${this.currentData.year} - ${this.currentData.title}
            </div>
            <div class="country-grid">
                ${this.currentData.countries.map(country => `
                    <div class="country-card" 
                         style="border-color: ${country.color}"
                         onclick="window.mapLoader?.showCountryDetails('${country.svg_id}')">
                        <div class="country-color" style="background: ${country.color}"></div>
                        <div class="country-info">
                            <h4>${country.name}</h4>
                            <p><strong>Ruler:</strong> ${country.ruler}</p>
                            <p><strong>Capital:</strong> ${country.capital}</p>
                            ${country.area ? `<p><strong>Area:</strong> ${country.area}</p>` : ''}
                            ${country.notes ? `<p class="notes">${country.notes}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Setup hover interactions
    setupHoverInteractions() {
        console.log("🖱️ Setting up hover interactions...");
        
        // Remove old listeners first
        this.removeAllEventListeners();
        
        // Add new listeners to all country elements
        for (const [code, element] of this.countryElements) {
            if (!element) continue;
            
            // Mouse enter
            element.addEventListener('mouseenter', (e) => {
                this.highlightCountry(element);
                this.showTooltip(element);
            });
            
            // Mouse leave
            element.addEventListener('mouseleave', (e) => {
                this.unhighlightCountry(element);
                this.hideTooltip();
            });
            
            // Click
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showCountryDetails(code);
            });
        }
        
        console.log(`✅ Hover interactions setup for ${this.countryElements.size} countries`);
    }

    // Remove all event listeners
    removeAllEventListeners() {
        for (const [code, element] of this.countryElements) {
            if (!element) continue;
            
            // Clone and replace to remove all listeners
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            this.countryElements.set(code, newElement);
        }
    }

    // ================= YEAR NAVIGATION =================
    
    // Jump to specific year
    jumpToYear(year) {
        if (isNaN(year) || year < 1400 || year > 2025) {
            console.warn(`Invalid year: ${year}`);
            return;
        }
        
        // Find closest available year
        let targetYear = year;
        if (!this.availableYears.includes(year)) {
            // Find nearest available year
            const sortedYears = [...this.availableYears].sort((a, b) => a - b);
            for (const availableYear of sortedYears) {
                if (availableYear >= year) {
                    targetYear = availableYear;
                    break;
                }
            }
            if (targetYear === year) targetYear = this.availableYears[this.availableYears.length - 1];
            
            console.log(`📅 No data for ${year}, using ${targetYear} instead`);
        }
        
        console.log(`⏩ Jumping to ${targetYear}...`);
        this.applyYearStyling(targetYear);
        this.updateUIControls();
    }
    
    // Go to next available year
    nextYear() {
        const currentIndex = this.availableYears.indexOf(this.currentYear);
        if (currentIndex < this.availableYears.length - 1) {
            const nextYear = this.availableYears[currentIndex + 1];
            this.jumpToYear(nextYear);
        }
    }
    
    // Go to previous available year
    prevYear() {
        const currentIndex = this.availableYears.indexOf(this.currentYear);
        if (currentIndex > 0) {
            const prevYear = this.availableYears[currentIndex - 1];
            this.jumpToYear(prevYear);
        }
    }
    
    // Go to next decade
    nextDecade() {
        this.jumpToYear(this.currentYear + 10);
    }
    
    // Go to previous decade
    prevDecade() {
        this.jumpToYear(this.currentYear - 10);
    }

    // ================= UI CONTROLS =================
    
    setupInteractions() {
        console.log("🎮 Setting up UI interactions...");
        
        // Make mapLoader globally available
        window.mapLoader = this;
        
        // Year slider
        const yearSlider = document.getElementById('year-slider');
        if (yearSlider) {
            yearSlider.min = Math.min(...this.availableYears, 1400);
            yearSlider.max = Math.max(...this.availableYears, 2025);
            yearSlider.value = this.currentYear;
            
            let sliderTimeout;
            yearSlider.addEventListener('input', (e) => {
                const year = parseInt(e.target.value);
                this.updateYearDisplay(year);
                
                clearTimeout(sliderTimeout);
                sliderTimeout = setTimeout(() => {
                    this.jumpToYear(year);
                }, 300);
            });
        }
        
        // Navigation buttons
        document.getElementById('prev-decade')?.addEventListener('click', () => this.prevDecade());
        document.getElementById('next-decade')?.addEventListener('click', () => this.nextDecade());
        document.getElementById('jump-1800')?.addEventListener('click', () => this.jumpToYear(1800));
        document.getElementById('prev-year')?.addEventListener('click', () => this.prevYear());
        document.getElementById('next-year')?.addEventListener('click', () => this.nextYear());
        
        console.log("✅ UI controls setup complete");
    }

    updateUIControls() {
        // Update slider current label
        const currentLabel = document.querySelector('.slider-current');
        if (currentLabel) {
            currentLabel.textContent = `${this.currentYear}`;
        }
        
        // Update available years display
        const yearsList = document.getElementById('available-years');
        if (yearsList) {
            yearsList.innerHTML = this.availableYears.map(year => 
                `<button onclick="mapLoader.jumpToYear(${year})" 
                        class="${year === this.currentYear ? 'active' : ''}">
                    ${year}
                </button>`
            ).join('');
        }
        
        // Update button states
        const prevYearBtn = document.getElementById('prev-year');
        const nextYearBtn = document.getElementById('next-year');
        const currentIndex = this.availableYears.indexOf(this.currentYear);
        
        if (prevYearBtn) {
            prevYearBtn.disabled = currentIndex <= 0;
        }
        if (nextYearBtn) {
            nextYearBtn.disabled = currentIndex >= this.availableYears.length - 1;
        }
    }

    // ================= TOOLTIP & DETAILS =================
    
    highlightCountry(element) {
        if (!element) return;
        element.style.filter = 'brightness(1.15)';
        element.style.strokeWidth = '2px';
    }

    unhighlightCountry(element) {
        if (!element) return;
        element.style.filter = 'none';
        element.style.strokeWidth = '1px';
    }

    showTooltip(element) {
        if (!element || !element.dataset.countryName) return;
        
        const tooltip = document.getElementById('chronomap-tooltip') || 
                       this.createTooltip();
        
        tooltip.innerHTML = `
            <strong>${element.dataset.countryName}</strong><br>
            ${element.dataset.ruler || ''}<br>
            <small>Click for details</small>
        `;
        
        tooltip.style.display = 'block';
        this.positionTooltip(element, tooltip);
    }

    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'chronomap-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            display: none;
            pointer-events: none;
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    }

    positionTooltip(element, tooltip) {
        const rect = element.getBoundingClientRect();
        tooltip.style.left = (rect.left + window.scrollX) + 'px';
        tooltip.style.top = (rect.top + window.scrollY - 40) + 'px';
    }

    hideTooltip() {
        const tooltip = document.getElementById('chronomap-tooltip');
        if (tooltip) tooltip.style.display = 'none';
    }

    showCountryDetails(countryCode) {
        const country = this.currentData?.countries?.find(c => c.svg_id === countryCode);
        if (!country) return;
        
        let detailsPanel = document.getElementById('country-details');
        if (!detailsPanel) {
            detailsPanel = document.createElement('div');
            detailsPanel.id = 'country-details';
            document.querySelector('.info-section')?.appendChild(detailsPanel) || 
            document.body.appendChild(detailsPanel);
        }
        
        detailsPanel.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: ${country.color};">${country.name}</h3>
                    <span style="background: #283593; color: white; padding: 4px 12px; border-radius: 12px;">
                        ${this.currentYear}
                    </span>
                </div>
                <p><strong>Ruler:</strong> ${country.ruler}</p>
                <p><strong>Capital:</strong> ${country.capital}</p>
                ${country.area ? `<p><strong>Area:</strong> ${country.area}</p>` : ''}
                ${country.notes ? `<p><strong>Notes:</strong> ${country.notes}</p>` : ''}
                <button onclick="document.getElementById('country-details').remove()" 
                        style="margin-top: 15px; padding: 8px 16px; background: #283593; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
    }

    // ================= UTILITIES =================
    
    showLoading(show) {
        const loadingEl = document.querySelector('.loading');
        if (loadingEl) {
            loadingEl.style.display = show ? 'flex' : 'none';
        }
    }

    showError(message) {
        console.error("ChronoMap Error:", message);
        alert("Error: " + message);
    }

    debug() {
        console.log("=== SVGMapLoader Debug ===");
        console.log("Current Year:", this.currentYear);
        console.log("Available Years:", this.availableYears);
        console.log("Cached Elements:", this.countryElements.size);
        console.log("Current Data:", this.currentData);
        console.log("Translator:", this.translator ? "✅" : "❌");
    }
}

// Make globally available
window.SVGMapLoader = SVGMapLoader;
console.log("✅ SVGMapLoader loaded with multi-year support!");
