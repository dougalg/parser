const REQUIRED_FIELDS = [
    'header',
    'description',
    'reference',
    'markup',
    'modifiers'
];

/**
 * A parser which wraps calls to other concrete parsers and enforces
 * validation and accumulation of data
 *
 * @param {StylegudBaseParser} StylegudBaseParser A concrete StylegudBaseParser
 * @param {Object} options An object with additional options for instantiation
 * @param {String} options.renderer A string of a renderer to be loaded later
 */
function ParserWrapper(StylegudBaseParser, options) {
    this.renderer = options.renderer;
    this.parser = new StylegudBaseParser(options);
}

/**
 * Runs the concrete StylegudBaseParser and validates its results
 *
 * @param {StylegudParsingAccumulator} acc An accumulator of the parsing results of all parsers
 * @returns {Promise} A promise resolved with an Object when parsing completes
 */
ParserWrapper.prototype.parse = function(acc) {
    return this.parser.parse()
        .then((data) => data.map((datum) => {
            datum.renderer = datum.renderer || this.renderer;
            return datum;
        }))
        .then((data) => this.validate(data))
        .then((data) => acc.accumulate(data));
};

/**
 * Validates the result of a parse by ensuring no required fields are missing
 *
 * @param {Object} data The results of parsing
 * @throws {ValidationError} Throws if validation fails
 * @returns {Object} The validated data
 */
ParserWrapper.prototype.validate = function(data) {
    data.forEach((datum) => {
        REQUIRED_FIELDS.forEach((name) => {
            if (!datum.hasOwnProperty(name)) {
                throw Error(`${this.parser.name } - Invalid parser output. Missing property "${name}" in parsed result.`);
            }
        });
    });
    return data;
};

module.exports = ParserWrapper;
