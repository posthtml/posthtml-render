const test = require('node:test');
const suite = require('./suite.cjs');

suite(test, require('../dist'), require('posthtml-parser').default);
