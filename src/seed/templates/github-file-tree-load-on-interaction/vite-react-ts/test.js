const {runCLI} = require('jest')
const path = require('path')
const fs = require('fs')

runCLI({
 roots: [path.resolve(__dirname, 'tests')],
 json: true,
 testEnvironment: 'jsdom',
 outputFile: path.resolve(__dirname, 'tests.output.json')
 // testRegex: '\\.spec\\.{ts,js,tsx}$'
}, [path.resolve(__dirname)]).finally(() => {
 console.log('TEST_RESULTS_DELIMITER')
 console.log(fs.readFileSync(
  path.resolve(__dirname, 'tests.output.json')
 ).toString())
})
