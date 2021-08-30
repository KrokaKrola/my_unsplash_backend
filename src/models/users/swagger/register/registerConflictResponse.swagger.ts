import { ApiResponseOptions } from "@nestjs/swagger";

export default {
  schema: {
    anyOf: [
      {
        example: {
          "statusCode": 409,
          "message": "User with this username already exists",
          "error": "Conflict"
        }
      },
      {
        example: {
          "statusCode": 409,
          "message": "User with this email already exists",
          "error": "Conflict"
        }
      }
    ],
  },
} as ApiResponseOptions;