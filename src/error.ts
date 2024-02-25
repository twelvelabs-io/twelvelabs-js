export class TwelveLabsError extends Error {}

export class APIError extends Error {
  status: number | undefined;
  body: any;
  headers: Headers | undefined;

  constructor(message: string, status?: number, body?: any, headers?: Headers) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.body = body;
    this.headers = headers;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class APIConnectionError extends APIError {
  constructor(message: string = 'Connection error.', body?: any) {
    super(message, undefined, body);
  }
}

export class APITimeoutError extends APIError {
  constructor(message: string = 'Request timed out.', body?: any) {
    super(message, undefined, body);
  }
}

export class BadRequestError extends APIError {}
export class UnauthorizedError extends APIError {}
export class ForbiddenError extends APIError {}
export class NotFoundError extends APIError {}
export class MethodNotAllowedError extends APIError {}
export class ConflictError extends APIError {}
export class TooManyRequestsError extends APIError {}
export class InternalServerError extends APIError {}
