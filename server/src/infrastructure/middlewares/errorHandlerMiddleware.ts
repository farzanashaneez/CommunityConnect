import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Differentiate between development and production error responses
  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      success: false,
      error: message,
      stack: err.stack,
    });
  } else {
    // In production, don't leak error details
    res.status(statusCode).json({
      success: false,
      error: statusCode === 500 ? 'Internal Server Error' : message,
    });
  }
};

export default errorHandler;