import axios from 'axios'

// TODO: Unit testing
// TODO: Cache common requests
class ApiData {
  baseUrl = 'https://api.coronavirus.data.gov.uk/v1/data'

  constructor(area, areaType) {
    if (!area || !areaType) throw new Error('Parameter is not provided')
    this.area = area
    this.areaType = areaType
  }

  queryUrl() {
    return (
      `${this.baseUrl}?` +
      `filters=areaType=${this.areaType};areaName=${this.area}&` +
      `structure={"date":"date","newCases":"newCasesByPublishDateRollingSum"}`
    )
  }

  async getData() {
    const { data, status, statusText } = await axios.get(this.queryUrl(), { timeout: 10000 })

    if (status >= 400) throw new Error(statusText)

    return data.data
  }
}

export default ApiData
