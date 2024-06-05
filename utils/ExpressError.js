class ExpressError extends Error {
    constructor(status) {
        super();
        this.statusCode = statusCode;
        this.message = this.message;
    }
}

module.exports = ExpressError;