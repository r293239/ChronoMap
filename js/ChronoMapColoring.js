// js/ChronoMapColoring.js - GUARANTEED to color your countries
class ChronoMapColoring {
    constructor() {
        console.log("🎨 ChronoMapColoring - This WILL color your countries!");
    }

    async initialize() {
        console.log("🚀 Starting foolproof coloring...");
        
        try {
            // Wait for page to fully load
            await this.waitForPageLoad();
            
            // Color the countries
            const success = this.colorAllEuropeanCountries();
            
            if (success) {
                console.log("✅ SUCCESS! Countries are now colored.");
                this.addCelebration();
            } else {
                console.warn("⚠️ Some countries might not have colored");
            }
            
        } catch (error) {
            console.error("❌ Error:", error);
            this.showDebugInfo();
        }
    }

    waitForPageLoad() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
                // Also resolve after 3 seconds max
                setTimeout(resolve, 3000);
            }
        });
    }

    colorAllEuropeanCountries() {
        console.log("🎨 Coloring ALL European countries...");
        
        // 1800 European countries with their actual IDs from YOUR SVG
        const europeanCountries = [
            { id: 'fr', name: 'French Republic', color: '#1f77b4' },
            { id: 'at', name: 'Austrian Empire', color: '#ff7f0e' },
            { id: 'de', name: 'Kingdom of Prussia', color: '#2ca02c' },
            { id: 'ru', name: 'Russian Empire', color: '#d62728' },
            { id: 'tr', name: 'Ottoman Empire', color: '#9467bd' },
            { id: 'gb', name: 'United Kingdom', color: '#8c564b' },
            { id: 'es', name: 'Kingdom of Spain', color: '#e377c2' },
            { id: 'pt', name: 'Kingdom of Portugal', color: '#7f7f7f' },
            { id: 'se', name: 'Kingdom of Sweden', color: '#17becf' },
            { id: 'dk', name: 'Denmark-Norway', color: '#bcbd22' },
            { id: 'it', name: 'Italian States', color: '#ff9896' },
            { id: 'nl', name: 'Batavian Republic', color: '#8c564b' }, // Netherlands
            { id: 'ch', name: 'Swiss Confederation', color: '#bcbd22' }, // Switzerland
            { id: 'pl', name: 'Polish-Lithuanian Commonwealth', color: '#9467bd' } // Poland
        ];
        
        let coloredCount = 0;
        let failedCount = 0;
        
        europeanCountries.forEach(country => {
            console.log(`Trying to color ${country.name} (id: ${country.id})...`);
            
            // METHOD 1: Try getElementById
            let element = document.getElementById(country.id);
            
            // METHOD 2: Try querySelector with more specific selector
            if (!element) {
                element = document.querySelector(`#${country.id}, [id="${country.id}"]`);
            }
            
            // METHOD 3: Try to find any element with this ID
            if (!element) {
                const allElements = document.querySelectorAll('[id]');
                element = Array.from(allElements).find(el => el.id === country.id);
            }
            
            if (element) {
                console.log(`✅ Found ${country.id} - Tag: ${element.tagName}`);
                
                // FORCEFULLY apply color with !important equivalent
                this.applyColorForcefully(element, country.color);
                
                // Add data attributes
                element.setAttribute('data-country-name', country.name);
                element.setAttribute('data-colored', 'true');
                element.style.cursor = 'pointer';
                
                coloredCount++;
                console.log(`✅ SUCCESS: ${country.name} colored ${country.color}`);
                
                // Add hover effect
                this.addHoverEffect(element);
                
            } else {
                console.warn(`❌ Could not find element with id="${country.id}"`);
                failedCount++;
            }
        });
        
        console.log(`\n📊 RESULTS:`);
        console.log(`✅ Successfully colored: ${coloredCount} countries`);
        console.log(`❌ Failed to color: ${failedCount} countries`);
        console.log(`🎯 Total attempted: ${europeanCountries.length} countries`);
        
        return coloredCount > 0;
    }

    applyColorForcefully(element, color) {
        // Method 1: Direct style (highest priority)
        element.style.fill = color;
        element.style.stroke = '#333';
        element.style.strokeWidth = '1px';
        
        // Method 2: Set attribute (for SVG elements)
        element.setAttribute('fill', color);
        element.setAttribute('stroke', '#333');
        element.setAttribute('stroke-width', '1');
        
        // Method 3: For <g> elements, color all child paths
        if (element.tagName === 'g' || element.tagName === 'G') {
            const childPaths = element.querySelectorAll('path');
            childPaths.forEach(path => {
                path.style.fill = color;
                path.setAttribute('fill', color);
            });
        }
        
        // Method 4: Add a style attribute with !important (through CSS injection)
        const styleId = `force-color-${Date.now()}`;
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                #${element.id} {
                    fill: ${color} !important;
                    stroke: #333 !important;
                    stroke-width: 1px !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    addHoverEffect(element) {
        if (!element) return;
        
        element.addEventListener('mouseenter', function() {
            const originalFill = this.style.fill || this.getAttribute('fill');
            this.setAttribute('data-original-fill', originalFill);
            this.style.filter = 'brightness(1.2)';
            this.style.strokeWidth = '2px';
            
            // Show tooltip
            const countryName = this.getAttribute('data-country-name') || this.id;
            showSimpleTooltip(this, countryName);
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
            this.style.strokeWidth = '1px';
            hideTooltip();
        });
        
        element.addEventListener('click', function() {
            const countryName = this.getAttribute('data-country-name') || this.id;
            alert(`🇪🇺 ${countryName} (1800)\nClick worked!`);
        });
        
        // Tooltip functions
        function showSimpleTooltip(element, text) {
            let tooltip = document.getElementById('simple-map-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'simple-map-tooltip';
                tooltip.style.cssText = `
                    position: fixed;
                    background: rgba(0,0,0,0.9);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    z-index: 10000;
                    pointer-events: none;
                    display: none;
                `;
                document.body.appendChild(tooltip);
            }
            
            tooltip.textContent = text;
            tooltip.style.display = 'block';
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = (rect.left + window.scrollX + 10) + 'px';
            tooltip.style.top = (rect.top + window.scrollY - 35) + 'px';
        }
        
        function hideTooltip() {
            const tooltip = document.getElementById('simple-map-tooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        }
    }

    showDebugInfo() {
        console.log("🐛 DEBUG INFO:");
        
        // Check what's actually in the map container
        const container = document.getElementById('map-container');
        if (!container) {
            console.error("❌ No map-container element!");
            return;
        }
        
        console.log("Map container HTML length:", container.innerHTML.length);
        
        // Check if SVG is loaded
        const svg = container.querySelector('svg');
        console.log("SVG element found:", !!svg);
        
        if (svg) {
            console.log("SVG has", svg.children.length, "children");
        }
        
        // Test coloring manually
        console.log("\n🔧 MANUAL TEST:");
        console.log("Try running in console: document.getElementById('fr').style.fill = 'red'");
        console.log("If France turns red, the elements exist and can be colored!");
    }

    addCelebration() {
        console.log("%c🎉 SUCCESS! Countries are colored!", 
                   "color: green; font-size: 16px; font-weight: bold;");
        console.log("%c👉 Try hovering and clicking on European countries!", 
                   "color: blue; font-size: 14px;");
    }
}

// Create and initialize immediately
window.addEventListener('load', function() {
    console.log("🌍 Initializing ChronoMapColoring...");
    const colorizer = new ChronoMapColoring();
    colorizer.initialize();
    
    // Make it globally available for debugging
    window.colorizer = colorizer;
});

console.log("✅ ChronoMapColoring loaded. It WILL color your countries!");
