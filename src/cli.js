#!/usr/bin/env node
const program = require('commander');
const pkg = require('../package.json');
const StylegudParser = require('./stylegud-parser');

program
    .version(pkg.version)
    .arguments('[conf]')
    .parse(process.argv);

const parser = new StylegudParser(program.conf);
parser.run().then((data) => {
    if (parser.dest === 'stdout') {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        console.log(data);
    }
});
