import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { CircuitBreaker } from "./circuit-breaker.interceptor";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private readonly circuitBreakerByHandler = new WeakMap<
    // eslint-disable-next-line @typescript-eslint/ban-types
    Function,
    CircuitBreaker
  >();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const methodRef = context.getHandler();

    let circuitBreaker: CircuitBreaker;
    if (this.circuitBreakerByHandler.has(methodRef)) {
      circuitBreaker = this.circuitBreakerByHandler.get(methodRef);
    } else {
      circuitBreaker = new CircuitBreaker({
        successThreshold: 3,
        failureThreshold: 3,
        openToHalfOpenWaitTime: 60000,
        fallback: () => {
          // Throwing an HttpException with 503 status code
          throw new HttpException(
            'Service unavailable. Please try again later.',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        },
      });
      this.circuitBreakerByHandler.set(methodRef, circuitBreaker);


      return circuitBreaker.exec(next).pipe(
        catchError((err) => {
          return throwError(
            () =>
              new HttpException(
                'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
          );
        }),
      );
    }
  }
}