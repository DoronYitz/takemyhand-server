/**
 * CustomError class to add status code easier
 */
class CustomError extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.status = status;
    this.message = message;
  }
}
export default CustomError;
