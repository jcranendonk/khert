const url = require("url");

const parseArgs = {
    "callPath": true,
    "jsonGraph": true,
    "path": true,
};

module.exports = function parseRequest(req) {
    const queryMap = req.method === "POST" ? req.body : req.query;
    const context = {};

    if (queryMap) {
        for (const key of Object.keys(queryMap)) {
            const arg = queryMap[key];

            if (parseArgs[key] && arg) {
                context[key] = JSON.parse(arg);
            } else {
                context[key] = arg;
            }
        }
    }

    return context;
};
