import Chart from 'chart.js/auto';

let chart = null;

export function createChart(container, dates, rates, currencies) {
  if (chart) {
    chart.destroy();
  }

  const ctx = container.getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: `${currencies.from}/${currencies.to} Exchange Rate`,
        data: rates,
        borderColor: '#646cff',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Exchange Rate History (7 Days)'
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}