exports.config = {
 
  // location of E2E test specs
  specs: [
    './e2e-spec.js'
  ],
 
  // configure multiple browsers to run tests
  multiCapabilities: [{
    'browserName': 'firefox'
  }, {
    'browserName': 'chrome'
  }],
 
  // or configure a single browser
  /*
  capabilities: {
    'browserName': 'chrome'
  }
  */
 
  // url where app is running, relative URLs are prepending with this URL
  baseUrl: 'http://localhost:9000/',
 
  // testing framework, jasmine is the default
  framework: 'jasmine'
};