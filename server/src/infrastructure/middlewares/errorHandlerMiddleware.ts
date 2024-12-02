import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  errors?: any;
  code?:number;
  keyValue?: Record<string, any>;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // if (err.name === 'TokenExpiredError') {
  //   return res.status(401).json({ message: 'TokenExpiredError' });
  // }
  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not Found';
  }
  else if (err.code === 11000 && err.keyValue) {
    statusCode = 409; // Conflict
    const fieldName = Object.keys(err.keyValue || {})[0]; // Ensure keyValue is an object
    message = `Duplicate value found - ${fieldName} already exists "`;
  }
  

  const response: any = {
    success: false,
    status: statusCode,
    message: message,
  };

  if (err.name === 'ValidationError' && err.errors) {
    response.errors = Object.values(err.errors).map((error: any) => error.message);
  }

  // Differentiate between development and production error responses
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  console.error("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",response);

  res.status(statusCode).json(response);
};

export default errorHandler;