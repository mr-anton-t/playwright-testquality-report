#  Playwright Report for Testquality.com 
![GitHub last commit](https://img.shields.io/github/last-commit/mr-anton-t/playwright-testquality-report)
![GitHub License](https://img.shields.io/github/license/mr-anton-t/playwright-testquality-report)
![Visits Badg](https://komarev.com/ghpvc/?username=mr-anton-t-report&style=flat-square&color=lightgrey&label=views)

It can be convenient to publish test results when running regression.


## Version

Demo - not stable version

## Installation 

Run the following commands:

### npm

`npm mr-anton-t/playwright-testquality-report`

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
