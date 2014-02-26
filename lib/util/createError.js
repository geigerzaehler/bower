var mixIn = require('mout/object/mixIn');

function createError(msg, code, props) {
    var err = new Error(msg);
    err.code = code;

    if (props) {
        mixIn(err, props);
    }

    return err;
}

module.exports = createError;
