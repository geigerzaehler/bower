var forOwn = require('mout/object/forOwn');
var map = require('mout/object/map');
var camelCase = require('mout/string/camelCase');
var nopt = require('nopt');
var renderers = require('../renderers');

function readOptions(options, argv) {
    var types;
    var noptOptions;
    var parsedOptions = {};
    var shorthands = {};

    if (Array.isArray(options)) {
        argv = options;
        options = {};
    } else {
        options = options || {};
    }

    types = map(options, function (option) {
        return option.type;
    });
    forOwn(options, function (option, name) {
        shorthands[option.shorthand] = '--' + name;
    });

    noptOptions = nopt(types, shorthands, argv);

    // Filter only the specified options because nopt parses every --
    // Also make them camel case
    forOwn(noptOptions, function (value, key) {
        if (options[key]) {
            parsedOptions[camelCase(key)] = value;
        }
    });

    parsedOptions.argv = noptOptions.argv;

    return parsedOptions;
}

function getRenderer(command, json, config) {
    if (config.json || json) {
        return new renderers.Json(command, config);
    }

    return new renderers.Standard(command, config);
}

module.exports.readOptions = readOptions;
module.exports.getRenderer = getRenderer;
