#  Playwright Report in Testquality.com 

Testquality reporter for Playwright.
It can be convenient to publish test results when running regression


## Version

Demo - not stable version

## Installation 

Run following commands:

### npm

`npm mr-anton-t/playwright-testquality-report `

### yarn

`yarn add mr-anton-t/playwright-testquality-report`

## Configuration

Modify your `playwright.config.ts` file to include the reporter:

```typescript
  reporter: [
    ['@mr-anton-t/playwright-report', { configFile: 'configFile.json' }]],
    ['html'], // other reporters
    ['dot']
  ]
```

## Default Output 

@todo

## Customizing 

@todo
