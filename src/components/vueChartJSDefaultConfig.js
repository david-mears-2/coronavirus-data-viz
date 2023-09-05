const chartDefaultConfig = {
  elements: {
    line: {
      borderWidth: 2
    },
    point: {
      pointStyle: false,
      pointHitRadius: 2
    }
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
        displayFormats: {
          day: 'd MMM ‘yy'
        }
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Cases (rolling 7-day average)'
      }
    }
  },
  responsive: true,
  resizeDelay: 50,
  plugins: {
    legend: {
      display: false
    }
  },
  animation: false
}

export default chartDefaultConfig
