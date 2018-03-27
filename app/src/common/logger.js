const winston = require('winston');

module.exports = {
    info: info,
    error: error,
    warn: warn
};

function info(prefix, message) {
    winston.info(prefix + ' :: ' + message);
}

function error(prefix, message) {
    winston.error(prefix + ' :: ' + message);
}

function warn(prefix, message) {
    winston.warn(prefix + ' :: ' + message);
}
