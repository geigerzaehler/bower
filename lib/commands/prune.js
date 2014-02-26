var deepFillIn = require('mout/object/deepFillIn');
var mixIn = require('mout/object/mixIn');
var size = require('mout/object/size');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function prune(config) {
    var project;
    var logger = new Logger();

    config = deepFillIn(config || {}, defaultConfig);
    project = new Project(config, logger);

    clean(project)
    .done(function (removed) {
        logger.emit('end', removed);
    }, function (error) {
        logger.emit('error', error);
    });

    return logger;
}

function clean(project, removed) {
    removed = removed || {};

    // Continually call clean until there is no more extraneous
    // dependencies to remove
    return project.getTree()
    .spread(function (tree, flattened, extraneous) {
        var names = extraneous.map(function (extra) {
            return extra.endpoint.name;
        });

        // Uninstall extraneous
        return project.uninstall(names)
        .then(function (uninstalled) {
            // Are we done?
            if (!size(uninstalled)) {
                return removed;
            }

            // Not yet, recurse!
            mixIn(removed, uninstalled);
            return clean(project, removed);
        });
    });
}

// -------------------

prune.line = function () {
    return prune();
};

prune.options = function (argv) {
    return cli.readOptions(argv);
};

prune.completion = function () {
    // TODO:
};

module.exports = prune;
