<script setup>
import { computed, readonly, ref } from 'vue'
import { Line } from 'vue-chartjs'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'

import chartDefaultConfig from './vueChartJSDefaultConfig.js'

const props = defineProps(['chartData', 'sinceDate'])

// TODO: Unit-test the date filter.
// TODO: Reduce number of data points when large, for easier reading of chart
// This function converts data from the format used in the API response to the format required by
// VueChartJS, filtered by the user-input start date.
const parsedData = computed(() => {
  let data = []
  if (props.chartData) {
    data = props.chartData.map((dataPoint) => ({ x: dataPoint.date, y: dataPoint.newCases }))
  }
  data = data.filter((dataPoint) => {
    return new Date(dataPoint.x).getTime() >= new Date(props.sinceDate).getTime()
  })
  return { datasets: [{ data: data }] }
})

const chartOptions = readonly(ref(chartDefaultConfig))
</script>

<template>
  <div class="chartContainer">
    <Line
      id="chartId"
      :options="chartOptions"
      :data="parsedData"
      v-if="parsedData.datasets[0].data.length > 0"
    />
    <p id="msg" v-else>No data to display. Try an earlier start date.</p>
  </div>
</template>

<style scoped>
.chartContainer {
  position: relative;
  height: 75%;
  width: 75%;
  margin: auto;
}
#msg {
  text-align: center;
  font-weight: bold;
}
</style>
