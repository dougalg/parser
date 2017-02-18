const fs = require('fs');
const ParserWrapper = require('./stylegud-parser-wrapper');
const { setReferences, getOptions } = require('./util');
const { StylegudParsingAccumulator } = require('./stylegud-parsing-accumulator');

/**
 * Manages all parsing for styleguides
 *
 * @param {Object|String} [options] Optional options. May be a string location of conf file
 * @param {Object} [options.parsers=Object] An object whose keys are parsers to load and use.
 * Each parser is given specific parameters specifying from where which files to parse data.
 * @param {Object[]} [options.plugins=Array] An object which implements a run method
 * @param {Object} [options.output=Object] An array of objects which are used to specify output
 * formatting.
 */
function StylegudParser(options) {
    options = getOptions(options);
    this.initParsers(options.parsers || []);
    this.initPlugins(options.plugins || []);
    this.dest = options.dest || 'stdout'; // stdout is a special case for CLI
}

/**
 * Loads all requested parsers
 *
 * @param {StylegudBaseParser[]} parsers The parsers to use
 */
StylegudParser.prototype.initParsers = function(parsers) {
    this.parsers = parsers.map((conf) => new ParserWrapper(require(`./${conf.parser}`), conf));
};

/**
 * Loads all requested plugins
 *
 * @param {Object[]} plugins The plugins to use
 */
StylegudParser.prototype.initPlugins = function(plugins) {
    this.plugins = plugins.map((conf) => {
        const Plugin = require(conf.plugin);
        return new Plugin(conf);
    });
};

/**
 * Does the thing
 *
 * @returns {Promise} A promise resolving when all parsers have run, data has been
 * formatted, plugins applied, and oupt written to files. Resolves with all output
 * objects and their result data [ { data, format, dest, export }, ... ]
 */
StylegudParser.prototype.run = function() {
    const accumulator = new StylegudParsingAccumulator();
    const promises = this.parsers.map((parser) => parser.parse(accumulator));

    return Promise.all(promises)
        .then(() => accumulator.data())
        .then(setReferences)
        .then((json) => this.applyPlugins(json))
        .then((data) => this.writeOut(data));
};

StylegudParser.prototype.applyPlugins = function(data) {
    return this.plugins.reduce((acc, plugin) => plugin.run(acc), data);
};

StylegudParser.prototype.writeOut = function(data) {
    return new Promise((resolve) => {
        if (this.dest === 'stdout') {
            resolve();
            return;
        }
        fs.writeFile(this.dest, data, () => {
            console.log(`Wrote ${this.dest}`);
            resolve(data);
        });
    });
};

module.exports = StylegudParser;
