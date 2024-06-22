import { Response } from "express";

// Define the TResponse type with an optional token
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
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
  const responseObject: Record<string, unknown> = {
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
  res.status(data?.statusCode).json(responseObject);
};

export default sendResponse;
