const pathModule = require('path');
const kss = require('kss');


/**
 * A parser for KSS data, usually found in CSS
 *
 * @param {Object} options The options passed by a user for this parser
 * @param {String|String[]} options.src An string or array of string paths for
 * files to parse, may be globs
 */
function KSSParser(options) {
    this.name = 'KSSParser';
    this.src = options.src;
}

/**
 * Parses files for KSS into an object
 *
 * @returns {Promise} A promise resolving to an object of parsed data
 */
KSSParser.prototype.parse = function() {
    return kss({
        source: this.src,
        markdown: false,
        json: true
    })
    .then((data) => data.sections)
    .then((sections) => sections.map(conformKss));
};

/**
 * Conforms an object to fit expected values for Stylegud section data
 *
 * @param {Object} section The non-conformant section
 * @returns {Object} The conformed section
 */
function conformKss(section) {
    const src = section.source;
    const filename = pathModule.basename(src.filename);
    const path = pathModule.dirname(src.path);
    section.source = {
        filename,
        path,
        line: src.line
    };
    return section;
}

module.exports = KSSParser;
