/* ============================================
   IRISH TAX SIMULATOR - JAVASCRIPT
   ============================================
   This file contains all the logic and calculations for the tax simulator.
   
   Key concepts demonstrated:
   - Data structures (arrays, objects)
   - Functions and parameters
   - Mathematical calculations
   - DOM manipulation
   - Event handling
   - Chart.js integration
   
   Irish Tax System Explained:
   1. Income Tax: Progressive tax with brackets (e.g., 20% up to €44,000, then 40%)
   2. USC (Universal Social Charge): Additional charge with its own brackets
   3. PRSI (Pay Related Social Insurance): Social insurance contribution (~4.1%)
   4. Tax Credits: Amount subtracted from final tax bill (e.g., €2,000)
*/

/* ============================================
   DATA: REAL INCOME DISTRIBUTION
   ============================================ */

/**
 * Real income band data from Irish Revenue 2023
 * Each band contains:
 * - min: Lower bound of income range (€)
 * - max: Upper bound of income range (€) - null means no upper limit
 * - earners: Number of people earning in this range
 * - totalIncome: Total income earned by all people in this band (€)
 */
const incomeBands = [
    {min: 0, max: 10000, earners: 557390, totalIncome: 2622840000},
    {min: 10000, max: 12000, earners: 122705, totalIncome: 1361310000},
    {min: 12000, max: 15000, earners: 343481, totalIncome: 4663450000},
    {min: 15000, max: 17000, earners: 187734, totalIncome: 2985640000},
    {min: 17000, max: 20000, earners: 195215, totalIncome: 3607050000},
    {min: 20000, max: 25000, earners: 310555, totalIncome: 6990340000},
    {min: 25000, max: 27000, earners: 129091, totalIncome: 3360140000},
    {min: 27000, max: 30000, earners: 193791, totalIncome: 5521520000},
    {min: 30000, max: 35000, earners: 304175, totalIncome: 9869890000},
    {min: 35000, max: 40000, earners: 272633, totalIncome: 10216770000},
    {min: 40000, max: 50000, earners: 420841, totalIncome: 18788300000},
    {min: 50000, max: 60000, earners: 272555, totalIncome: 14904120000},
    {min: 60000, max: 70000, earners: 182260, totalIncome: 11786480000},
    {min: 70000, max: 75000, earners: 66742, totalIncome: 4832930000},
    {min: 75000, max: 80000, earners: 53842, totalIncome: 4168640000},
    {min: 80000, max: 90000, earners: 82592, totalIncome: 6995570000},
    {min: 90000, max: 100000, earners: 55976, totalIncome: 5300310000},
    {min: 100000, max: 150000, earners: 118067, totalIncome: 14099600000},
    {min: 150000, max: 200000, earners: 35912, totalIncome: 6143200000},
    {min: 200000, max: 275000, earners: 20798, totalIncome: 4814030000},
    {min: 275000, max: null, earners: 21842, totalIncome: 11788310000}
];

/**
 * Calculate average income for each band
 * We divide total income by number of earners
 * map() creates a new array by applying a function to each element
 */
const averageIncomes = incomeBands.map(band => band.totalIncome / band.earners);

/**
 * Extract just the earner counts into an array
 * This makes calculations simpler later
 */
const earnerCounts = incomeBands.map(band => band.earners);

/* ============================================
   USC (UNIVERSAL SOCIAL CHARGE) CONSTANTS
   ============================================ */

/**
 * USC is a separate tax with its own brackets
 * These thresholds define where rates change
 * Income below €13,000 is exempt from USC
 */
const USC_THRESHOLDS = [12012.0, 27382.0, 70044.0];
const USC_RATES = [0.005, 0.02, 0.03, 0.08]; // 0.5%, 2%, 3%, 8%
const USC_EXEMPTION = 13000.0;

/* ============================================
   TAX CALCULATION FUNCTIONS
   ============================================ */

/**
 * Calculate income tax for a given income
 * 
 * @param {number} income - Gross income in euros
 * @param {number[]} thresholds - Array of bracket endpoints (e.g., [44000, 100000])
 * @param {number[]} rates - Array of tax rates (e.g., [0.20, 0.40, 0.45])
 * @param {number} credit - Tax credit amount to subtract (e.g., 2000)
 * @returns {number} Final income tax owed (cannot be negative)
 * 
 * How it works:
 * 1. Start with €0 tax
 * 2. For each bracket, calculate tax on income in that bracket
 * 3. Add up all bracket taxes
 * 4. Subtract the tax credit
 * 5. Make sure result is not negative
 */
function calculateIncomeTax(income, thresholds, rates, credit) {
    let totalTax = 0;
    let previousThreshold = 0;
    
    // Loop through each tax bracket
    for (let i = 0; i < thresholds.length; i++) {
        const currentThreshold = thresholds[i];
        const taxRate = rates[i];
        
        // Calculate how much income falls in this bracket
        // Math.max ensures we don't get negative values
        // Math.min ensures we don't exceed the bracket limit
        const incomeInBracket = Math.min(
            Math.max(income - previousThreshold, 0),  // Income above previous threshold
            currentThreshold - previousThreshold       // Width of this bracket
        );
        
        // Add tax for this bracket
        totalTax += incomeInBracket * taxRate;
        
        // Move to next bracket
        previousThreshold = currentThreshold;
    }
    
    // Tax any remaining income above the last threshold at the final rate
    const remainingIncome = Math.max(income - previousThreshold, 0);
    totalTax += remainingIncome * rates[rates.length - 1];
    
    // Subtract tax credit and ensure tax is not negative
    totalTax -= credit;
    return Math.max(totalTax, 0);
}

/**
 * Calculate Universal Social Charge (USC)
 * 
 * @param {number} income - Gross income in euros
 * @returns {number} USC amount owed
 * 
 * USC has an exemption threshold - income below €13,000 pays no USC
 * After that, we tax based on the amount ABOVE the exemption
 */
function calculateUSC(income) {
    // If income is below exemption, no USC
    if (income <= USC_EXEMPTION) {
        return 0;
    }
    
    // Calculate taxable amount (income above exemption)
    const taxableIncome = income - USC_EXEMPTION;
    let uscTotal = 0;
    let previousLimit = 0;
    
    // Loop through USC brackets
    for (let i = 0; i < USC_RATES.length; i++) {
        // Get the upper limit for this bracket (or Infinity for the last bracket)
        const upperLimit = i < USC_THRESHOLDS.length ? USC_THRESHOLDS[i] : Infinity;
        
        // Calculate income in this USC bracket
        const bracketIncome = Math.min(
            Math.max(taxableIncome - previousLimit, 0),
            upperLimit - previousLimit
        );
        
        // Add USC for this bracket
        uscTotal += bracketIncome * USC_RATES[i];
        previousLimit = upperLimit;
    }
    
    return uscTotal;
}

/**
 * Calculate PRSI (Pay Related Social Insurance)
 * 
 * @param {number} income - Annual gross income in euros
 * @param {number} prsiRate - PRSI rate (e.g., 0.041 for 4.1%)
 * @returns {number} Annual PRSI amount owed
 * 
 * PRSI has a weekly calculation with a credit taper for lower earners
 * - No PRSI if weekly income ≤ €352
 * - PRSI credit tapers from €352 to €424 per week
 * - Full PRSI above €424 per week
 */
function calculatePRSI(income, prsiRate) {
    // Convert annual income to weekly
    const weeklyIncome = income / 52.0;
    
    // Calculate weekly PRSI before any credits
    let weeklyPRSI = weeklyIncome * prsiRate;
    
    // No PRSI below €352 per week
    if (weeklyIncome <= 352.0) {
        return 0;
    }
    
    // Taper the PRSI credit between €352 and €424 per week
    if (weeklyIncome <= 424.0) {
        // Credit reduces as income increases
        const creditReduction = (weeklyIncome - 352.0) / 6.0;
        const weeklyCredit = 12.0;
        const appliedCredit = Math.max(weeklyCredit - creditReduction, 0);
        
        // Apply the credit
        weeklyPRSI = Math.max(weeklyPRSI - appliedCredit, 0);
    }
    
    // Convert back to annual amount
    return weeklyPRSI * 52.0;
}

/* ============================================
   AGGREGATE CALCULATIONS
   ============================================ */

/**
 * Calculate total government revenue from all earners
 * 
 * @param {number[]} thresholds - Income tax bracket endpoints
 * @param {number[]} rates - Income tax rates for each bracket
 * @param {number} credit - Tax credit amount
 * @param {number} prsiRate - PRSI rate
 * @returns {number} Total revenue in billions of euros
 * 
 * This is the key function that estimates total tax collected
 * by applying tax calculations to all income bands
 */
function calculateTotalRevenue(thresholds, rates, credit, prsiRate) {
    let totalRevenue = 0;
    
    // Loop through each income band
    for (let i = 0; i < averageIncomes.length; i++) {
        const avgIncome = averageIncomes[i];
        const numEarners = earnerCounts[i];
        
        // Calculate each tax type for this income level
        const incomeTax = calculateIncomeTax(avgIncome, thresholds, rates, credit);
        const usc = calculateUSC(avgIncome);
        const prsi = calculatePRSI(avgIncome, prsiRate);
        
        // Total tax per person in this band
        const taxPerPerson = incomeTax + usc + prsi;
        
        // Multiply by number of earners in this band
        totalRevenue += taxPerPerson * numEarners;
    }
    
    // Convert from euros to billions
    return totalRevenue / 1e9;
}

/**
 * Calculate effective tax rate across income spectrum
 * 
 * @param {number[]} thresholds - Income tax bracket endpoints
 * @param {number[]} rates - Income tax rates
 * @param {number} credit - Tax credit amount
 * @param {number} prsiRate - PRSI rate
 * @returns {Object} Object with xs (incomes) and ys (effective rates) arrays
 * 
 * Effective tax rate = (total tax paid) / (gross income)
 * This creates a smooth curve showing how tax rate changes with income
 */
function calculateEffectiveRateCurve(thresholds, rates, credit, prsiRate) {
    const incomePoints = [];      // X-axis: income levels
    const effectiveRates = [];    // Y-axis: effective tax rates
    
    // Sample 201 income points from €0 to €350,000
    for (let i = 0; i <= 200; i++) {
        const income = i * 1750; // Each step is €1,750
        
        // Calculate all taxes for this income
        const incomeTax = calculateIncomeTax(income, thresholds, rates, credit);
        const usc = calculateUSC(income);
        const prsi = calculatePRSI(income, prsiRate);
        const totalTax = incomeTax + usc + prsi;
        
        // Effective rate as a percentage
        const effectiveRate = income > 0 ? (totalTax / income) : 0;
        
        // Store results (income in thousands for chart display)
        incomePoints.push(income / 1000);
        effectiveRates.push(effectiveRate * 100);
    }
    
    return {xs: incomePoints, ys: effectiveRates};
}

/**
 * Calculate income thresholds for top percentiles
 * 
 * @returns {Object} Income thresholds for top 1%, 0.1%, and 0.01%
 * 
 * This helps understand income distribution - e.g., 
 * "The top 1% earn more than €XXX"
 */
function calculateTopPercentiles() {
    // Total number of earners
    const totalEarners = earnerCounts.reduce((sum, count) => sum + count, 0);
    
    // Number of earners in each top percentile
    const thresholdCounts = {
        '1%': totalEarners * 0.01,
        '0.1%': totalEarners * 0.001,
        '0.01%': totalEarners * 0.0001
    };
    
    const results = {};
    let cumulativeEarners = 0;
    
    // Start from highest income band and work down
    for (let i = incomeBands.length - 1; i >= 0; i--) {
        cumulativeEarners += incomeBands[i].earners;
        
        // Check if we've reached each percentile threshold
        for (const percentile in thresholdCounts) {
            if (!results[percentile] && cumulativeEarners >= thresholdCounts[percentile]) {
                results[percentile] = incomeBands[i].min;
            }
        }
    }
    
    return results;
}

/* ============================================
   DEFAULT/BASELINE TAX SYSTEM
   ============================================ */

// Current Irish tax system (2023 parameters)
const BASELINE_THRESHOLDS = [44000];       // Single bracket at €44,000
const BASELINE_RATES = [0.20, 0.40];       // 20% then 40%
const BASELINE_CREDIT = 2000;              // €2,000 tax credit
const BASELINE_PRSI = 0.041;               // 4.1% PRSI

// Calculate baseline values for comparison
const baselineRevenue = calculateTotalRevenue(
    BASELINE_THRESHOLDS, 
    BASELINE_RATES, 
    BASELINE_CREDIT, 
    BASELINE_PRSI
);

const baselineEffectiveCurve = calculateEffectiveRateCurve(
    BASELINE_THRESHOLDS,
    BASELINE_RATES,
    BASELINE_CREDIT,
    BASELINE_PRSI
);

/* ============================================
   CHART INITIALIZATION
   ============================================ */

/**
 * Initialize the revenue comparison bar chart
 * Shows baseline vs. proposed revenue side-by-side
 */
const revenueChartContext = document.getElementById('revenueChart').getContext('2d');
const revenueChart = new Chart(revenueChartContext, {
    type: 'bar',
    data: {
        labels: ['Baseline (Current)', 'Proposed (Your Settings)'],
        datasets: [{
            label: 'Revenue (billion €)',
            data: [baselineRevenue, baselineRevenue],  // Start with both same
            backgroundColor: ['#4C72B0', '#55A868'],    // Blue and green
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Revenue (€ billions)'
                }
            }
        },
        plugins: {
            legend: {
                display: false  // Hide legend since labels explain it
            }
        }
    }
});

/**
 * Initialize the effective tax rate line chart
 * Shows how tax rate changes with income for both scenarios
 */
const effectiveChartContext = document.getElementById('effectiveChart').getContext('2d');
const effectiveChart = new Chart(effectiveChartContext, {
    type: 'line',
    data: {
        labels: baselineEffectiveCurve.xs,
        datasets: [
            {
                label: 'Baseline (Current)',
                data: baselineEffectiveCurve.ys,
                borderColor: '#4C72B0',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 0  // No dots on line (cleaner)
            },
            {
                label: 'Proposed (Your Settings)',
                data: baselineEffectiveCurve.ys.slice(),  // Copy of baseline initially
                borderColor: '#55A868',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 0
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Gross Income (€ thousands)'
                }
            },
            y: {
                beginAtZero: true,
                max: 60,
                title: {
                    display: true,
                    text: 'Effective Tax Rate (%)'
                }
            }
        }
    }
});

/* ============================================
   UI UPDATE FUNCTIONS
   ============================================ */

/**
 * Update the summary text with current scenario details
 * 
 * @param {number} revenue - Total revenue in billions
 * @param {number[]} thresholds - Tax bracket endpoints
 * @param {number[]} rates - Tax rates
 * @param {number} credit - Tax credit amount
 * @param {number} prsiRate - PRSI rate
 */
function updateSummaryText(revenue, thresholds, rates, credit, prsiRate) {
    const revenueDifference = revenue - baselineRevenue;
    const topPercentiles = calculateTopPercentiles();
    
    // Format the tax brackets into a readable string
    let bracketsDescription;
    if (thresholds.length === 1) {
        bracketsDescription = `€${thresholds[0].toFixed(0)} → rates: ${(rates[0]*100).toFixed(1)}%, ${(rates[1]*100).toFixed(1)}%`;
    } else if (thresholds.length === 2) {
        bracketsDescription = `€${thresholds[0].toFixed(0)}, €${thresholds[1].toFixed(0)} → rates: ${(rates[0]*100).toFixed(1)}%, ${(rates[1]*100).toFixed(1)}%, ${(rates[2]*100).toFixed(1)}%`;
    } else {
        bracketsDescription = `€${thresholds[0].toFixed(0)}, €${thresholds[1].toFixed(0)}, €${thresholds[2].toFixed(0)} → rates: ${(rates[0]*100).toFixed(1)}%, ${(rates[1]*100).toFixed(1)}%, ${(rates[2]*100).toFixed(1)}%, ${(rates[3]*100).toFixed(1)}%`;
    }
    
    // Build summary text
    const summaryText = `Total Revenue: €${revenue.toFixed(2)} billion (${revenueDifference >= 0 ? '+' : ''}€${revenueDifference.toFixed(2)} billion vs baseline)

Income Thresholds:
Top 1% earn above: €${topPercentiles['1%']?.toLocaleString() || 'n/a'}
Top 0.1% earn above: €${topPercentiles['0.1%']?.toLocaleString() || 'n/a'}  
Top 0.01% earn above: €${topPercentiles['0.01%']?.toLocaleString() || 'n/a'}

Tax Settings:
Tax Credit: €${credit.toFixed(0)}
PRSI Rate: ${(prsiRate*100).toFixed(1)}%
Brackets: ${bracketsDescription}`;
    
    document.getElementById('summaryText').innerText = summaryText;
}

// Initialize with baseline summary
updateSummaryText(baselineRevenue, BASELINE_THRESHOLDS, BASELINE_RATES, BASELINE_CREDIT, BASELINE_PRSI);

/* ============================================
   MAIN RECALCULATION FUNCTION
   ============================================ */

/**
 * Recalculate everything when sliders change
 * This is the central function that updates the entire UI
 */
function recalculateAll() {
    // Get current values from sliders
    const band1 = parseFloat(document.getElementById('band1').value);
    const band2 = parseFloat(document.getElementById('band2').value);
    const band3 = parseFloat(document.getElementById('band3').value);
    const rate1 = parseFloat(document.getElementById('rate1').value);
    const rate2 = parseFloat(document.getElementById('rate2').value);
    const rate3 = parseFloat(document.getElementById('rate3').value);
    const rate4 = parseFloat(document.getElementById('rate4').value);
    const credit = parseFloat(document.getElementById('credit').value);
    const prsiRate = parseFloat(document.getElementById('prsiRate').value);
    
    // Update displayed values next to sliders
    document.getElementById('band1Val').innerText = band1.toFixed(0);
    document.getElementById('band2Val').innerText = band2.toFixed(0);
    document.getElementById('band3Val').innerText = band3.toFixed(0);
    document.getElementById('rate1Val').innerText = (rate1 * 100).toFixed(1);
    document.getElementById('rate2Val').innerText = (rate2 * 100).toFixed(1);
    document.getElementById('rate3Val').innerText = (rate3 * 100).toFixed(1);
    document.getElementById('rate4Val').innerText = (rate4 * 100).toFixed(1);
    document.getElementById('creditVal').innerText = credit.toFixed(0);
    document.getElementById('prsiRateVal').innerText = (prsiRate * 100).toFixed(1);
    
    // Determine active brackets based on slider values
    // If band2 or band3 is 0 or less than previous, it's disabled
    let activeThresholds;
    let activeRates;
    
    if (band2 <= band1 && band3 <= band1) {
        // Only one bracket active
        activeThresholds = [band1];
        activeRates = [rate1, rate2];
    } else if (band3 <= band2 || band2 <= band1) {
        // Two brackets active - sort to ensure proper order
        const sortedBands = [band1, band2].filter(b => b > 0).sort((a, b) => a - b);
        activeThresholds = sortedBands;
        activeRates = [rate1, rate2, rate3];
    } else {
        // Three brackets active
        activeThresholds = [band1, band2, band3].sort((a, b) => a - b);
        activeRates = [rate1, rate2, rate3, rate4];
    }
    
    // Calculate new revenue with current settings
    const proposedRevenue = calculateTotalRevenue(activeThresholds, activeRates, credit, prsiRate);
    
    // Update revenue chart
    revenueChart.data.datasets[0].data[1] = proposedRevenue;
    // Adjust y-axis to fit data
    revenueChart.options.scales.y.max = Math.max(proposedRevenue, baselineRevenue) * 1.2;
    revenueChart.update();
    
    // Calculate new effective rate curve
    const proposedEffectiveCurve = calculateEffectiveRateCurve(activeThresholds, activeRates, credit, prsiRate);
    
    // Update effective rate chart
    effectiveChart.data.datasets[1].data = proposedEffectiveCurve.ys;
    // Adjust y-axis to fit both curves
    const maxEffRate = Math.max(
        Math.max(...proposedEffectiveCurve.ys),
        Math.max(...baselineEffectiveCurve.ys)
    );
    effectiveChart.options.scales.y.max = Math.min(maxEffRate * 1.2, 100);
    effectiveChart.update();
    
    // Update summary text
    updateSummaryText(proposedRevenue, activeThresholds, activeRates, credit, prsiRate);
}

/* ============================================
   EVENT LISTENERS
   ============================================ */

// Attach event listeners to all sliders
// 'input' event fires continuously as slider moves
document.getElementById('band1').addEventListener('input', recalculateAll);
document.getElementById('band2').addEventListener('input', recalculateAll);
document.getElementById('band3').addEventListener('input', recalculateAll);
document.getElementById('rate1').addEventListener('input', recalculateAll);
document.getElementById('rate2').addEventListener('input', recalculateAll);
document.getElementById('rate3').addEventListener('input', recalculateAll);
document.getElementById('rate4').addEventListener('input', recalculateAll);
document.getElementById('credit').addEventListener('input', recalculateAll);
document.getElementById('prsiRate').addEventListener('input', recalculateAll);

/**
 * Reset button - returns all sliders to default values
 */
document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('band1').value = 44000;
    document.getElementById('band2').value = 0;
    document.getElementById('band3').value = 0;
    document.getElementById('rate1').value = 0.20;
    document.getElementById('rate2').value = 0.40;
    document.getElementById('rate3').value = 0.40;
    document.getElementById('rate4').value = 0.40;
    document.getElementById('credit').value = 2000;
    document.getElementById('prsiRate').value = 0.041;
    
    // Recalculate with reset values
    recalculateAll();
});

/* ============================================
   STUDENT EXERCISES
   ============================================ */

// EXERCISE 1: Calculate and display average tax per person
// Uncomment the function below and call it from recalculateAll()
/*
function calculateAverageTaxPerPerson(revenue) {
    const totalEarners = earnerCounts.reduce((sum, count) => sum + count, 0);
    const avgTax = (revenue * 1e9) / totalEarners;
    console.log(`Average tax per person: €${avgTax.toFixed(2)}`);
    // TODO: Display this in the UI instead of console
    return avgTax;
}
*/

// EXERCISE 2: Calculate median effective tax rate
// The median is the "middle" rate - half of earners pay more, half pay less
/*
function calculateMedianEffectiveTaxRate(thresholds, rates, credit, prsiRate) {
    const totalEarners = earnerCounts.reduce((sum, count) => sum + count, 0);
    const halfEarners = totalEarners / 2;
    
    let cumulative = 0;
    for (let i = 0; i < incomeBands.length; i++) {
        cumulative += earnerCounts[i];
        if (cumulative >= halfEarners) {
            // The median earner is in this band
            const income = averageIncomes[i];
            const incomeTax = calculateIncomeTax(income, thresholds, rates, credit);
            const usc = calculateUSC(income);
            const prsi = calculatePRSI(income, prsiRate);
            const effectiveRate = (incomeTax + usc + prsi) / income * 100;
            return effectiveRate;
        }
    }
    return 0;
}
*/

// EXERCISE 3: Compare two different scenarios
// Save scenario A, modify sliders, then calculate difference
/*
let savedScenario = null;

function saveCurrentScenario() {
    // Get all current slider values
    savedScenario = {
        band1: parseFloat(document.getElementById('band1').value),
        band2: parseFloat(document.getElementById('band2').value),
        band3: parseFloat(document.getElementById('band3').value),
        rate1: parseFloat(document.getElementById('rate1').value),
        rate2: parseFloat(document.getElementById('rate2').value),
        rate3: parseFloat(document.getElementById('rate3').value),
        rate4: parseFloat(document.getElementById('rate4').value),
        credit: parseFloat(document.getElementById('credit').value),
        prsiRate: parseFloat(document.getElementById('prsiRate').value)
    };
    console.log('Scenario saved!');
    // TODO: Show a confirmation message in the UI
}

function compareToSavedScenario() {
    if (!savedScenario) {
        alert('Please save Scenario A first!');
        return;
    }
    
    // Calculate revenue for saved scenario
    // ... implement this logic ...
    
    // Calculate revenue for current scenario
    // ... implement this logic ...
    
    // Display comparison
    // ... show the difference ...
}

// Uncomment to enable the save scenario button
// document.getElementById('saveScenarioBtn').addEventListener('click', saveCurrentScenario);
*/

// EXERCISE 4: Calculate revenue by income band
// Show which income groups contribute most tax
/*
function calculateRevenueByBand(thresholds, rates, credit, prsiRate) {
    const revenueByBand = [];
    
    for (let i = 0; i < averageIncomes.length; i++) {
        const income = averageIncomes[i];
        const numEarners = earnerCounts[i];
        
        const incomeTax = calculateIncomeTax(income, thresholds, rates, credit);
        const usc = calculateUSC(income);
        const prsi = calculatePRSI(income, prsiRate);
        
        const totalTaxForBand = (incomeTax + usc + prsi) * numEarners;
        
        revenueByBand.push({
            band: `€${incomeBands[i].min.toLocaleString()} - €${incomeBands[i].max?.toLocaleString() || '275,000+'}`,
            revenue: totalTaxForBand / 1e9  // in billions
        });
    }
    
    return revenueByBand;
}

// TODO: Create a new chart showing this breakdown
*/

// EXERCISE 5: Calculate progressivity index
// Measure how progressive the tax system is
// Higher number = more progressive (higher earners pay proportionally more)
/*
function calculateProgressivityIndex(thresholds, rates, credit, prsiRate) {
    // Calculate effective rate at €30k and €150k
    const income30k = 30000;
    const income150k = 150000;
    
    const tax30k = calculateIncomeTax(income30k, thresholds, rates, credit) +
                   calculateUSC(income30k) +
                   calculatePRSI(income30k, prsiRate);
    
    const tax150k = calculateIncomeTax(income150k, thresholds, rates, credit) +
                    calculateUSC(income150k) +
                    calculatePRSI(income150k, prsiRate);
    
    const effRate30k = tax30k / income30k;
    const effRate150k = tax150k / income150k;
    
    // Progressivity index = ratio of high-income rate to low-income rate
    const progressivity = effRate150k / effRate30k;
    
    return progressivity;
}
*/

// EXERCISE 6: Add a dark mode toggle
/*
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // TODO: Also update chart colors for dark mode
}

// Add a button for this in the HTML, then uncomment:
// document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);
*/

/* ============================================
   CONSOLE LOG FOR DEBUGGING
   ============================================ */

// Log initial state - useful for debugging
console.log('Tax simulator initialized');
console.log(`Baseline revenue: €${baselineRevenue.toFixed(2)} billion`);
console.log(`Total earners in dataset: ${earnerCounts.reduce((a, b) => a + b, 0).toLocaleString()}`);
