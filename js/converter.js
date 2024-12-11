import { fetchExchangeRates, fetchHistoricalRates } from './api.js';
import { createChart } from './chart.js';
import { commonCurrencies } from './currencies.js';

export function initializeConverter() {
  const converterHTML = `
    <div class="converter-wrapper">
      <header class="converter-header">
        <h2>Currency Exchange</h2>
        <p class="subtitle">Real-time currency conversion and historical rates</p>
      </header>
      
      <div class="converter-form">
        <div class="input-group">
          <label for="amount">Amount</label>
          <input type="number" id="amount" value="1" min="0" step="0.01" class="amount-input">
          <select id="from-currency" class="currency-select"></select>
        </div>
        
        <button id="swap-currencies" class="swap-btn" aria-label="Swap currencies">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
          </svg>
        </button>
        
        <div class="input-group">
          <label for="result">Converted Amount</label>
          <input type="number" id="result" readonly class="result-input">
          <select id="to-currency" class="currency-select"></select>
        </div>
      </div>

      <div class="rate-info">
        <span id="exchange-rate">Loading exchange rate...</span>
      </div>
      
      <div class="chart-container">
        <canvas id="rateChart"></canvas>
      </div>
    </div>
  `;

  const converterContainer = document.getElementById('converter-container');
  converterContainer.innerHTML = converterHTML;
  converterContainer.style.display = 'block';
  
  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');
  
  // Populate currency dropdowns
  Object.entries(commonCurrencies).forEach(([code, name]) => {
    fromSelect.add(new Option(`${code} - ${name}`, code));
    toSelect.add(new Option(`${code} - ${name}`, code));
  });
  
  // Set default values
  fromSelect.value = 'USD';
  toSelect.value = 'EUR';
  
  // Add event listeners
  document.getElementById('amount').addEventListener('input', updateConversion);
  fromSelect.addEventListener('change', handleCurrencyChange);
  toSelect.addEventListener('change', handleCurrencyChange);
  document.getElementById('swap-currencies').addEventListener('click', swapCurrencies);
  
  // Initial conversion and chart
  handleCurrencyChange();
}

async function updateConversion() {
  const amount = parseFloat(document.getElementById('amount').value);
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;
  
  const rates = await fetchExchangeRates(fromCurrency);
  if (rates) {
    const rate = rates[toCurrency];
    document.getElementById('result').value = (amount * rate).toFixed(2);
    document.getElementById('exchange-rate').textContent = 
      `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
  }
}

async function handleCurrencyChange() {
  await updateConversion();
  
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;
  
  const historicalData = await fetchHistoricalRates(fromCurrency, toCurrency);
  if (historicalData) {
    createChart(
      document.getElementById('rateChart'),
      historicalData.dates,
      historicalData.rates,
      { from: fromCurrency, to: toCurrency }
    );
  }
}

function swapCurrencies() {
  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');
  
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  
  handleCurrencyChange();
}