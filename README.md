# Stylegud Parser
A holistic parser for generating living styleguides

Stylegud Parser attempts to consolidate other tools that are useful for generating living
styleguides. Plugins can be written for any code parser, and currently exist for KSS, and
JSDoc.

## Installation

`yarn add --dev stylegud-parser`

## Configuration Options

These options can be saved in a config file, package.json under the stylegud
key, or, if using as a node module, passed directly as an object.

```
{
    // Where to pipe output. Default is stdout for cli.
    dest: './stylegud.json',

    // Any number of parsers can be specified. Parsers can be specified
    // more than once
    parsers: [
        {
            // Which parser to use
            parser: 'stylegud-parser-kss',
            // From where to load the data
            src: [ 'src', 'assets/css' ],
            // The default renderer to use for this data
            renderer: 'stylegud-renderer-css'
        },
        {
            parser: 'stylegud-parser-jsdoc',
            src: 'src/**/*.js',
            renderer: 'stylegud-renderer-vue'
        }
    ],

    // Any number of plugins can be specified, which will post-process
    // the results of the parsing.
    plugins: [
        {
            // Which plugin to use
            plugin: 'stylegud-plugin-jsify',
            // Plugins have other options they will specify
            format: 'es6'
            // ...
        }
    ]
}
```

## Examples

### Node Module

```
const StylegudParser = require('./gulp/styleguide/stylegud-parser');

const stylegudConf = require('./stylegud.json');

new StylegudParser(stylegudData)
    // this writes out stylegud.js which exports an object as `sections` using es6
    .run()
    .then((data) => {
        let jsonOutputData = data.filter((d) => d.format === 'json);
        let json = jsonOutputData[0].data;
        // do stuff with the json
    });
```

### CLI

The CLI takes a single argument: a JSON config file.

```
stylegud-parser ./stylegud.json
```

## Markup

### KSS

[Just write regular KSS.](http://warpspire.com/kss/syntax/)

### JSDoc

#### Basic setup
`@styleguide`

Add an `@styleguide` tag to anything you'd like imported. The tag should function
just like KSS' `styleguide` tag, and should contain a dot-separated list of sections
leading to the current section. eg: `components.ui.avatar`

#### Export
`@export | @exports`

Named exports can be set with all the following syntaxes.

See [stylegud-plugin-jsify](https://github.com/stylegud/plugin-jsify) for an example
of how exports can be usefully handled.

```
/**
 * @styleguide test
 */
export const testItem = 'blah; // exports named as testItem

/**
 * @styleguide test
 * @export
 */
const woo = 'blah;             // exports named as woo

/**
 * @styleguide test
 * exports wheee
 */
export const = 'blah;          // exports named as wheee

```
