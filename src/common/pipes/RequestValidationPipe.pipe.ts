import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

const RequestValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors) => {
    return new UnprocessableEntityException(
      errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      })),
    );
  },
});

export { RequestValidationPipe };
