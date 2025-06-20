import { PostgresErrorCode } from './../../helpers/postgrsql-error-codes';
import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class TypeOrmErrorMapperInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        if (!(error instanceof QueryFailedError)) throw error;

        const {
          table = 'unknown',
          code = -1,
          detail = '',
        } = error.driverError || {};

        if (code != PostgresErrorCode.UniqueViolation) throw error;

        const [, , field, value] = detail.match(/.*(\((.*)\)\=\((.*)\)).*/);

        if (/^Key \(.*\)=\(.*\) already exists.*/.test(detail)) {
          throw new ConflictException(
            `${table} с ${field} = ${value} уже существует`,
          );
        } else {
          throw error;
        }
      }),
    );
  }
}
