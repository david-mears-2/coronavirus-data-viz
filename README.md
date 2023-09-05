# Coronavirus case data portal

An app for viewing cases over time in your area.

Things I didn't get round to doing are marked 'TODO' inline.

## Running the app

### Versions

* Node version: v16.17.0
* npm version: 8.15.0
* Vue version: 3.3.4

### Set up the app by installing dependencies
```
npm install
```

### Run the app locally
```
npm run dev
```

### Running tests
#### Unit tests

I didn't have time to write unit tests; but most of the things eligible for unit testing are implicitly tested by the component or end-to-end tests, for example, the filtering of the API data by date (in `ChartWrapper`'s `parsedData` computed method).
#### Component tests
```
npm run test:component:dev
```

This boots up Cypress.
Then click on Chrome > E2E Testing

#### End-to-end tests
```
npm run test:e2e:dev
```

This boots up Cypress.
Then click on Chrome > Component Testing

### Code quality

The project uses ESLint and Prettier.

To lint, run `npm run lint`. To format, run `npm run format`.
