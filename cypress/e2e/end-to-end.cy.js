const fillForm = (areaType, areaName) => {
  cy.visit('/')
  cy.get("#areaType").select(areaType)
  cy.get("#area").select(areaName)
  cy.get('[placeholder="Choose a date"]').click()
  cy.contains('23').click()
}

describe('end-to-end tests', () => {
  it('can request data for a specific area and time period, and display a chart', () => {
    const areaType = 'region'
    const areaName = 'London'

    cy.intercept({
      url: `https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=${areaType};areaName=${areaName}&structure=%7B%22date%22:%22date%22,%22newCases%22:%22newCasesByPublishDateRollingSum%22%7D`,
      method: 'GET',
    },
    {
      fixture: 'london_region_cases_response.json'
    }).as('getCoronavirusDataForLondon')

    fillForm(areaType, areaName)
    cy.wait('@getCoronavirusDataForLondon')
    cy.contains(
      `Viewing a 7-day rolling average number of cases in ${areaName} since 23/01/2022 by publication date.`
    )
    cy.wait(1000) // Useful for visual testing - ensures canvas is painted by the time the snapshot is taken
    cy.get("#chartId").should('exist')
  })

  it('can handle API request failing', () => {
    const areaType = 'nation'
    const areaName = 'Wales'

    cy.intercept({
      url: `https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=${areaType};areaName=${areaName}&structure=%7B%22date%22:%22date%22,%22newCases%22:%22newCasesByPublishDateRollingSum%22%7D`,
      method: 'GET',
    },
    {
      forceNetworkError: true
    }).as('failedRequest')

    fillForm(areaType, areaName)
    cy.wait('@failedRequest')
    cy.contains(
      `Viewing a 7-day rolling average number of cases in ${areaName} since 23/01/2022 by publication date.`
    )
    cy.contains(`Error`)
    cy.contains(`No data to display`)
    cy.get("#chartId").should('not.exist')
  })
})
