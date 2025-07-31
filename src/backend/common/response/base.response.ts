export class BaseResponse<T = any> {
  success: boolean;
  message: string[]; // array for multiple messages
  data?: T;
  error?: any;
  statusCode: number;

  constructor(params: {
    success: boolean;
    message: string[];
    data?: T;
    error?: any;
    statusCode?: number;
  }) {
    this.success = params.success;
    this.message = params.message;
    this.data = params.data;
    this.error = params.error;
    this.statusCode = params.statusCode ?? (params.success ? 200 : 400);
  }

  static success<T>(message: string, data?: T, statusCode = 200): BaseResponse<T> {
    return new BaseResponse({
      success: true,
      message: [message],
      data,
      statusCode,
    });
  }

  static error(message: string | string[], error?: any, statusCode = 400): BaseResponse {
    return new BaseResponse({
      success: false,
      message: Array.isArray(message) ? message : [message],
      error,
      statusCode,
    });
  }

  static warning(message: string | string[], data?: any, statusCode = 206): BaseResponse {
    return new BaseResponse({
      success: false,
      message: Array.isArray(message) ? message : [message],
      data,
      statusCode,
    });
  }

  static fromException(e: any): BaseResponse {
    let message: string[] = ['Something went wrong'];
    let statusCode = 400;
    let error = 'Bad Request';

    // PostgreSQL unique constraint error (TypeORM)
    if (e.code === '23505') {
      const detail = e.detail || '';
      const match = detail.match(/\((.*?)\)=\((.*?)\)/);
      if (match) {
        const field = match[1];
        const value = match[2];
        message = [`${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`];
      } else {
        message = ['Duplicate entry'];
      }
    }

    else if (Array.isArray(e.message) && e.status === 400) {
      message = e.message;
      error = e.error || 'Bad Request';
    }

    else if (e.response?.message) {
      message = Array.isArray(e.response.message)
        ? e.response.message
        : [e.response.message];
      statusCode = e.response.statusCode || statusCode;
      error = e.response.error || error;
    }

    // Prisma unique constraint error
    else if (e.code === 'P2002') {
      const fields = e.meta?.target?.join(', ') || 'field';
      message = [`${fields} must be unique`];
    }

    // General error
    else if (typeof e.message === 'string') {
      message = [e.message];
    }

    return new BaseResponse({
      success: false,
      message,
      error,
      statusCode,
    });
  }
}
