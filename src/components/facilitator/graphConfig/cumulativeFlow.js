
export default {

  config: function() {
    return {
      data: {
        labels: [],
        datasets: [{
          label: 'Done',
          backgroundColor: 'navy',
          data: [],
          barPercentage: 1,
          categoryPercentage: 1
        }, {
          label: 'Deploy',
          backgroundColor: '#4f0384',
          data: [],
          barPercentage: 1,
          categoryPercentage: 1
        }, {
          label: 'Test',
          backgroundColor: '#0067b1',
          data: [],
          barPercentage: 1,
          categoryPercentage: 1
        }, {
          label: 'Develop',
          backgroundColor: '#76a001',
          data: [],
          barPercentage: 1,
          categoryPercentage: 1
        }, {
          label: 'Design',
          backgroundColor: '#b10018',
          data: [],
          barPercentage: 1,
          categoryPercentage: 1
        }]
      },
      options: {
        tooltips: {
          displayColors: true,
          callbacks:{
            mode: 'x',
          },
        },
        scales: {
          x: {
            stacked: true,
            gridLines: {
              display: false,
            }
          },
          y: {
            stacked: true,
            ticks: {
              beginAtZero: true,
            },
            type: 'linear',
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom' },
      }
    }
  }
}
