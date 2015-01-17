var isString = require("is_string");


function Cors(opts) {
    opts || (opts = {});

    this.origin = isString(opts.origin) ? opts.origin : "*";
    this.methods = isString(opts.methods) ? opts.methods : (opts.methods && opts.methods.length ? opts.methods.join(",") : "GET,POST,PUT,PATCH,HEAD,DELETE");
    this.credentials = opts.credentials === true ? "true" : "false";
    this.allowedHeaders = isString(opts.allowedHeaders) ? opts.allowedHeaders : (opts.allowedHeaders && opts.allowedHeaders.length ? opts.allowedHeaders.join(",") : null);
    this.exposedHeaders = isString(opts.exposedHeaders) ? opts.exposedHeaders : (opts.exposedHeaders && opts.exposedHeaders.length ? opts.exposedHeaders.join(",") : null);
    this.maxAge = !!opts.maxAge ? opts.maxAge.toString() : null;
}

Cors.express = function(opts) {
    var cors = new Cors(opts);

    return function(req, res, next) {

        cors.middleware(req, res, next);
    };
};

Cors.connect = Cors.express;

Cors.prototype.middleware = function(req, res, next) {
    var headers = this.allowedHeaders || req.headers["access-control-request-headers"];

    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", this.origin);
        res.setHeader("Access-Control-Allow-Methods", this.methods);
        res.setHeader("Access-Control-Allow-Credentials", this.credentials);

        if (headers) {
            res.setHeader("Access-Control-Allow-Headers", headers);
        }
        if (this.exposedHeaders) {
            res.setHeader("Access-Control-Expose-Headers", this.exposedHeaders);
        }
        if (this.maxAge) {
            res.setHeader("Access-Control-Max-Age", this.maxAge);
        }

        res.statusCode = 204;
        res.end();
    } else {
        res.setHeader("Access-Control-Allow-Origin", this.origin);
        res.setHeader("Access-Control-Allow-Credentials", this.credentials);

        if (this.exposedHeaders) {
            res.setHeader("Access-Control-Expose-Headers", this.exposedHeaders);
        }
    }

    next();
};


module.exports = Cors;
