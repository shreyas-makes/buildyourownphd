import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { defaultLogger } from '@buildyourownphd/utils'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status: number
    let message: string
    let details: any

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      } else {
        message = (exceptionResponse as any).message || 'An error occurred'
        details = (exceptionResponse as any).details
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Internal server error'
      
      // Log unexpected errors
      defaultLogger.error('Unhandled exception', exception as Error, {
        url: request.url,
        method: request.method,
        statusCode: status,
        requestId: (request as any).requestId,
      })
    }

    // Log HTTP errors (4xx and 5xx)
    if (status >= 400) {
      const logLevel = status >= 500 ? 'error' : 'warn'
      const logMessage = `HTTP ${status}: ${message}`
      
      if (logLevel === 'error') {
        defaultLogger.error(logMessage, exception as Error, {
          url: request.url,
          method: request.method,
          statusCode: status,
          requestId: (request as any).requestId,
        })
      } else {
        defaultLogger.warn(logMessage, {
          url: request.url,
          method: request.method,
          statusCode: status,
          requestId: (request as any).requestId,
        })
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      requestId: (request as any).requestId,
      ...(details && { details }),
    }

    response.status(status).json(errorResponse)
  }
} 