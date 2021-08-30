import { ApiResponseOptions } from "@nestjs/swagger";

export default {
  schema: {
    example: {
      "statusCode": 422,
      "message": [
          {
              "firstName": {
                  "isNotEmpty": "firstName should not be empty",
                  "minLength": "firstName must be longer than or equal to 2 characters"
              }
          }
      ],
      "error": "Unprocessable Entity"
    }
  }
} as ApiResponseOptions;