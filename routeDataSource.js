const parseRequest = require('./parseRequest');

module.exports = function routeDataSource(dataSource) {
    return (req, res, next) => {
        let obs;
        const context = parseRequest(req);

        if (context.method === "set") {
            obs = dataSource.set(context.jsonGraph);
        } else if (context.method === "get") {
            obs = dataSource.get(context.path);
        } else {
            if (context.method == null || context.method.length === 0) {
                return res.status(500).send("No query method provided");
            }

            return res.status(500).send("Data source does not implement the requested method");
        }

        obs.subscribe(
            jsonGraphEnvelope => {
                res.status(200).json(jsonGraphEnvelope);
            },
            err => {
                if (err instanceof Error) {
                    return next(err);
                }
                res.status(500).send(err);
            });
    };
};
