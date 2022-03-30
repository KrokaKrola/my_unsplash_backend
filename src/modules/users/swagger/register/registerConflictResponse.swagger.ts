import { ApiResponseOptions } from '@nestjs/swagger';

export default {
  schema: {
    anyOf: [
      {
        example: {
          statusCode: 409,
          message: 'Credentials are incorrect',
          error: 'Conflict',
        },
      },
    ],
  },
} as ApiResponseOptions;
