import {
    ArgumentsHost, Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { error } from 'console';
import { Request, Response } from 'express';
import { OutputErrorsType } from 'src/base/types/output-errors.types';

  // https://docs.nestjs.com/exception-filters
@Catch(HttpException)
    export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST) {
        const errorsResponse = new OutputErrorsType();
        const responseBody: any = exception.getResponse();

        // responseBody.message.forEach((m) => errorsResponse.errorsMessages.push(m));
        if (Array.isArray(responseBody.message)) {
            responseBody.message.forEach((e) =>
            errorsResponse.errorsMessages.push(e));
        } else {
            errorsResponse.errorsMessages.push(responseBody);
        }
        return response.status(status).send(errorsResponse);
    }
    if(status === HttpStatus.UNAUTHORIZED) {
        return response.sendStatus(401)
    }
    if(status === 429) {
        return response.sendStatus(429)
    }
        response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        });
    }
}