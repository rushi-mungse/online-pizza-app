class CustomErrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    static alredyExist(message) {
        return new CustomErrorHandler(409, message);
    }
    static wrongCredentials(message = 'Username and Password wrong!') {
        return new CustomErrorHandler(401, message);
    }
    static unAuthorized(message = 'unAuthorized!') {
        return new CustomErrorHandler(401, message);
    }
    static userNotFound(message = '404 NOT FOUND!') {
        return new CustomErrorHandler(404, message);
    }
    static serverError(message = 'Server error!') {
        return new CustomErrorHandler(500, message);
    }
}
export default CustomErrorHandler;





























