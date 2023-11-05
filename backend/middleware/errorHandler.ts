import { Request, Response, NextFunction} from "express";

export const errorHandler = (res: Response, statusCode=500, message = "Internal Server Error") => {
    return res.status(statusCode).json({
        success: false,
        message
    });
}

// export const asyncErrorHandler = (passedFunc: any) => (req: Request, res: Response) => {
//     return Promise.resolve(passedFunc(req, res)).catch((err) => {
//         return errorHandler(err, 500, err.message);
//     })
// }

export const asyncErrorHandler = (passedFunc: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await passedFunc(req, res, next);
    } catch (err) {
        console.error("Async Error Handler:", err);
        return errorHandler(res, 500);
    }
} // both functions are used to create middleware for handling errors in an Express application, but the second function is specialized for working with asynchronous code and includes proper async/await handling. It also provides better error logging by catching errors and logging them to the console before passing them to the errorHandler. 


// Higher-Order Function: asyncErrorHandler is a higher-order function because it returns another function. Higher-order functions are functions that operate on other functions, either by taking them as arguments or by returning them.

// Arrow Function Syntax: The entire asyncErrorHandler is defined using arrow function syntax, which is a concise way to write functions in JavaScript and TypeScript.

// Function Signature: (passedFunc: Function) is the parameter list for the asyncErrorHandler function. It takes one parameter named passedFunc, which is expected to be a function.

// Returned Function: The main part of asyncErrorHandler is the function it returns:

// (req: Request, res: Response) => {
//     return Promise.resolve(passedFunc(req, res)).catch((err) => {
//         return errorHandler(err, 500, err.message);
//     })
// }
// (req: Request, res: Response) => { ... } is an anonymous function that takes two parameters: req (an Express.js request object) and res (an Express.js response object). This function is the one that gets executed when you use asyncErrorHandler.

// Promise.resolve(passedFunc(req, res)) is used to execute the passedFunc function with the req and res parameters. It returns a promise that resolves to the result of passedFunc(req, res).

// .catch((err) => { ... }) is used to handle any errors that might occur when executing passedFunc. If an error occurs, it invokes the errorHandler function with the err object, an HTTP status code of 500 (Internal Server Error), and the error message.

// So, in essence, asyncErrorHandler is a utility function that wraps another function (passedFunc) and ensures that any errors thrown by passedFunc are caught and handled using an errorHandler. This is often used in Express.js middleware to handle asynchronous errors that might occur during request processing