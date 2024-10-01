"use strict";
// swaggerOptions.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = void 0;
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "API documentation for the Express app",
    },
    servers: [
        {
            url: "http://localhost:5000", // Your server URL
            description: "Development server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};
exports.swaggerOptions = {
    swaggerDefinition,
    apis: ["./src/app/modules/**/*.ts"], // Path to your route files
};
