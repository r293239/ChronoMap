// js/TimelineData.js - Historical timeline data management
class TimelineData {
    constructor() {
        console.log('📊 TimelineData: Initializing...');
        
        this.data = [];
        this.currentYear = 1800;
        this.availableYears = [];
        
        // Load initial data
        this.loadInitialData();
    }
    
    loadInitialData() {
        console.log('📅 Loading initial timeline data...');
        
        // Core timeline data structure
        this.data = [
            {
                year: 1800,
                title: "Europe in 1800",
                description: "After the French Revolutionary Wars, before Napoleon's major conquests",
                era: "Napoleonic",
                countries: [
                    {
                        name: "French Republic",
                        svg_id: "fr",
                        color: "#1f77b4",
                        capital: "Paris",
                        ruler: "Napoleon Bonaparte (First Consul)",
                        notes: "Revolutionary state, expanding under Napoleon's leadership",
                        area: "550,000 km²",
                        population: "29 million",
                        status: "Revolutionary Republic"
                    },
                    {
                        name: "Austrian Empire",
                        svg_id: "at",
                        color: "#ff7f0e",
                        capital: "Vienna",
                        ruler: "Francis II",
                        notes: "Habsburg monarchy, leader of anti-French coalition",
                        area: "698,700 km²",
                        population: "21 million",
                        status: "Empire"
                    },
                    {
                        name: "Kingdom of Prussia",
                        svg_id: "de",
                        color: "#2ca02c",
                        capital: "Berlin",
                        ruler: "Frederick William III",
                        notes: "Major German power, modernizing state",
                        area: "300,000 km²",
                        population: "9.7 million",
                        status: "Kingdom"
                    },
                    {
                        name: "Russian Empire",
                        svg_id: "ru",
                        color: "#d62728",
                        capital: "Saint Petersburg",
                        ruler: "Paul I",
                        notes: "Largest country in the world, absolute monarchy",
                        area: "16.8 million km²",
                        population: "40 million",
                        status: "Empire"
                    },
                    {
                        name: "Ottoman Empire",
                        svg_id: "tr",
                        color: "#9467bd",
                        capital: "Constantinople",
                        ruler: "Selim III",
                        notes: "Declining empire, controlled Balkans",
                        area: "2.4 million km²",
                        population: "25 million",
                        status: "Empire"
                    },
                    {
                        name: "United Kingdom",
                        svg_id: "gb",
                        color: "#8c564b",
                        capital: "London",
                        ruler: "George III",
                        notes: "Constitutional monarchy, naval superpower",
                        area: "230,000 km²",
                        population: "16 million",
                        status: "Kingdom"
                    },
                    {
                        name: "Kingdom of Spain",
                        svg_id: "es",
                        color: "#e377c2",
                        capital: "Madrid",
                        ruler: "Charles IV",
                        notes: "Bourbon monarchy, colonial empire in decline",
                        area: "510,000 km²",
                        population: "11.5 million",
                        status: "Kingdom"
                    },
                    {
                        name: "Kingdom of Portugal",
                        svg_id: "pt",
                        color: "#7f7f7f",
                        capital: "Lisbon",
                        ruler: "Maria I",
                        notes: "Braganza dynasty, British ally",
                        area: "92,000 km²",
                        population: "3.1 million",
                        status: "Kingdom"
                    },
                    {
                        name: "Kingdom of Sweden",
                        svg_id: "se",
                        color: "#17becf",
                        capital: "Stockholm",
                        ruler: "Gustav IV Adolf",
                        notes: "Will lose Finland to Russia in 1809",
                        area: "450,000 km²",
                        population: "2.3 million",
                        status: "Kingdom"
                    },
                    {
                        name: "Denmark-Norway",
                        svg_id: "dk",
                        color: "#bcbd22",
                        capital: "Copenhagen",
                        ruler: "Christian VII",
                        notes: "Personal union of Denmark and Norway",
                        area: "487,000 km²",
                        population: "1.9 million",
                        status: "Dual Monarchy"
                    },
                    {
                        name: "Italian States",
                        svg_id: "it",
                        color: "#ff9896",
                        capital: "Various",
                        ruler: "Multiple rulers",
                        notes: "Collection of small states and kingdoms",
                        area: "Varies",
                        population: "18 million",
                        status: "Various"
                    }
                ]
            },
            {
                year: 1815,
                title: "Congress of Vienna",
                description: "Post-Napoleonic European settlement",
                era: "Restoration",
                countries: [
                    {
                        name: "Kingdom of France",
                        svg_id: "fr",
                        color: "#aec7e8",
                        capital: "Paris",
                        ruler: "Louis XVIII",
                        notes: "Bourbon Restoration, constitutional monarchy",
                        area: "560,000 km²",
                        population: "30 million",
                        status: "Kingdom"
                    },
                    {
                        name: "United Kingdom of the Netherlands",
                        svg_id: "nl",
                        color: "#ffbb78",
                        capital: "Amsterdam",
                        ruler: "William I",
                        notes: "Created at Congress of Vienna",
                        area: "33,000 km²",
                        population: "5.4 million",
                        status: "Kingdom"
                    }
                ]
            },
            {
                year: 1914,
                title: "World War I Begins",
                description: "Start of the Great War",
                era: "World Wars",
                countries: [
                    {
                        name: "German Empire",
                        svg_id: "de",
                        color: "#2ca02c",
                        capital: "Berlin",
                        ruler: "Wilhelm II",
                        notes: "Central Power in World War I",
                        area: "541,000 km²",
                        population: "67 million",
                        status: "Empire"
                    },
                    {
                        name: "French Third Republic",
                        svg_id: "fr",
                        color: "#1f77b4",
                        capital: "Paris",
                        ruler: "Raymond Poincaré",
                        notes: "Allied Power in World War I",
                        area: "551,000 km²",
                        population: "39 million",
                        status: "Republic"
                    }
                ]
            }
        ];
        
        // Extract available years
        this.availableYears = this.data.map(period => period.year);
        this.currentYear = this.availableYears[0];
        
        console.log(`✅ Loaded ${this.data.length} historical periods`);
        console.log(`📅 Available years: ${this.availableYears.join(', ')}`);
    }
    
    async load() {
        console.log('📊 Loading timeline data...');
        // In a production app, this would load from an API or JSON file
        // For now, we use the embedded data
        return Promise.resolve(true);
    }
    
    getYearData(year) {
        return this.data.find(period => period.year === year) || null;
    }
    
    getAvailableYears() {
        return this.availableYears;
    }
    
    getCurrentYearData() {
        return this.getYearData(this.currentYear);
    }
    
    setCurrentYear(year) {
        if (this.availableYears.includes(year)) {
            this.currentYear = year;
            return true;
        }
        return false;
    }
    
    getCountryData(year, countryCode) {
        const yearData = this.getYearData(year);
        if (!yearData) return null;
        
        return yearData.countries.find(country => country.svg_id === countryCode) || null;
    }
    
    addHistoricalPeriod(periodData) {
        // Validate period data
        if (!periodData.year || !periodData.title || !periodData.countries) {
            console.error('Invalid period data:', periodData);
            return false;
        }
        
        // Check if year already exists
        const existingIndex = this.data.findIndex(p => p.year === periodData.year);
        
        if (existingIndex >= 0) {
            // Update existing period
            this.data[existingIndex] = periodData;
            console.log(`Updated period for year ${periodData.year}`);
        } else {
            // Add new period
            this.data.push(periodData);
            this.availableYears.push(periodData.year);
            this.availableYears.sort((a, b) => a - b);
            console.log(`Added new period for year ${periodData.year}`);
        }
        
        return true;
    }
    
    removeHistoricalPeriod(year) {
        const index = this.data.findIndex(p => p.year === year);
        
        if (index >= 0) {
            this.data.splice(index, 1);
            this.availableYears = this.availableYears.filter(y => y !== year);
            console.log(`Removed period for year ${year}`);
            return true;
        }
        
        return false;
    }
    
    exportData(format = 'json') {
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(this.data, null, 2);
            case 'csv':
                return this.convertToCSV();
            default:
                return JSON.stringify(this.data);
        }
    }
    
    convertToCSV() {
        // Convert timeline data to CSV format
        let csv = 'Year,Title,Description,Country,Color,Capital,Ruler\n';
        
        this.data.forEach(period => {
            period.countries.forEach(country => {
                csv += `"${period.year}","${period.title}","${period.description}",`;
                csv += `"${country.name}","${country.color}","${country.capital}","${country.ruler}"\n`;
            });
        });
        
        return csv;
    }
    
    // Search functionality
    searchCountries(searchTerm) {
        const results = [];
        const term = searchTerm.toLowerCase();
        
        this.data.forEach(period => {
            period.countries.forEach(country => {
                if (
                    country.name.toLowerCase().includes(term) ||
                    country.ruler.toLowerCase().includes(term) ||
                    country.capital.toLowerCase().includes(term) ||
                    country.notes.toLowerCase().includes(term)
                ) {
                    results.push({
                        year: period.year,
                        periodTitle: period.title,
                        ...country
                    });
                }
            });
        });
        
        return results;
    }
    
    // Statistics
    getStatistics() {
        const stats = {
            totalPeriods: this.data.length,
            totalCountries: 0,
            yearRange: {
                min: Math.min(...this.availableYears),
                max: Math.max(...this.availableYears)
            },
            countriesByYear: {}
        };
        
        this.data.forEach(period => {
            stats.totalCountries += period.countries.length;
            stats.countriesByYear[period.year] = period.countries.length;
        });
        
        return stats;
    }
    
    // Debug methods
    debug() {
        console.log('=== TimelineData Debug ===');
        console.log('Total periods:', this.data.length);
        console.log('Available years:', this.availableYears);
        console.log('Current year:', this.currentYear);
        
        this.data.forEach(period => {
            console.log(`${period.year}: ${period.title} (${period.countries.length} countries)`);
        });
    }
}

// Make globally available
window.TimelineData = TimelineData;
console.log('✅ TimelineData module loaded');
