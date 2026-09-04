// ============================================
// GLOBAL VARIABLES
// ============================================

// Coin flip tracking
let headsCount = 0;
let tailsCount = 0;

// Dice roll tracking
let diceRolls = [0, 0, 0, 0, 0, 0]; // for faces 1-6

// ============================================
// FRACTION VISUALIZER
// ============================================

function updateFractionVisualizer() {
    const numerator = parseInt(document.getElementById('frac-numerator').value);
    const denominator = parseInt(document.getElementById('frac-denominator').value);
    
    // Update displays
    document.getElementById('num-display').textContent = numerator;
    document.getElementById('denom-display').textContent = denominator;
    document.getElementById('viz-num').textContent = numerator;
    document.getElementById('viz-denom').textContent = denominator;
    
    // Calculate decimal
    const decimal = denominator !== 0 ? (numerator / denominator).toFixed(4) : '∞';
    document.getElementById('viz-decimal').textContent = decimal;
    
    // Draw bar visualization
    drawFractionBars(numerator, denominator);
    
    // Draw circle visualization
    drawFractionCircle(numerator, denominator);
}

function drawFractionBars(numerator, denominator) {
    const container = document.getElementById('fraction-bars');
    container.innerHTML = '';
    
    // Create main bar
    const barContainer = document.createElement('div');
    barContainer.className = 'bar-container';
    barContainer.style.display = 'flex';
    barContainer.style.height = '50px';
    barContainer.style.border = '3px solid #667eea';
    barContainer.style.borderRadius = '8px';
    barContainer.style.overflow = 'hidden';
    
    // Calculate the width percentage
    const percentage = denominator !== 0 ? (numerator / denominator) * 100 : 0;
    const cappedPercentage = Math.min(100, percentage);
    
    // Create filled portion
    if (numerator > 0 && denominator > 0) {
        const filled = document.createElement('div');
        filled.style.width = cappedPercentage + '%';
        filled.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        filled.style.transition = 'width 0.3s ease';
        filled.style.display = 'flex';
        filled.style.alignItems = 'center';
        filled.style.justifyContent = 'center';
        filled.style.color = 'white';
        filled.style.fontWeight = 'bold';
        filled.textContent = cappedPercentage.toFixed(1) + '%';
        barContainer.appendChild(filled);
    }
    
    // Create empty portion
    if (cappedPercentage < 100) {
        const empty = document.createElement('div');
        empty.style.flex = '1';
        empty.style.background = '#f0f0f0';
        barContainer.appendChild(empty);
    }
    
    container.appendChild(barContainer);
    
    // Add individual segments view
    const segmentsContainer = document.createElement('div');
    segmentsContainer.style.display = 'flex';
    segmentsContainer.style.gap = '5px';
    segmentsContainer.style.marginTop = '20px';
    segmentsContainer.style.flexWrap = 'wrap';
    
    for (let i = 0; i < denominator && i < 24; i++) {
        const segment = document.createElement('div');
        segment.style.width = 'calc((100% - ' + (denominator - 1) * 5 + 'px) / ' + denominator + ')';
        segment.style.minWidth = '20px';
        segment.style.height = '30px';
        segment.style.border = '2px solid #667eea';
        segment.style.borderRadius = '4px';
        
        if (i < numerator) {
            segment.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        } else {
            segment.style.background = '#f0f0f0';
        }
        
        segmentsContainer.appendChild(segment);
    }
    
    if (denominator <= 24) {
        container.appendChild(segmentsContainer);
    }
}

function drawFractionCircle(numerator, denominator) {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    
    // Calculate angle for each segment
    const anglePerSegment = (2 * Math.PI) / denominator;
    
    // Draw segments
    for (let i = 0; i < denominator; i++) {
        const startAngle = i * anglePerSegment - Math.PI / 2;
        const endAngle = (i + 1) * anglePerSegment - Math.PI / 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        // Fill with color based on whether it's part of the numerator
        if (i < numerator) {
            const gradient = ctx.createLinearGradient(0, 0, 200, 200);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = '#f0f0f0';
        }
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Draw center circle for visual appeal
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#667eea';
    ctx.fill();
    
    // Replace the container content
    const container = document.getElementById('fraction-circle');
    container.innerHTML = '';
    container.appendChild(canvas);
}

// ============================================
// FRACTION CALCULATOR
// ============================================

function calculateFractions() {
    const num1 = parseInt(document.getElementById('calc-num1').value) || 0;
    const denom1 = parseInt(document.getElementById('calc-denom1').value) || 1;
    const num2 = parseInt(document.getElementById('calc-num2').value) || 0;
    const denom2 = parseInt(document.getElementById('calc-denom2').value) || 1;
    const operation = document.getElementById('calc-operation').value;
    
    let resultNum, resultDenom;
    
    switch(operation) {
        case 'add':
            // Find common denominator
            const lcmAdd = lcm(denom1, denom2);
            resultNum = num1 * (lcmAdd / denom1) + num2 * (lcmAdd / denom2);
            resultDenom = lcmAdd;
            break;
            
        case 'subtract':
            const lcmSub = lcm(denom1, denom2);
            resultNum = num1 * (lcmSub / denom1) - num2 * (lcmSub / denom2);
            resultDenom = lcmSub;
            break;
            
        case 'multiply':
            resultNum = num1 * num2;
            resultDenom = denom1 * denom2;
            break;
            
        case 'divide':
            resultNum = num1 * denom2;
            resultDenom = denom1 * num2;
            break;
    }
    
    // Simplify the result
    const gcdValue = gcd(Math.abs(resultNum), Math.abs(resultDenom));
    resultNum = resultNum / gcdValue;
    resultDenom = resultDenom / gcdValue;
    
    // Display result
    const resultDiv = document.getElementById('fraction-result');
    const decimal = (resultNum / resultDenom).toFixed(4);
    
    resultDiv.innerHTML = `
        <div style="font-size: 2em; color: #667eea; font-weight: bold;">
            <span>${resultNum}</span>
            <span style="display: inline-block; margin: 0 10px;">/</span>
            <span>${resultDenom}</span>
            <span style="margin: 0 15px; color: #666;">=</span>
            <span style="color: #764ba2;">${decimal}</span>
        </div>
    `;
}

// Helper function: Greatest Common Divisor
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

// Helper function: Least Common Multiple
function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

// ============================================
// EXPONENT EXPLORER
// ============================================

function updateExponentExplorer() {
    const base = parseFloat(document.getElementById('exp-base').value);
    const power = parseFloat(document.getElementById('exp-power').value);
    
    // Update displays
    document.getElementById('base-display').textContent = base;
    document.getElementById('power-display').textContent = power;
    document.getElementById('exp-base-show').textContent = base;
    document.getElementById('exp-power-show').textContent = power;
    
    // Calculate result
    const result = Math.pow(base, power).toFixed(4);
    document.getElementById('exp-result').textContent = result;
    
    // Draw graph
    drawExponentGraph(base);
}

function drawExponentGraph(base) {
    const canvas = document.getElementById('exponent-graph');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    ctx.lineTo(width - 20, height - 50);
    ctx.moveTo(50, height - 50);
    ctx.lineTo(50, 20);
    ctx.stroke();
    
    // Draw exponential curve
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const xRange = 5;
    const yMax = Math.pow(base, xRange);
    
    for (let x = 0; x <= xRange; x += 0.1) {
        const y = Math.pow(base, x);
        const canvasX = 50 + (x / xRange) * (width - 70);
        const canvasY = height - 50 - (y / yMax) * (height - 70);
        
        if (x === 0) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText('x', width - 35, height - 30);
    ctx.fillText('y', 30, 30);
    ctx.fillText('0', 35, height - 30);
    ctx.fillText(base + '^x', width - 80, 30);
}

// ============================================
// LOGARITHM CALCULATOR
// ============================================

function calculateLog() {
    const base = parseFloat(document.getElementById('log-base').value);
    const exponent = parseFloat(document.getElementById('log-exp').value);
    
    // Calculate result of exponentiation
    const expResult = Math.pow(base, exponent);
    document.getElementById('log-exp-result').textContent = expResult.toFixed(4);
    
    // Calculate logarithm (reverse operation)
    document.getElementById('log-base-display2').textContent = base;
    document.getElementById('log-value-display').textContent = expResult.toFixed(4);
    
    const logResult = Math.log(expResult) / Math.log(base);
    document.getElementById('log-result').textContent = logResult.toFixed(4);
}

// ============================================
// COIN FLIP SIMULATOR
// ============================================

function flipCoins(count) {
    for (let i = 0; i < count; i++) {
        if (Math.random() < 0.5) {
            headsCount++;
        } else {
            tailsCount++;
        }
    }
    
    updateCoinDisplay();
    drawCoinChart();
}

function updateCoinDisplay() {
    const total = headsCount + tailsCount;
    const headsPercent = total > 0 ? (headsCount / total * 100).toFixed(2) : 0;
    const tailsPercent = total > 0 ? (tailsCount / total * 100).toFixed(2) : 0;
    
    document.getElementById('heads-count').textContent = headsCount;
    document.getElementById('heads-percent').textContent = headsPercent + '%';
    document.getElementById('tails-count').textContent = tailsCount;
    document.getElementById('tails-percent').textContent = tailsPercent + '%';
    document.getElementById('total-flips').textContent = total;
}

function drawCoinChart() {
    const canvas = document.getElementById('coin-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const total = headsCount + tailsCount;
    if (total === 0) return;
    
    // Draw bars
    const barWidth = 150;
    const maxHeight = height - 80;
    const spacing = (width - 2 * barWidth) / 3;
    
    // Heads bar
    const headsHeight = (headsCount / total) * maxHeight;
    const headsX = spacing;
    const headsY = height - 40 - headsHeight;
    
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(headsX, headsY, barWidth, headsHeight);
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 2;
    ctx.strokeRect(headsX, headsY, barWidth, headsHeight);
    
    // Tails bar
    const tailsHeight = (tailsCount / total) * maxHeight;
    const tailsX = spacing * 2 + barWidth;
    const tailsY = height - 40 - tailsHeight;
    
    ctx.fillStyle = '#2196f3';
    ctx.fillRect(tailsX, tailsY, barWidth, tailsHeight);
    ctx.strokeStyle = '#1565c0';
    ctx.lineWidth = 2;
    ctx.strokeRect(tailsX, tailsY, barWidth, tailsHeight);
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Heads', headsX + barWidth / 2, height - 15);
    ctx.fillText('Tails', tailsX + barWidth / 2, height - 15);
    
    // Percentages
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = 'white';
    const headsPercent = (headsCount / total * 100).toFixed(1) + '%';
    const tailsPercent = (tailsCount / total * 100).toFixed(1) + '%';
    ctx.fillText(headsPercent, headsX + barWidth / 2, headsY + headsHeight / 2 + 7);
    ctx.fillText(tailsPercent, tailsX + barWidth / 2, tailsY + tailsHeight / 2 + 7);
    
    // Draw 50% reference line
    ctx.strokeStyle = '#ff5722';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const fiftyPercentY = height - 40 - (maxHeight / 2);
    ctx.beginPath();
    ctx.moveTo(0, fiftyPercentY);
    ctx.lineTo(width, fiftyPercentY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#ff5722';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('50% (expected)', 10, fiftyPercentY - 5);
}

function resetCoinFlips() {
    headsCount = 0;
    tailsCount = 0;
    updateCoinDisplay();
    
    const canvas = document.getElementById('coin-chart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ============================================
// DICE ROLL SIMULATOR
// ============================================

function rollDice(count) {
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * 6);
        diceRolls[roll]++;
    }
    
    drawDiceChart();
    updateDiceStats();
}

function drawDiceChart() {
    const canvas = document.getElementById('dice-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const total = diceRolls.reduce((a, b) => a + b, 0);
    if (total === 0) return;
    
    const barWidth = 70;
    const maxHeight = height - 80;
    const spacing = (width - 6 * barWidth) / 7;
    
    // Draw bars for each die face
    for (let i = 0; i < 6; i++) {
        const barHeight = (diceRolls[i] / total) * maxHeight;
        const x = spacing * (i + 1) + barWidth * i;
        const y = height - 40 - barHeight;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        ctx.strokeStyle = '#4527a0';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);
        
        // Die face number
        ctx.fillStyle = '#333';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((i + 1).toString(), x + barWidth / 2, height - 15);
        
        // Percentage on bar
        if (barHeight > 25) {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Arial';
            const percent = (diceRolls[i] / total * 100).toFixed(1) + '%';
            ctx.fillText(percent, x + barWidth / 2, y + barHeight / 2 + 5);
        }
    }
    
    // Draw 16.67% reference line
    ctx.strokeStyle = '#ff5722';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const expectedY = height - 40 - (maxHeight / 6);
    ctx.beginPath();
    ctx.moveTo(0, expectedY);
    ctx.lineTo(width, expectedY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#ff5722';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('16.67% (expected)', 10, expectedY - 5);
}

function updateDiceStats() {
    const total = diceRolls.reduce((a, b) => a + b, 0);
    const statsDiv = document.getElementById('dice-stats');
    
    if (total === 0) {
        statsDiv.innerHTML = '<p>Roll some dice to see statistics!</p>';
        return;
    }
    
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 15px; margin: 20px 0;">';
    
    for (let i = 0; i < 6; i++) {
        const percent = (diceRolls[i] / total * 100).toFixed(2);
        html += `
            <div class="dice-stat-item">
                <div class="dice-face">${i + 1}</div>
                <div class="dice-count">${diceRolls[i]}</div>
                <div class="dice-percentage">${percent}%</div>
            </div>
        `;
    }
    
    html += '</div>';
    html += `<p style="text-align: center; margin-top: 20px; font-weight: bold;">Total Rolls: ${total}</p>`;
    
    statsDiv.innerHTML = html;
}

function resetDiceRolls() {
    diceRolls = [0, 0, 0, 0, 0, 0];
    updateDiceStats();
    
    const canvas = document.getElementById('dice-chart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ============================================
// STATISTICS CALCULATOR
// ============================================

function calculateStatistics() {
    const input = document.getElementById('data-input').value;
    const numbers = input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    
    if (numbers.length === 0) {
        document.getElementById('stats-results').innerHTML = '<p style="color: #f44336;">Please enter valid numbers separated by commas.</p>';
        return;
    }
    
    // Sort for median and quartiles
    const sorted = [...numbers].sort((a, b) => a - b);
    
    // Calculate statistics
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const median = calculateMedian(sorted);
    const mode = calculateMode(numbers);
    const range = sorted[sorted.length - 1] - sorted[0];
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
    const stdDev = Math.sqrt(variance);
    
    // Display results
    const resultsDiv = document.getElementById('stats-results');
    resultsDiv.innerHTML = `
        <h4>Statistics Results:</h4>
        <div class="stat-result-row">
            <span class="stat-label">Count:</span>
            <span class="stat-result-value">${numbers.length}</span>
        </div>
        <div class="stat-result-row">
            <span class="stat-label">Mean (Average):</span>
            <span class="stat-result-value">${mean.toFixed(2)}</span>
        </div>
        <div class="stat-result-row">
            <span class="stat-label">Median (Middle):</span>
            <span class="stat-result-value">${median}</span>
        </div>
        <div class="stat-result-row">
            <span class="stat-label">Mode (Most Common):</span>
            <span class="stat-result-value">${mode}</span>
        </div>
        <div class="stat-result-row">
            <span class="stat-label">Range:</span>
            <span class="stat-result-value">${range.toFixed(2)}</span>
        </div>
        <div class="stat-result-row">
            <span class="stat-label">Standard Deviation:</span>
            <span class="stat-result-value">${stdDev.toFixed(2)}</span>
        </div>
        <div class="stat-result-row">
            <span class="stat-label">Minimum:</span>
            <span class="stat-result-value">${sorted[0]}</span>
        </div>
        <div class="stat-result-row">
            <span class="stat-label">Maximum:</span>
            <span class="stat-result-value">${sorted[sorted.length - 1]}</span>
        </div>
    `;
    
    // Draw visualization
    drawDataVisualization(sorted, mean, median);
}

function calculateMedian(sorted) {
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
    } else {
        return sorted[mid].toFixed(2);
    }
}

function calculateMode(numbers) {
    const frequency = {};
    let maxFreq = 0;
    let modes = [];
    
    numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
        }
    });
    
    for (let num in frequency) {
        if (frequency[num] === maxFreq) {
            modes.push(parseFloat(num));
        }
    }
    
    if (modes.length === numbers.length) {
        return 'No mode';
    }
    
    return modes.join(', ');
}

function drawDataVisualization(sorted, mean, median) {
    const canvas = document.getElementById('data-visualization');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (sorted.length === 0) return;
    
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;
    const padding = 50;
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#667eea';
    sorted.forEach((value, index) => {
        const x = padding + (index / (sorted.length - 1 || 1)) * (width - 2 * padding);
        const y = height - padding - ((value - min) / (range || 1)) * (height - 2 * padding);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw mean line
    const meanY = height - padding - ((mean - min) / (range || 1)) * (height - 2 * padding);
    ctx.strokeStyle = '#f44336';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, meanY);
    ctx.lineTo(width - padding, meanY);
    ctx.stroke();
    
    ctx.fillStyle = '#f44336';
    ctx.font = '12px Arial';
    ctx.fillText(`Mean: ${mean.toFixed(2)}`, width - padding - 80, meanY - 5);
    
    // Draw median line
    const medianValue = parseFloat(median);
    const medianY = height - padding - ((medianValue - min) / (range || 1)) * (height - 2 * padding);
    ctx.strokeStyle = '#4caf50';
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, medianY);
    ctx.lineTo(width - padding, medianY);
    ctx.stroke();
    
    ctx.fillStyle = '#4caf50';
    ctx.fillText(`Median: ${median}`, width - padding - 80, medianY + 15);
    
    ctx.setLineDash([]);
}

// ============================================
// NORMAL DISTRIBUTION
// ============================================

function updateNormalDistribution() {
    const mean = parseFloat(document.getElementById('normal-mean').value);
    const std = parseFloat(document.getElementById('normal-std').value);
    
    document.getElementById('mean-display').textContent = mean;
    document.getElementById('std-display').textContent = std;
    
    drawNormalDistribution(mean, std);
}

function drawNormalDistribution(mean, std) {
    const canvas = document.getElementById('normal-distribution');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const padding = 50;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();
    
    // Normal distribution function
    function normalPDF(x, mu, sigma) {
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) * 
               Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    }
    
    // Draw curve
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const xMin = mean - 4 * std;
    const xMax = mean + 4 * std;
    const xRange = xMax - xMin;
    
    for (let i = 0; i <= graphWidth; i++) {
        const x = xMin + (i / graphWidth) * xRange;
        const y = normalPDF(x, mean, std);
        const maxY = normalPDF(mean, mean, std);
        
        const canvasX = padding + i;
        const canvasY = height - padding - (y / maxY) * graphHeight;
        
        if (i === 0) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    
    ctx.stroke();
    
    // Draw standard deviation markers
    const colors = ['#4caf50', '#ff9800', '#f44336'];
    const labels = ['68%', '95%', '99.7%'];
    
    for (let i = 1; i <= 3; i++) {
        const leftX = padding + ((mean - i * std - xMin) / xRange) * graphWidth;
        const rightX = padding + ((mean + i * std - xMin) / xRange) * graphWidth;
        
        ctx.strokeStyle = colors[i - 1];
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        
        // Left line
        ctx.beginPath();
        ctx.moveTo(leftX, height - padding);
        ctx.lineTo(leftX, padding);
        ctx.stroke();
        
        // Right line
        ctx.beginPath();
        ctx.moveTo(rightX, height - padding);
        ctx.lineTo(rightX, padding);
        ctx.stroke();
        
        // Label
        ctx.fillStyle = colors[i - 1];
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`±${i}σ`, leftX, height - padding + 20);
        ctx.fillText(`±${i}σ`, rightX, height - padding + 20);
    }
    
    ctx.setLineDash([]);
    
    // Draw mean line
    const meanX = padding + ((mean - xMin) / xRange) * graphWidth;
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(meanX, height - padding);
    ctx.lineTo(meanX, padding);
    ctx.stroke();
    
    ctx.fillStyle = '#2196f3';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('μ', meanX, height - padding + 35);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize fraction visualizer
    if (document.getElementById('frac-numerator')) {
        document.getElementById('frac-numerator').addEventListener('input', updateFractionVisualizer);
        document.getElementById('frac-denominator').addEventListener('input', updateFractionVisualizer);
        updateFractionVisualizer();
    }
    
    // Initialize exponent explorer
    if (document.getElementById('exp-base')) {
        document.getElementById('exp-base').addEventListener('input', updateExponentExplorer);
        document.getElementById('exp-power').addEventListener('input', updateExponentExplorer);
        updateExponentExplorer();
    }
    
    // Initialize logarithm calculator
    if (document.getElementById('log-base')) {
        document.getElementById('log-base').addEventListener('input', calculateLog);
        document.getElementById('log-exp').addEventListener('input', calculateLog);
        calculateLog();
    }
    
    // Initialize normal distribution
    if (document.getElementById('normal-mean')) {
        document.getElementById('normal-mean').addEventListener('input', updateNormalDistribution);
        document.getElementById('normal-std').addEventListener('input', updateNormalDistribution);
        updateNormalDistribution();
    }
    
    // Initialize coin display
    updateCoinDisplay();
    
    // Initialize dice stats
    updateDiceStats();
    
    console.log('Math Tutorial initialized successfully!');
});

// Make functions globally available
window.calculateFractions = calculateFractions;
window.calculateLog = calculateLog;
window.flipCoins = flipCoins;
window.resetCoinFlips = resetCoinFlips;
window.rollDice = rollDice;
window.resetDiceRolls = resetDiceRolls;
window.calculateStatistics = calculateStatistics;