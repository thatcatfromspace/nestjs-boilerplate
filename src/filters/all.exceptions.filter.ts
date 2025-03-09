import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { MyLogger } from '../modules/logger/logger.service';

interface ErrorResponse {
  statusCode: number;
  message: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const logger = new MyLogger();

    let responseBody: ErrorResponse;
    let httpStatus: number;

    if (exception instanceof HttpException) {
      logger.setContext(exception.name);
      logger.error(exception.message);
      httpStatus = exception.getStatus();
      responseBody = {
        statusCode: httpStatus,
        message: exception.message,
      };
    } else if (typeof exception === 'object' && exception !== null) {
      const exceptionObj = exception as Record<string, any>;
      logger.setContext(exceptionObj.name || 'UnknownException');
      logger.error(exceptionObj.message || 'No message available');
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        statusCode: httpStatus,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        message: exceptionObj.message || 'Internal server error',
      };
    } else {
      logger.setContext('UnknownException');
      logger.error('No message available');
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        statusCode: httpStatus,
        message: 'Internal server error',
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
