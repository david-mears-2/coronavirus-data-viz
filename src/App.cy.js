import App from './App.vue'

// TODO: Work out why tests are flakey
describe('<App />', () => {
  describe('with successful network requests', () => {
    beforeEach(() => {
      cy.intercept(
        {
          url: `https://api.coronavirus.data.gov.uk/v1/data*`,
          method: 'GET'
        },
        {
          data: [
            { date: '2022-09-12', newCases: '10' },
            { date: '2022-09-13', newCases: '11' }
          ]
        }
      ).as('getData')

      cy.mount(App)
    })

    it('initializes with an areaType and area pre-selected', () => {
      cy.get('#areaType').should('have.value', 'nation')
      cy.get('#area').should('have.value', 'England')
    })

    it('does not accept a date earlier than minDate or later than today', () => {
      cy.get('[placeholder="Choose a date"]').click()
      cy.contains('2022').click() // Open year selector
      cy.contains('2019').click()
      cy.get('[placeholder="Choose a date"]').should('have.value', '')
      cy.contains(parseInt(new Date().getFullYear()) + 2).click()
      cy.get('[placeholder="Choose a date"]').should('have.value', '')
    })

    it('can update the ChartWrapper props when all user-input params are selected', () => {
      cy.get('[placeholder="Choose a date"]').click()
      cy.contains('23').click()
      cy.wait('@getData')
      cy.get('#chartId').should('exist')
    })
  })

  // flakey
  describe('when the API responds with an error', () => {
    it('shows error text', () => {
      cy.intercept(`https://api.coronavirus.data.gov.uk/v1/data*`, { forceNetworkError: true }).as(
        'failedRequest'
      )
      cy.mount(App)

      cy.get('[placeholder="Choose a date"]').click()
      cy.contains('23').click()
      cy.wait('@failedRequest')
      cy.get('#chartId').should('not.exist')
      cy.contains('Network Error')
    })
  })

  // flakey
  it('updates the area options when a new areaType is selected', () => {
    cy.mount(App, { shallow: true }) // Stub out all child components

    cy.get('#area').should('have.value', 'England')
    cy.get('#areaType').should('have.value', 'nation')
    cy.get('#areaType').select('region')
    cy.get('#area').should('have.value', 'East Midlands')
  })
})
