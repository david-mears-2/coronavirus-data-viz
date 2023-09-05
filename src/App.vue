<script setup>
import { computed, readonly, ref, watch } from 'vue'

import ChartWrapper from './components/ChartWrapper.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import ApiData from './services/apiData'
import areaData from './fixtures/areas'

const errorText = ref('')
const sinceDate = ref('')
const areaTypes = readonly(
  ref([
    { name: 'Nation', value: 'nation' },
    { name: 'Region', value: 'region' },
    { name: 'Upper Tier Local Authority', value: 'utla' },
    { name: 'Lower Tier Local Authority', value: 'ltla' }
  ])
)
const areaType = ref(areaTypes.value[0].value)
const chartData = ref('')
const areas = readonly(ref(areaData))
const area = ref(areas.value[areaType.value][0])
const minDate = readonly(ref(new Date('2020-02-02')))

watch(area, async () => refreshChartData())
// TODO: Improve logic so that changing the since date does not trigger a new API request (but still updates the chart)
watch(sinceDate, async () => refreshChartData())

async function refreshChartData() {
  chartData.value = ''
  if (!allParamsGiven.value) {
    return
  } else {
    try {
      const api = new ApiData(area.value, areaType.value)
      chartData.value = await api.getData()
    } catch (error) {
      errorText.value = 'API Error: ' + error
    }
  }
}

// When area type selection changes, update the selected area to one from the correct type.
const resetArea = () => {
  area.value = areas.value[areaType.value][0]
}
const allParamsGiven = computed(() => {
  return !!area.value && !!sinceDate.value
})
const readableDate = computed(() => {
  return new Date(sinceDate.value).toLocaleDateString() // TODO: Make all the visible date formats consistent
})
const areaOptions = computed(() => areas.value[areaType.value])
</script>

<!-- TODO: Split out the form inputs into a separate child component, and/or convert this file into a page-specific component under src/views/ -->
<template>
  <header>
    <div class="wrapper headings">
      <h1 class="green">COVID-19 case data portal</h1>
      <h3 v-show="allParamsGiven">
        Viewing a 7-day rolling average number of cases in
        <span class="green">{{ area }}</span> since
        <span class="green">{{ readableDate }}</span>
        by publication date.
      </h3>
    </div>

    <div class="error" v-show="errorText">{{ errorText }}</div>

    <div class="inputs">
      <div>
        <label for="areaType">Area type: </label>
        <select id="areaType" v-model="areaType" @change="resetArea">
          <option disabled value="">Select one</option>
          <option v-for="areaType in areaTypes" :key="areaType.value" :value="areaType.value">
            {{ areaType.name }}
          </option>
        </select>
      </div>
      <div>
        <label for="area">Area: </label>
        <select id="area" v-model="area">
          <option disabled value="">Select one</option>
          <option v-for="area in areaOptions" :key="area">{{ area }}</option>
        </select>
      </div>
      <div>
        <label>Start date: </label>
        <VueDatePicker
          id="date"
          v-model="sinceDate"
          :enable-time-picker="false"
          :format="'dd MMM yyyy'"
          :min-date="minDate"
          :max-date="new Date()"
          :start-date="new Date('01-01-2022')"
          placeholder="Choose a date"
          auto-apply
        ></VueDatePicker>
        <!-- start-date defines the default date when datepicker is first opened -->
      </div>
    </div>
  </header>

  <main>
    <ChartWrapper :chartData="chartData" :sinceDate="sinceDate" v-show="allParamsGiven" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

main {
  margin-top: 1rem;
}

#date {
  width: 250px;
}

.headings {
  h1 {
    font-weight: 500;
    font-size: 2rem;
    position: relative;
    top: -10px;
  }

  h3 {
    font-size: 1.2rem;
  }

  h1,
  h3 {
    text-align: center;
  }
}
.error {
  color: red;
}

.inputs {
  margin-top: 1rem;
}
</style>
