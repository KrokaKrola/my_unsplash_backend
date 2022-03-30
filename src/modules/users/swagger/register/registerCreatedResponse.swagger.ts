import { ApiResponseOptions } from '@nestjs/swagger';

export default {
  description:
    'Return hash value, that is used in /users/register/email/verify',
  schema: {
    example: {
      hash: 'random_string',
    },
  },
} as ApiResponseOptions;
