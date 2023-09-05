import axios from 'axios'

// TODO: Deal with pagination ('the maximum limit of the API is currently set to 1000 records per request').

const endpoint = (area, areaType) => {
  return (
    `https://api.coronavirus.data.gov.uk/v1/data?` +
    `filters=areaType=${areaType};areaName=${area}&` +
    `structure={"date":"date","newCases":"newCasesByPublishDateRollingSum"}`
  )
}

const getDataFromAPI = async (area, areaType) => {
  const url = endpoint(area, areaType)
  const { data, status, statusText } = await axios.get(url, { timeout: 10000 })

  if (status >= 400) throw new Error(statusText)

  return data.data
}

export default getDataFromAPI
