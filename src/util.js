/**
 * Creates a referenceURI for all items in our dataset
 *
 * @param {Object[]} sections All the sections we've accumulated
 * @returns {Object[]} The sections
 */
function setReferences(sections) {
    sections.forEach((item) => {
        item.referenceURI = uriify(item.reference);
    });
    return sections;
}

/**
 * Converts a reference to a URI. Copied from KSS for consistency
 *
 * @link https://github.com/kss-node/kss-node/blob/e651226e04fb3c5755e68f7b3959d765c240358d/lib/kss_section.js#L347
 * @param {String} ref The reference to make URLable
 * @returns {String} The URIified reference
 */
function uriify(ref) {
    return ref.replace(/ \- /g, '-')
        .replace(/[^\w-]+/g, '-')
        .toLowerCase();
}

/**
 * Attempts to load a config from string, package.json
 * or passed in object
 *
 * @param {String|Object} options
 * @returns {Object}
 * @throws
 */
function getOptions(options) {
    // Try to load a string
    if (typeof options === 'string') {
        return require(options);
    }
    // Look in package.json
    if (options === undefined) {
        if (process.env.npm_package_stylegud) {
            return process.env.npm_package_stylegud;
        }
        throw Error('No configuration specified');
    }
    // Return what's left
    return options;
}

module.exports = { setReferences, uriify, getOptions };
