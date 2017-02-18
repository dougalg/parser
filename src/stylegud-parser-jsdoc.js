let jsdoc = require('jsdoc-api');


/**
 * A parser for reading JSDoc and outputting properly formatted objects
 *
 * @param {Object} options The options for the parser
 * @constructor {JSDocParser} JSDocParser
 */
function JSDocParser(options) {
    this.name = 'JSDocParser';
    this.src = options.src;
}

JSDocParser.prototype.parse = function() {
    return jsdoc.explain({
        template: 'jsdoc-json',
        files: this.src
    })
    .then((data) => data.filter(filterJSDoc))
    .then((data) => data.map(conformJSDoc));
};

/**
 * Ensures that only items with an @styleguide tag get included
 *
 * @param {Object} item The particular jsdoc comment to filter in/out
 * @returns {Boolean} Whether to include it or not
 */
function filterJSDoc(item) {
    let tags = item.tags;
    if (!tags) {
        return false;
    }
    return tags.find((tag) => tag.title === 'styleguide');
}


/**
 * Converts a list of tags to an object with properties=tag.title
 *
 * @param {Object[]} tags An array of tags
 * @returns {Object} An object keyed by tag title
 */
function conformTags(tags) {
    let output = {};
    for (let i = 0; i < tags.length; i++) {
        output[tags[i].title] = tags[i];
    }
    return output;
}


/**
 * Converts a JSDoc object into an object that matches the expected format
 * for the styleguide accumulator
 *
 * @param {Object} item The JSDoc item to be conformed
 * @returns {Object} The conformed object
 */
function conformJSDoc(item) {
    const tags = conformTags(item.tags);
    return {
        header: item.name,
        description: item.description,
        reference: tags.styleguide.value,
        markup: tags.markup || '',
        modifiers: tags.modifiers || [],
        source: conformMeta(item, tags)
    };
}

/**
 * Conforms JSDoc meta output to match expected stylegud "source" output
 *
 * @param {Object} item The JSDoc data
 * @returns {Object} The conformed "source" object
 */
function conformMeta(item, tags) {
    const meta = item.meta;
    return {
        line: meta.lineno,
        filename: meta.filename,
        path: meta.path,
        export: getExport(item, tags)
    };
}

const EXPORTS_MATCHER = /^exports\./;

/**
 * Fixes the name of an export export.blah becomes blah
 *
 * @param {String} item The item
 * @returns {String} The modified export value
 */
function getExport(item, tags) {
    console.log(tags);
    const name = item.meta.code.name;
    console.log(name);
    if (name.match(EXPORTS_MATCHER)) {
        return name.replace(EXPORTS_MATCHER, '');
    }
    const exportTag = tags.export || tags.exports;
    if (exportTag) {
        if (exportTag.text) {
            return exportTag.text;
        }
        return item.name;
    }
    return '';
}

module.exports = JSDocParser;
