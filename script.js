document.getElementById('startBtn').addEventListener('click', startBacktest);

// Generate Random Price Data
function generateRandomData(days) {
  const priceData = [];
  let price = 100; // Starting price
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 4; // Random fluctuation between -2% and +2%
    price *= (1 + change / 100);
    priceData.push(price);
  }
  return priceData;
}

// Backtesting Strategy
function backtestStrategy(prices) {
  let cash = 10000; // Initial cash
  let position = 0; // No position initially
  let buyThreshold = 0.02; // Buy when price increases by 2%
  let sellThreshold = -0.01; // Sell when price decreases by 1%
  let balance = [cash]; // Track balance over time

  for (let i = 1; i < prices.length; i++) {
    const priceChange = (prices[i] - prices[i-1]) / prices[i-1];

    // Buy condition
    if (priceChange >= buyThreshold && cash > 0) {
      position = cash / prices[i]; // Buy shares
      cash = 0;
    }

    // Sell condition
    if (priceChange <= sellThreshold && position > 0) {
      cash = position * prices[i]; // Sell shares
      position = 0;
    }

    balance.push(cash + position * prices[i]); // Update balance
  }
  
  return balance;
}

// Display Chart and Results
function displayResults(balance, prices) {
  const finalBalance = balance[balance.length - 1];
  const totalProfit = finalBalance - 10000;

  // Update Results in the UI
  document.getElementById('finalBalance').innerText = `Final Balance: $${finalBalance.toFixed(2)}`;
  document.getElementById('totalProfit').innerText = `Total Profit/Loss: $${totalProfit.toFixed(2)}`;

  // Chart.js for Performance Chart
  const ctx = document.getElementById('performanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: prices.length }, (_, i) => i + 1),
      datasets: [{
        label: 'Strategy Performance',
        data: balance,
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      }, {
        label: 'Price Data',
        data: prices,
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
        borderDash: [5, 5],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
      },
    },
  });
}

// Start Backtest
function startBacktest() {
  const days = 100;
  const priceData = generateRandomData(days);
  const strategyBalance = backtestStrategy(priceData);
  displayResults(strategyBalance, priceData);
}
