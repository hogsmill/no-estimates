
export default {

  config: function() {
    return {
      average: 0,
      data: {
        labels: [],
        datasets: [{
          backgroundColor: '',
          pointBackgroundColor: 'white',
          borderWidth: 1,
          pointBorderColor: '#249EBF',
          data: [],
          pointRadius: 0,
          fill: 'none',
          borderWidth: 3,
          borderColor: 'red',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            stepSize: 1,
            gridLines: {display: true}
          },
          x: {
            gridLines: {display: false}
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
