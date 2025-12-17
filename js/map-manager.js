class MapManager {
    constructor() {
        this.currentYear = 1800;
        this.timelineData = null;
        this.animationSpeed = 1000; // ms per year
        this.isPlaying = false;
        this.playInterval = null;
        
        this.init();
    }
    
    async init() {
        // Load the timeline data
        await this.loadTimelineData();
        
        // Load SVG map
        await this.loadSVGMap();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize to 1800
        this.updateMap(1800);
    }
    
    async loadTimelineData() {
        try {
            const response = await fetch('data/timeline.json');
            this.timelineData = await response.json();
            console.log('Timeline data loaded:', this.timelineData);
        } catch (error) {
            console.error('Error loading timeline data:', error);
            // Fallback data
            this.timelineData = {
                1800: { activeCountries: ["GB", "FR", "ES", "IT", "DE", "AT", "RU", "OT", "PR"] }
            };
        }
    }
    
    async loadSVGMap() {
        try {
            const response = await fetch('maps/world.svg');
            const svgText = await response.text();
            
            // Insert SVG into the map container
            const mapContainer = document.getElementById('map');
            mapContainer.innerHTML = svgText;
            
            // Add click handlers to all countries
            this.addCountryInteractivity();
            
        } catch (error) {
            console.error('Error loading SVG map:', error);
            document.getElementById('map').innerHTML = 
                '<p style="color: red; padding: 20px;">Error loading map. Check console.</p>';
        }
    }
    
    addCountryInteractivity() {
        // Add click and hover events to all countries
        document.querySelectorAll('.country').forEach(country => {
            country.addEventListener('click', (e) => {
                const countryId = e.target.id;
                const countryName = e.target.dataset.name || countryId;
                this.showCountryInfo(countryId, countryName);
            });
            
            country.addEventListener('mouseenter', (e) => {
                e.target.classList.add('highlight');
            });
            
            country.addEventListener('mouseleave', (e) => {
                e.target.classList.remove('highlight');
            });
        });
    }
    
    updateMap(year) {
        if (!this.timelineData || !this.timelineData[year]) {
            console.warn(`No data for year ${year}`);
            return;
        }
        
        this.currentYear = year;
        
        // Update year display
        document.getElementById('current-year').textContent = year;
        document.getElementById('year-slider').value = year;
        
        const yearData = this.timelineData[year];
        
        // Reset all countries to inactive state first
        document.querySelectorAll('.country').forEach(country => {
            country.classList.add('inactive');
            country.style.fill = '#f0f0f0';
        });
        
        // Activate and color countries for this year
        yearData.activeCountries.forEach(countryId => {
            const countryElement = document.getElementById(countryId);
            if (countryElement) {
                countryElement.classList.remove('inactive');
                
                // Apply color if defined
                if (yearData.colors && yearData.colors[countryId]) {
                    countryElement.style.fill = yearData.colors[countryId];
                }
            }
        });
        
        // Update historical event info
        this.updateHistoricalInfo(yearData);
        
        // Update key states list
        this.updateKeyStatesList(yearData.activeCountries);
    }
    
    updateHistoricalInfo(yearData) {
        const eventElement = document.getElementById('event-text');
        if (yearData.events && eventElement) {
            eventElement.innerHTML = yearData.events
                .map(event => `• ${event}`)
                .join('<br>');
        }
    }
    
    updateKeyStatesList(activeCountries) {
        const listElement = document.getElementById('key-states');
        if (!listElement) return;
        
        // Clear current list
        listElement.innerHTML = '';
        
        // Add active countries to list
        activeCountries.forEach(countryId => {
            const countryElement = document.getElementById(countryId);
            if (countryElement) {
                const countryName = countryElement.dataset.name || countryId;
                const countryColor = countryElement.style.fill || '#cccccc';
                
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="country-color" style="background-color: ${countryColor};"></span>
                    ${countryName}
                `;
                listElement.appendChild(li);
            }
        });
    }
    
    showCountryInfo(countryId, countryName) {
        alert(`Country: ${countryName}\nYear: ${this.currentYear}\nID: ${countryId}`);
        // In a real app, you'd show a modal with detailed info
    }
    
    setupEventListeners() {
        // Year slider
        const yearSlider = document.getElementById('year-slider');
        if (yearSlider) {
            yearSlider.addEventListener('input', (e) => {
                const year = parseInt(e.target.value);
                this.updateMap(year);
            });
        }
        
        // Play button
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.startAnimation());
        }
        
        // Pause button
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseAnimation());
        }
        
        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.updateMap(1800));
        }
        
        // Speed control
        const speedSlider = document.getElementById('speed-slider');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.animationSpeed = 2000 - (e.target.value * 180); // 200ms to 2000ms
                if (this.isPlaying) {
                    this.pauseAnimation();
                    this.startAnimation();
                }
            });
        }
    }
    
    startAnimation() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        document.getElementById('play-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;
        
        let year = this.currentYear;
        this.playInterval = setInterval(() => {
            year++;
            if (year > 2023) year = 1800; // Loop back to 1800
            
            this.updateMap(year);
            
        }, this.animationSpeed);
    }
    
    pauseAnimation() {
        this.isPlaying = false;
        clearInterval(this.playInterval);
        document.getElementById('play-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mapManager = new MapManager();
});
