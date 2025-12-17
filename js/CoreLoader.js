// js/CoreLoader.js - Main application controller
class ChronoMapCore {
    constructor() {
        console.log('🔄 ChronoMapCore: Initializing...');
        
        // Core modules
        this.mapManager = null;
        this.timelineData = null;
        this.ui = null;
        
        // Application state
        this.state = {
            currentYear: 1800,
            isLoading: true,
            debugMode: false,
            availableYears: [],
            currentView: 'countries'
        };
        
        // Initialize modules
        this.initializeModules();
    }
    
    initializeModules() {
        console.log('📦 Loading modules...');
        
        // Check if all required modules are available
        const requiredModules = ['MapManager', 'TimelineData', 'UIInteractions'];
        const missingModules = [];
        
        requiredModules.forEach(module => {
            if (typeof window[module] === 'undefined') {
                missingModules.push(module);
            }
        });
        
        if (missingModules.length > 0) {
            throw new Error(`Missing modules: ${missingModules.join(', ')}`);
        }
        
        // Initialize modules
        this.timelineData = new TimelineData();
        this.mapManager = new MapManager(this.timelineData);
        this.ui = new UIInteractions(this);
        
        console.log('✅ All modules loaded');
    }
    
    async initialize() {
        console.log('🚀 Starting ChronoMap application...');
        
        try {
            this.setState({ isLoading: true });
            
            // Update status
            this.updateStatus('Loading timeline data...');
            
            // Load timeline data
            await this.timelineData.load();
            this.state.availableYears = this.timelineData.getAvailableYears();
            
            // Update status
            this.updateStatus('Loading map...');
            
            // Load and initialize map
            await this.mapManager.initialize();
            
            // Update status
            this.updateStatus('Setting up UI...');
            
            // Setup UI interactions
            this.ui.initialize();
            
            // Apply initial year
            this.jumpToYear(1800);
            
            // Update status
            this.updateStatus('Ready');
            this.setState({ isLoading: false });
            
            console.log('✅ ChronoMap application initialized successfully');
            
            // Debug info
            if (this.state.debugMode) {
                this.debug();
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.updateStatus(`Error: ${error.message}`);
            this.showError(error.message);
        }
    }
    
    jumpToYear(year) {
        console.log(`⏩ Jumping to year ${year}...`);
        
        // Validate year
        year = parseInt(year);
        if (isNaN(year) || year < 1400 || year > 2025) {
            console.warn(`Invalid year: ${year}`);
            return;
        }
        
        // Update state
        this.setState({ currentYear: year });
        
        // Update map
        this.mapManager.applyYearStyling(year);
        
        // Update UI
        this.ui.updateYearDisplay(year);
        
        // Update timeline data display
        this.ui.updateCountryList(year);
        
        console.log(`✅ Jumped to ${year}`);
    }
    
    setState(newState) {
        Object.assign(this.state, newState);
        
        // Update UI based on state changes
        if (this.ui) {
            this.ui.updateFromState(this.state);
        }
    }
    
    updateStatus(message) {
        const statusElement = document.getElementById('app-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
        console.log(`📊 Status: ${message}`);
    }
    
    showError(message) {
        const container = document.getElementById('map-container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #e74c3c;">
                    <h3>Application Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" 
                            style="margin-top: 20px; padding: 10px 20px; 
                                   background: #e74c3c; color: white; 
                                   border: none; border-radius: 4px; cursor: pointer;">
                        Reload Application
                    </button>
                </div>
            `;
        }
    }
    
    debug() {
        console.log('=== ChronoMap Debug Info ===');
        console.log('State:', this.state);
        console.log('Available Years:', this.state.availableYears);
        console.log('Map Manager:', this.mapManager ? '✅ Loaded' : '❌ Missing');
        console.log('Timeline Data:', this.timelineData ? '✅ Loaded' : '❌ Missing');
        console.log('UI:', this.ui ? '✅ Loaded' : '❌ Missing');
    }
    
    // Public API methods
    getCurrentYear() {
        return this.state.currentYear;
    }
    
    getAvailableYears() {
        return this.state.availableYears;
    }
    
    getMapManager() {
        return this.mapManager;
    }
    
    getTimelineData() {
        return this.timelineData;
    }
}

// Make globally available
window.ChronoMapCore = ChronoMapCore;
console.log('✅ ChronoMapCore module loaded');
