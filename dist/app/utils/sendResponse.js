"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    // Convert the data object to plain object if it contains methods (e.g., a Mongoose document)
    const responseData = JSON.parse(JSON.stringify(data.data));
    // Remove the password field if it exists
    if (responseData.password) {
        delete responseData.password;
    }
    // Construct the response object
    const responseObject = {
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: responseData,
    };
    // Conditionally add the token to the response object
    if (data.token) {
        responseObject.token = data.token;
    }
    // Send the response
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json(responseObject);
};
exports.default = sendResponse;
