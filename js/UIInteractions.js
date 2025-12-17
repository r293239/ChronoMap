// js/UIInteractions.js - Handles all UI interactions and updates
class UIInteractions {
    constructor(appCore) {
        console.log('🎮 UIInteractions: Initializing...');
        
        this.app = appCore;
        this.mapManager = appCore.mapManager;
        this.timelineData = appCore.timelineData;
        
        // UI State
        this.state = {
            activeTab: 'countries',
            isFullscreen: false,
            debugMode: false,
            tooltipEnabled: true
        };
        
        // Bind methods
        this.handleYearChange = this.handleYearChange.bind(this);
        this.handleCountryClick = this.handleCountryClick.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }
    
    initialize() {
        console.log('🎮 Setting up UI interactions...');
        
        try {
            // Setup all UI event listeners
            this.setupYearControls();
            this.setupTabControls();
            this.setupMapTools();
            this.setupFooterControls();
            this.setupKeyboardShortcuts();
            
            // Listen for custom events
            this.setupEventListeners();
            
            // Initialize UI state
            this.updateUIFromAppState();
            
            console.log('✅ UI interactions setup complete');
            
        } catch (error) {
            console.error('❌ Failed to setup UI interactions:', error);
        }
    }
    
    setupYearControls() {
        console.log('📅 Setting up year controls...');
        
        // Year slider
        const yearSlider = document.getElementById('year-slider');
        if (yearSlider) {
            yearSlider.min = Math.min(...this.timelineData.availableYears, 1400);
            yearSlider.max = Math.max(...this.timelineData.availableYears, 2025);
            yearSlider.value = this.app.state.currentYear;
            
            let sliderTimeout;
            yearSlider.addEventListener('input', (e) => {
                const year = parseInt(e.target.value);
                
                // Update display immediately
                this.updateYearDisplay(year);
                
                // Debounce the actual jump
                clearTimeout(sliderTimeout);
                sliderTimeout = setTimeout(() => {
                    this.app.jumpToYear(year);
                }, 300);
            });
        }
        
        // Navigation buttons
        this.setupButton('prev-century', () => this.app.jumpToYear(this.app.state.currentYear - 100));
        this.setupButton('prev-decade', () => this.app.jumpToYear(this.app.state.currentYear - 10));
        this.setupButton('next-decade', () => this.app.jumpToYear(this.app.state.currentYear + 10));
        this.setupButton('next-century', () => this.app.jumpToYear(this.app.state.currentYear + 100));
        this.setupButton('jump-1800', () => this.app.jumpToYear(1800));
        
        // Quick jump buttons
        document.querySelectorAll('.jump-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const year = parseInt(e.target.dataset.year);
                this.app.jumpToYear(year);
                
                // Update active state
                document.querySelectorAll('.jump-btn').forEach(btn => 
                    btn.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    setupButton(buttonId, handler) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', handler);
            return true;
        }
        return false;
    }
    
    setupTabControls() {
        console.log('📑 Setting up tab controls...');
        
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.handleTabChange(tabId);
            });
        });
        
        // Initialize first tab as active
        if (tabButtons.length > 0) {
            const firstTab = tabButtons[0].dataset.tab;
            this.handleTabChange(firstTab);
        }
    }
    
    handleTabChange(tabId) {
        console.log(`📑 Switching to tab: ${tabId}`);
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });
        
        // Show active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}-tab`);
        });
        
        // Update tab-specific content
        switch (tabId) {
            case 'countries':
                this.updateCountryList(this.app.state.currentYear);
                break;
            case 'timeline':
                this.updateTimelineView();
                break;
            case 'details':
                this.updateDetailsView();
                break;
            case 'data':
                this.updateDataView();
                break;
        }
        
        this.state.activeTab = tabId;
    }
    
    setupMapTools() {
        console.log('🛠️ Setting up map tools...');
        
        // Zoom controls
        this.setupButton('zoom-in', () => this.mapManager.zoomIn());
        this.setupButton('zoom-out', () => this.mapManager.zoomOut());
        this.setupButton('reset-view', () => this.mapManager.resetZoom());
        
        // Border toggle
        this.setupButton('toggle-borders', () => this.toggleBorders());
        
        // Fullscreen toggle
        const fullscreenBtn = document.getElementById('fullscreen-toggle');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFullscreen();
            });
        }
    }
    
    setupFooterControls() {
        console.log('👣 Setting up footer controls...');
        
        // Export data
        this.setupButton('export-data', () => this.exportData());
        
        // Debug mode toggle
        this.setupButton('toggle-debug', () => this.toggleDebugMode());
    }
    
    setupKeyboardShortcuts() {
        console.log('⌨️ Setting up keyboard shortcuts...');
        
        document.addEventListener('keydown', (e) => {
            // Don't trigger if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.app.jumpToYear(this.app.state.currentYear - 10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.app.jumpToYear(this.app.state.currentYear + 10);
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    this.mapManager.zoomIn();
                    break;
                case '-':
                case '_':
                    e.preventDefault();
                    this.mapManager.zoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    this.mapManager.resetZoom();
                    break;
                case 'd':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.toggleDebugMode();
                    }
                    break;
                case 'f':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.toggleFullscreen();
                    }
                    break;
            }
        });
    }
    
    setupEventListeners() {
        // Listen for country selection events from MapManager
        document.addEventListener('countrySelected', (e) => {
            this.handleCountryClick(e.detail);
        });
        
        // Listen for app state changes
        document.addEventListener('appStateChanged', () => {
            this.updateUIFromAppState();
        });
    }
    
    handleYearChange(year) {
        this.app.jumpToYear(year);
    }
    
    handleCountryClick(countryData) {
        console.log(`📍 UI: Handling country click for ${countryData.countryName}`);
        
        // Switch to details tab
        this.handleTabChange('details');
        
        // Update details view
        this.updateCountryDetails(countryData);
        
        // Highlight the country in the list
        this.highlightCountryInList(countryData.countryCode);
    }
    
    updateUIFromAppState() {
        const state = this.app.state;
        
        // Update current year display
        this.updateYearDisplay(state.currentYear);
        
        // Update slider
        const yearSlider = document.getElementById('year-slider');
        if (yearSlider) {
            yearSlider.value = state.currentYear;
        }
        
        // Update current year label
        const currentLabel = document.getElementById('current-year-label');
        if (currentLabel) {
            currentLabel.textContent = state.currentYear;
        }
        
        // Update map year
        const mapYear = document.getElementById('map-year');
        if (mapYear) {
            mapYear.textContent = state.currentYear;
        }
        
        // Update navigation button states
        this.updateNavigationButtons();
        
        // Update active tab content if needed
        if (this.state.activeTab === 'countries') {
            this.updateCountryList(state.currentYear);
        }
    }
    
    updateYearDisplay(year) {
        // Update main year display
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = year;
        }
        
        // Update header badge
        const yearBadge = document.getElementById('current-year-display');
        if (yearBadge) {
            yearBadge.textContent = year;
        }
        
        // Update map year
        const mapYear = document.getElementById('map-year');
        if (mapYear) {
            mapYear.textContent = year;
        }
    }
    
    updateCountryList(year) {
        const countryList = document.getElementById('country-list');
        if (!countryList) return;
        
        const yearData = this.timelineData.getYearData(year);
        if (!yearData) {
            countryList.innerHTML = '<p>No data available for this year</p>';
            return;
        }
        
        let html = `
            <div class="year-header">
                <h4>${yearData.title}</h4>
                <p class="year-description">${yearData.description}</p>
            </div>
            <div class="countries-grid">
        `;
        
        yearData.countries.forEach(country => {
            html += `
                <div class="country-card" 
                     data-country="${country.svg_id}"
                     style="border-color: ${country.color}">
                    <div class="country-header">
                        <span class="country-name">${country.name}</span>
                        <span class="country-year">${year}</span>
                    </div>
                    <div class="country-info">
                        <p><strong>Ruler:</strong> ${country.ruler}</p>
                        <p><strong>Capital:</strong> ${country.capital}</p>
                        ${country.area ? `<p><strong>Area:</strong> ${country.area}</p>` : ''}
                        ${country.population ? `<p><strong>Population:</strong> ${country.population}</p>` : ''}
                    </div>
                    <div class="country-actions">
                        <button class="btn-small" onclick="window.ChronoMap.ui.showCountryOnMap('${country.svg_id}')">
                            Show on Map
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        countryList.innerHTML = html;
        
        // Add click handlers to country cards
        this.addCountryCardInteractions();
    }
    
    addCountryCardInteractions() {
        document.querySelectorAll('.country-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on a button inside the card
                if (e.target.tagName === 'BUTTON') return;
                
                const countryCode = card.dataset.country;
                const year = this.app.state.currentYear;
                const countryData = this.timelineData.getCountryData(year, countryCode);
                
                if (countryData) {
                    this.handleCountryClick({
                        countryCode: countryCode,
                        countryName: countryData.name,
                        year: year,
                        ...countryData
                    });
                }
            });
        });
    }
    
    updateCountryDetails(countryData) {
        const detailsView = document.getElementById('country-details');
        if (!detailsView) return;
        
        const yearData = this.timelineData.getYearData(countryData.year);
        const country = yearData?.countries.find(c => c.svg_id === countryData.countryCode);
        
        if (!country) {
            detailsView.innerHTML = '<p>Country data not found</p>';
            return;
        }
        
        detailsView.innerHTML = `
            <div class="details-header" style="border-color: ${country.color}">
                <h3>${country.name}</h3>
                <div class="details-year">${countryData.year}</div>
            </div>
            <div class="details-content">
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Ruler</span>
                        <span class="detail-value">${country.ruler}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Capital</span>
                        <span class="detail-value">${country.capital}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status</span>
                        <span class="detail-value">${country.status || 'Unknown'}</span>
                    </div>
                    ${country.area ? `
                    <div class="detail-item">
                        <span class="detail-label">Area</span>
                        <span class="detail-value">${country.area}</span>
                    </div>` : ''}
                    ${country.population ? `
                    <div class="detail-item">
                        <span class="detail-label">Population</span>
                        <span class="detail-value">${country.population}</span>
                    </div>` : ''}
                </div>
                ${country.notes ? `
                <div class="details-notes">
                    <h4>Historical Context</h4>
                    <p>${country.notes}</p>
                </div>` : ''}
                <div class="details-actions">
                    <button class="btn-primary" onclick="window.ChronoMap.ui.highlightCountryOnMap('${country.svg_id}')">
                        Highlight on Map
                    </button>
                    <button class="btn-secondary" onclick="window.ChronoMap.ui.compareWithOtherYears('${country.svg_id}')">
                        Compare Years
                    </button>
                </div>
            </div>
        `;
    }
    
    updateTimelineView() {
        const timelineView = document.getElementById('timeline-view');
        if (!timelineView) return;
        
        const periods = this.timelineData.data;
        
        let html = '<div class="timeline-container">';
        
        periods.forEach(period => {
            html += `
                <div class="timeline-period ${period.year === this.app.state.currentYear ? 'active' : ''}"
                     onclick="window.ChronoMap.jumpToYear(${period.year})">
                    <div class="timeline-year">${period.year}</div>
                    <div class="timeline-content">
                        <h5>${period.title}</h5>
                        <p>${period.description}</p>
                        <small>${period.countries.length} countries</small>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        timelineView.innerHTML = html;
    }
    
    updateDataView() {
        const dataView = document.getElementById('data-view');
        if (!dataView) return;
        
        const stats = this.timelineData.getStatistics();
        
        dataView.innerHTML = `
            <div class="data-stats">
                <h4>Dataset Statistics</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Total Periods</span>
                        <span class="stat-value">${stats.totalPeriods}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Countries</span>
                        <span class="stat-value">${stats.totalCountries}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Year Range</span>
                        <span class="stat-value">${stats.yearRange.min} - ${stats.yearRange.max}</span>
                    </div>
                </div>
            </div>
            <div class="data-actions">
                <h4>Data Management</h4>
                <button class="btn-secondary" onclick="window.ChronoMap.ui.exportData('json')">
                    Export as JSON
                </button>
                <button class="btn-secondary" onclick="window.ChronoMap.ui.exportData('csv')">
                    Export as CSV
                </button>
                <button class="btn-secondary" onclick="window.ChronoMap.ui.addCustomYear()">
                    Add Custom Year
                </button>
            </div>
            ${this.state.debugMode ? `
            <div class="debug-panel">
                <h4>Debug Information</h4>
                <pre id="debug-output"></pre>
                <button class="btn-small" onclick="window.ChronoMap.debug()">
                    Show Debug Info
                </button>
            </div>` : ''}
        `;
    }
    
    updateNavigationButtons() {
        const currentYear = this.app.state.currentYear;
        const availableYears = this.timelineData.availableYears;
        const currentIndex = availableYears.indexOf(currentYear);
        
        // Update century buttons
        const prevCenturyBtn = document.getElementById('prev-century');
        const nextCenturyBtn = document.getElementById('next-century');
        
        if (prevCenturyBtn) {
            prevCenturyBtn.disabled = currentYear <= 1400;
        }
        if (nextCenturyBtn) {
            nextCenturyBtn.disabled = currentYear >= 2025;
        }
        
        // Update decade buttons
        const prevDecadeBtn = document.getElementById('prev-decade');
        const nextDecadeBtn = document.getElementById('next-decade');
        
        if (prevDecadeBtn) {
            prevDecadeBtn.disabled = currentIndex <= 0;
        }
        if (nextDecadeBtn) {
            nextDecadeBtn.disabled = currentIndex >= availableYears.length - 1;
        }
    }
    
    highlightCountryInList(countryCode) {
        // Remove highlight from all cards
        document.querySelectorAll('.country-card').forEach(card => {
            card.classList.remove('highlighted');
        });
        
        // Highlight the selected country
        const selectedCard = document.querySelector(`.country-card[data-country="${countryCode}"]`);
        if (selectedCard) {
            selectedCard.classList.add('highlighted');
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    showCountryOnMap(countryCode) {
        const element = document.getElementById(countryCode);
        if (element) {
            // Scroll map to show the country
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight the country
            this.mapManager.highlightCountry(element);
            
            // Show tooltip
            setTimeout(() => {
                this.mapManager.showTooltip(element);
            }, 500);
        }
    }
    
    highlightCountryOnMap(countryCode) {
        const element = document.getElementById(countryCode);
        if (element) {
            // Add pulsing animation
            element.style.animation = 'pulse 1s infinite';
            
            // Remove animation after 3 seconds
            setTimeout(() => {
                element.style.animation = '';
            }, 3000);
        }
    }
    
    compareWithOtherYears(countryCode) {
        console.log(`🔍 Comparing ${countryCode} across years...`);
        
        // This would open a comparison view in a real implementation
        alert(`Comparison feature for ${countryCode} would show here.\nThis would display how the country changed across different years.`);
    }
    
    exportData(format = 'json') {
        const data = this.timelineData.exportData(format);
        
        // Create download link
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `chronomap-data-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`✅ Exported data as ${format}`);
    }
    
    addCustomYear() {
        const year = prompt('Enter year for new period:');
        if (!year || isNaN(year)) return;
        
        const title = prompt('Enter title for this period:');
        if (!title) return;
        
        const description = prompt('Enter description:');
        
        // Create new period with sample data
        const newPeriod = {
            year: parseInt(year),
            title: title,
            description: description || '',
            countries: [
                {
                    name: "Sample Country",
                    svg_id: "fr",
                    color: "#1f77b4",
                    capital: "Capital City",
                    ruler: "Sample Ruler",
                    notes: "Added via custom year feature"
                }
            ]
        };
        
        this.timelineData.addHistoricalPeriod(newPeriod);
        alert(`Added period for year ${year}. Refresh the timeline view to see it.`);
    }
    
    toggleBorders() {
        const bordersEnabled = document.body.classList.toggle('show-borders');
        console.log(`Borders ${bordersEnabled ? 'enabled' : 'disabled'}`);
        
        // Update button text
        const borderBtn = document.getElementById('toggle-borders');
        if (borderBtn) {
            borderBtn.textContent = bordersEnabled ? 'Hide Borders' : 'Show Borders';
        }
    }
    
    toggleFullscreen() {
        const elem = document.documentElement;
        
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
                this.state.isFullscreen = true;
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                this.state.isFullscreen = false;
            }
        }
    }
    
    toggleDebugMode() {
        this.state.debugMode = !this.state.debugMode;
        document.body.classList.toggle('debug-mode', this.state.debugMode);
        
        console.log(`Debug mode ${this.state.debugMode ? 'enabled' : 'disabled'}`);
        
        if (this.state.debugMode) {
            this.showDebugInfo();
        }
    }
    
    showDebugInfo() {
        const debugOutput = document.getElementById('debug-output');
        if (debugOutput) {
            debugOutput.textContent = JSON.stringify({
                appState: this.app.state,
                uiState: this.state,
                timelineStats: this.timelineData.getStatistics(),
                mapInfo: {
                    cachedCountries: this.mapManager.countryElements.size,
                    currentColors: Array.from(this.mapManager.currentColors.entries())
                }
            }, null, 2);
        }
    }
    
    // Public API methods
    getState() {
        return this.state;
    }
    
    updateFromState(appState) {
        // Update UI based on app state changes
        this.updateUIFromAppState();
    }
}

// Make globally available
window.UIInteractions = UIInteractions;
console.log('✅ UIInteractions module loaded');
