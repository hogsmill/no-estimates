
export default {

  config: function() {
    return {
      data: {
        labels: [],
        datasets: [{
          backgroundColor: '#f87979',
          pointBackgroundColor: 'white',
          borderWidth: 1,
          pointBorderColor: '#249EBF',
          data: []
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            gridLines: {display: true},
            scaleLabel: {
              display: true,
              labelString: 'Number of cards'
            }
          },
          x: {
            gridLines: {display: false},
            scaleLabel: {
              display: true,
              labelString: 'Number of days to complete'
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
