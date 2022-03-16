
export default {

  config: function() {
    return {
      data: {
        labels: [],
        datasets: [{
          backgroundColor: '',
          pointBackgroundColor: 'white',
          borderWidth: 1,
          pointBorderColor: '#249EBF',
          data: []
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            gridLines: {display: true},
            scaleLabel: {
              display: true,
              labelString: 'Days to complete'
            }
          },
          x: {
            gridLines: {display: false},
            scaleLabel: {
              display: true,
              labelString: 'Card Number'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  }
}
