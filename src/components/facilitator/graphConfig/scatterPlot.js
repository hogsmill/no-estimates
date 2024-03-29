
export default {

  config: function() {
    return {
      data: {
        labels: [],
        datasets: [{
          pointRadius: 8,
          pointHoverRadius: 12,
          backgroundColor: '#f87979',
          pointBackgroundColor: '#f87979',
          borderWidth: 1,
          pointBorderColor: '#249EBF',
          data: []
        }]
      },
      limits: {
        75: 0,
        90: 0,
        95: 0,
        99: 0
      },
      options: {
        scales: {
          x: {type: 'linear', position: 'bottom', beginAtZero: true},
          y: {
            beginAtZero: true
          }
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[0].data[tooltipItem.index].label
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  }
}
