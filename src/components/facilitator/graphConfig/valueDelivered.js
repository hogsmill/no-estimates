
export default {

  config: function() {
    return {
      data: {
        labels: [],
        datasets: [{
          label: 'Value delivered per team',
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
            stepSize: 200,
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
