import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
// implements RpcExceptionFilter<RpcException>
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    // catch(exception: RpcException, host: ArgumentsHost): Observable<any> {

    console.log('Rpc exception detected and catched');

    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    const rpcError = exception.getError();

    console.log({ rpcError });

    console.log(exception.name);

    if (rpcError.toString().includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        message: rpcError
          .toString()
          .substring(0, rpcError.toString().indexOf('(') - 1),
      });
    }

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;

      return response.status(status).json(rpcError);
    }

    // return throwError(() => exception.getError());
    // throw new UnauthorizedException();
  }
}
