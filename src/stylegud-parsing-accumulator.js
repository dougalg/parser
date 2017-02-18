/**
 * Accumulates data for parsers
 */
function StylegudParsingAccumulator() {
    this._data = [];
}

StylegudParsingAccumulator.prototype.accumulate = function(data) {
    this._data = this._data.concat(data);
};

StylegudParsingAccumulator.prototype.data = function() {
    return this._data.sort(sortData);
};

/**
 * Sort by reference alphabetically
 *
 * @link http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
 * @param {Object} a The first item
 * @param {Object} b The second item
 * @returns {Number} The sort order
 */
function sortData(a, b) {
    const x = a.reference.toLowerCase();
    const y = b.reference.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0; // eslint-disable-line no-nested-ternary
}

module.exports = { StylegudParsingAccumulator };
