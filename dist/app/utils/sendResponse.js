"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    // Convert the data object to plain object if it contains methods (e.g., a Mongoose document)
    const responseData = JSON.parse(JSON.stringify(data.data));
    // Check if responseData is an empty array or null/undefined
    const isEmptyData = Array.isArray(responseData) && responseData.length === 0;
    // If no data is found, set the appropriate message and status code
    if (isEmptyData) {
        data.success = false;
        data.statusCode = 404;
        data.message = "No Data Found";
    }
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
