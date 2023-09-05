import ChartWrapper from './ChartWrapper.vue'

const exampleChartData = [
  { date: '2023-08-30', newCases: 881 },
  { date: '2023-08-29', newCases: 896 },
  { date: '2023-08-28', newCases: 993 },
  { date: '2023-08-27', newCases: 883 },
  { date: '2023-08-26', newCases: 776 },
  { date: '2023-08-25', newCases: 905 },
  { date: '2023-08-24', newCases: 895 }
]
const assertNoChart = () => {
  cy.get('#msg').invoke('text').should('include', 'No data to display')
  cy.get('#chartId').should('not.exist')
}

describe('<ChartWrapper />', () => {
  it('can render a chart', () => {
    cy.mount(ChartWrapper, { props: { chartData: exampleChartData, sinceDate: '2020-05-05' } })
    cy.wait(1000)
    cy.get('#chartId')
    cy.get('#msg').should('not.exist')
  })

  it('without any data to display, it renders a helpful message', () => {
    cy.mount(ChartWrapper, { props: { chartData: '', sinceDate: '2020-05-05' } })
    assertNoChart()
  })

  it('does not render a chart when the latest data is dated earlier than the provided since date', () => {
    cy.mount(ChartWrapper, { props: { chartData: exampleChartData, sinceDate: '2023-09-05' } })
    assertNoChart()
  })
})
