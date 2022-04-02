const swaggerDescription = {
  openapi: '3.0.0',
  info: {
    title: 'Pawsplash API',
    description: '',
    version: 'v1.0',
    contact: {},
  },
  tags: [],
  servers: [
    {
      url: 'http://localhost:3000/v1.0/api',
    },
  ],
  paths: {
    '/users/register': {
      post: {
        operationId: 'UsersController_register',
        parameters: [],
        description:
          'First step of registration process. You need to pass all required fields, unique email and nikcname, thant you will need to finish registration with code from email address and hash from this request response',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterUserDto',
              },
            },
          },
        },
        responses: {
          '201': {
            description:
              'Return hash value, that is used in /users/register/email/verify',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    hash: {
                      type: 'string',
                      required: true,
                      example: '6Kx/B7i6kGY1zoloZA6o1CtbJ2nqMq/3ECrJ/zDzAIg=',
                      description:
                        'Hash that will be used during second registration step in  /users/register/email/verify',
                    },
                  },
                },
              },
            },
          },
          '409': {
            description: 'Return 409 status code for existed username or email',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ConflictException',
                },
                example: {
                  statusCode: 409,
                  message: 'Credentials are incorrect',
                  error: 'Conflict',
                },
              },
            },
          },
          '422': {
            description: 'Return 422 for not valid body parametres',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnprocessableEntityException',
                },
              },
              example: {
                statusCode: 422,
                message: [
                  {
                    property: 'firstName',
                    constraints: {
                      isNotEmpty: 'firstName should not be empty',
                    },
                  },
                ],
                error: 'Unprocessable Entity',
              },
            },
          },
        },
        tags: ['users'],
      },
    },
    '/users/register/email/verify': {
      post: {
        operationId: 'UsersController_registerEmailVerify',
        description:
          'Second step of register process. On this step hash and code from mail are required. You can get hash from POST /users/register and code from mail that was sent to your email address',
        parameters: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterEmailVerifyDto',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'A user object.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserObject',
                },
              },
            },
            headers: {
              'Set-Cookie': {
                schema: {
                  type: 'string',
                  example:
                    'Refresh={refreshJwtToken}; Path=/; HttpOnly; Expires=Fri, 31 Apr 2022 20:21:29 GMT;\n\nAuthentication={authJwtToken}; Path=/; HttpOnly; Expires=Fri, 01 Apr 2022 20:21:29 GMT;',
                },
              },
            },
          },
          '404': {
            description:
              'Throws if passed code value is not found in database or if register candidate for given hash value was not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NotFoundException',
                },
                examples: {
                  'Code not found': {
                    value: {
                      statusCode: 404,
                      message: 'Verification code not found',
                      error: 'Not found exception',
                    },
                  },
                  'Hash not found': {
                    value: {
                      statusCode: 404,
                      message: 'User for registration is not not found',
                      error: 'Not found exception',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description:
              'Throws if email was not sent for given email and hash values',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BadRequestException',
                },
                example: {
                  statusCode: 400,
                  message: 'Email not sent, please try again',
                  error: 'Bad request exception',
                },
              },
            },
          },
          '422': {
            description:
              'Throws if passed code or hash values are incorrect, not valid or code lifetime is longer than 60 seconds',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnprocessableEntityException',
                },
                examples: {
                  'Request validation errors': {
                    value: {
                      statusCode: 422,
                      message: [
                        {
                          property: 'code',
                          constraints: {
                            isNotEmpty: 'code should not be empty',
                          },
                        },
                      ],
                      error: 'Unprocessable Entity',
                    },
                  },
                  'Incorrect code value': {
                    value: {
                      statusCode: 422,
                      message: [
                        {
                          property: 'code',
                          constraints: {
                            notValid: 'Verification code is not correct',
                          },
                        },
                      ],
                      error: 'Unprocessable Entity',
                    },
                  },
                  'Code is no longer valid': {
                    value: {
                      statusCode: 422,
                      message: [
                        {
                          property: 'code',
                          constraints: {
                            notValid: 'Verification code is no longer valid',
                          },
                        },
                      ],
                      error: 'Unprocessable Entity',
                    },
                  },
                },
              },
            },
          },
        },
        tags: ['users'],
      },
    },
    '/users/login': {
      post: {
        operationId: 'UsersController_login',
        parameters: [],
        description:
          'Return user object and set Authentication and Refresh JWT tokens in cookies',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginUserDto',
              },
            },
          },
        },
        responses: {
          '200': {
            description: '',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserObject',
                },
              },
            },
            headers: {
              'Set-Cookie': {
                schema: {
                  type: 'string',
                  example:
                    'Refresh={refreshJwtToken}; Path=/; HttpOnly; Expires=Fri, 31 Apr 2022 20:21:29 GMT;\n\nAuthentication={authJwtToken}; Path=/; HttpOnly; Expires=Fri, 01 Apr 2022 20:21:29 GMT;',
                },
              },
            },
          },
          '404': {
            description: 'Username was not found in database',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NotFoundException',
                },
                example: {
                  code: 404,
                  message: 'User not found',
                  error: 'Not Found',
                },
              },
            },
          },
          '403': {
            description: 'Password for given username is incorrect',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ForbiddenException',
                },
                example: {
                  code: 403,
                  message: 'Given password is not correct',
                  error: 'Forbidden Exception',
                },
              },
            },
          },
          '422': {
            description: 'Return 422 for not valid body parameters',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnprocessableEntityException',
                },
              },
              example: {
                statusCode: 422,
                message: [
                  {
                    property: 'username',
                    constraints: {
                      isNotEmpty: 'username should not be empty',
                    },
                  },
                ],
                error: 'Unprocessable Entity',
              },
            },
          },
        },
        tags: ['users'],
      },
    },
    '/users/token/update': {
      post: {
        security: [{ RefreshToken: [] }],
        operationId: 'UsersController_refreshAccessToken',
        parameters: [],
        description: 'Method to update access token in Authentication cookie',
        responses: {
          '204': {
            description: 'Update access token cookie',
            headers: {
              'Set-Cookie': {
                schema: {
                  type: 'string',
                  example:
                    'Authentication={authJwtToken}; Path=/; HttpOnly; Expires=Fri, 01 Apr 2022 20:21:29 GMT;',
                },
              },
            },
          },
          '404': {
            description: 'User not found for passed token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NotFoundException',
                },
                example: {
                  code: 404,
                  message: 'User not found',
                  error: 'Not Found',
                },
              },
            },
          },
          '401': {
            description: 'Refresh token verification fail',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedException',
                },
              },
            },
          },
        },
        tags: ['users'],
      },
    },
    '/users/logout': {
      post: {
        security: [{ AccessToken: [] }],
        operationId: 'UsersController_logout',
        parameters: [],
        description:
          'Logout current authenticated user. Delete Authentication and Refresh tokens',
        responses: {
          '204': {
            description: 'Successfully logout',
            headers: {
              'Set-Cookie': {
                schema: {
                  type: 'string',
                  example:
                    'Authentication=; HttpOnly; Path=/; Max-Age=0; Refresh=; HttpOnly; Path=/; Max-Age=0',
                },
              },
            },
          },
          '401': {
            description: 'Access token verification fail',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedException',
                },
              },
            },
          },
        },
        tags: ['users'],
      },
    },
    '/users/me': {
      get: {
        security: [{ AccessToken: [] }],
        operationId: 'UsersController_getUser',
        parameters: [],
        description: 'Get user object. Authentication cookie is required',
        responses: {
          '200': {
            description: 'Return user object',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserObject',
                },
              },
            },
          },
          '401': {
            description: 'Access token verification fail',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedException',
                },
              },
            },
          },
        },
        tags: ['users'],
      },
    },
    '/pets': {
      post: {
        tags: ['pets'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                $ref: '#/components/schemas/CreatePetDto',
              },
            },
          },
        },
        security: [{ AccessToken: [] }],
        description: 'Create new pet',
        responses: {
          '201': {
            description: 'Create pet and return it',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PetObject',
                },
              },
            },
          },
          401: {
            description: 'Authorization error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedException',
                },
              },
            },
          },
          '422': {
            description: 'Validation errors',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnprocessableEntityException',
                },
                examples: {
                  'Default validation errors': {
                    value: {
                      code: 422,
                      message: [
                        {
                          property: 'name',
                          constraints: {
                            name: 'name should not be empty',
                          },
                        },
                      ],
                      error: 'Unprocessable entity',
                    },
                  },
                  'Type ID validation error': {
                    value: {
                      code: 422,
                      message: [
                        {
                          property: 'typeId',
                          constraints: {
                            typeId: 'typeId not found in database',
                          },
                        },
                      ],
                      error: 'Unprocessable entity',
                    },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['pets'],
        description: 'Get all pets of requested user. Response is paginated',
        security: [{ AccessToken: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            description: 'Page number of requested items',
            schema: {
              $ref: '#/components/schemas/PaginationPageQueryParam',
            },
          },
          {
            in: 'query',
            name: 'limit',
            description: 'Limit return number of elements',
            schema: {
              $ref: '#/components/schemas/PaginationLimitQueryParam',
            },
          },
        ],
        responses: {
          200: {
            description: 'Paginated pets response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/PetObject',
                      },
                    },
                    links: {
                      $ref: '#/components/schemas/PaginationResponseLinks',
                    },
                    meta: {
                      $ref: '#/components/schemas/PaginationResponseMeta',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Authorization error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedException',
                },
              },
            },
          },
          422: {
            description: 'Error for passed query params',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnprocessableEntityException',
                },
              },
            },
          },
        },
      },
    },
    '/pets/{id}': {
      get: {
        tags: ['pets'],
        description: 'Get info of the pet by id',
        security: [{ AccessToken: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            type: 'number',
            description: 'ID of the pet. Must be positive integer',
          },
        ],
        responses: {
          200: {
            description: 'Get pet object',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PetObject',
                },
              },
            },
          },
          401: {
            description: 'Authorization error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedException',
                },
              },
            },
          },
          404: {
            description: 'Pet is not found for given ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NotFoundException',
                },
              },
            },
          },
          422: {
            description: 'Passed ID parameter is not valid',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnprocessableEntityException',
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ['pets'],
        description: 'Update pet by id',
        security: [{ AccessToken: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            type: 'number',
            description: 'ID of the pet. Must be positive integer',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                $ref: '#/components/schemas/PatchPetDto',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Return updated pet object',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PetObject',
                },
              },
            },
          },
          401: {
            description: 'Authorization error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedException',
                },
              },
            },
          },
          404: {
            description: 'Pet is not found for given ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NotFoundException',
                },
              },
            },
          },
          422: {
            description: 'Validation errors',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnprocessableEntityException',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['pets'],
        description: 'Update pet by id',
        security: [{ AccessToken: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            type: 'number',
            description: 'ID of the pet. Must be positive integer',
          },
        ],
        responses: {
          204: {
            description: 'Successfully deleted pet by id',
          },
          401: {
            description: 'Authorization error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnauthorizedException',
                },
              },
            },
          },
          404: {
            description: 'Pet is not found for given ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NotFoundException',
                },
              },
            },
          },
          422: {
            description: 'Validation errors',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UnprocessableEntityException',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      AccessToken: {
        description: 'Jwt token. Lifetime is 15 minutes',
        type: 'apiKey',
        in: 'cookie',
        name: 'Authentication',
      },
      RefreshToken: {
        description: 'Jwt token. Lifetime is 30 days',
        type: 'apiKey',
        in: 'cookie',
        name: 'Refresh',
      },
    },
    schemas: {
      RegisterUserDto: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            example: 'Jack',
            required: true,
            minLength: 2,
            maxLength: 120,
          },
          lastName: {
            type: 'string',
            example: 'Does',
            required: true,
            minLength: 2,
            maxLength: 120,
          },
          email: {
            type: 'string',
            example: 'jack.does@gmail.com',
            required: true,
            maxLength: 256,
            description: 'Has email validation',
          },
          username: {
            type: 'string',
            example: 'jack.does.1998',
            minLength: 6,
            maxLength: 60,
          },
          password: {
            type: 'string',
            example: 'jack_does_1235',
            minLength: 6,
            maxLength: 60,
          },
        },
        required: ['firstName', 'email', 'username', 'password'],
      },
      RegisterEmailVerifyDto: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: '060606',
            description: 'Six code number',
          },
          hash: {
            type: 'string',
            example: '6Kx/B7i6kGY1zoloZA6o1CtbJ2nqMq/3ECrJ/zDzAIg=',
            description:
              'Hash that was given on first step POST /users/register',
          },
        },
        required: ['code', 'hash'],
      },
      LoginUserDto: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            example: 'jack.does.1998',
            minLength: 6,
            maxLength: 60,
          },
          password: {
            type: 'string',
            example: 'jack_does_1235',
            minLength: 6,
            maxLength: 60,
          },
        },
        required: ['username', 'password'],
      },
      NotFoundException: {
        type: 'object',
        properties: {
          code: {
            type: 'number',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Not found exception error',
          },
          error: {
            type: 'string',
            example: 'Not found exception',
          },
        },
        required: ['error', 'code', 'message'],
      },
      BadRequestException: {
        type: 'object',
        properties: {
          code: {
            type: 'number',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Bad request exception message',
          },
          error: {
            type: 'string',
            example: 'Bad request',
          },
        },
        required: ['error', 'code', 'message'],
      },
      UnauthorizedException: {
        type: 'object',
        properties: {
          code: {
            type: 'number',
            example: 401,
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
          },
        },
        required: ['error', 'code', 'message'],
      },
      ForbiddenException: {
        type: 'object',
        properties: {
          code: {
            type: 'number',
            example: 403,
          },
          message: {
            type: 'string',
            example: 'Forbidden exception error',
          },
          error: {
            type: 'string',
            example: 'Forbidden Exception',
          },
        },
        required: ['error', 'code', 'message'],
      },
      ConflictException: {
        type: 'object',
        properties: {
          code: {
            type: 'number',
            example: 409,
          },
          message: {
            type: 'string',
            example: 'Credentials are incorrect',
          },
          error: {
            type: 'string',
            example: 'Conflict exception',
          },
        },
        required: ['error', 'code', 'message'],
      },
      UnprocessableEntityException: {
        type: 'object',
        properties: {
          code: {
            type: 'number',
            example: 422,
          },
          message: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                property: {
                  type: 'string',
                  description: 'Property that produces error',
                  required: true,
                  example: 'propertyName',
                },
                constraints: {
                  type: 'object',
                  description:
                    'Contains key - value pairs of errorCode and errorMessage',
                  properties: {
                    key: {
                      type: 'string',
                      description: 'Error type',
                      example: 'key should not be empty',
                    },
                  },
                },
              },
            },
          },
          error: {
            type: 'string',
            example: 'Unprocessable entity',
          },
        },
        required: ['error', 'code', 'message'],
      },
      UserObject: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 1,
            required: true,
          },
          firstName: {
            type: 'string',
            example: 'Jack',
            required: true,
          },
          lastName: {
            type: 'string',
            example: 'Does',
            required: true,
          },
          email: {
            type: 'string',
            example: 'jack.does@gmail.com',
            required: true,
          },
          username: {
            type: 'string',
            example: 'jack.does.1998',
          },
          password: {
            type: 'string',
            example: 'jack_does_1235',
          },
        },
        required: ['firstName', 'lastName', 'email', 'username', 'password'],
      },
      CreatePetDto: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Jacky',
            required: true,
            minLength: 2,
            maxLength: 128,
            description: 'Required field. Name of your pet',
          },
          bio: {
            type: 'string',
            maxLength: 500,
            example: 'The best dog in the W O R L D!',
            description: 'Not required field. Biography of your pet',
          },
          typeId: {
            type: 'number',
            example: 1,
            description:
              'Not required field. Type of pet. You can get this id from GET /pets/types',
          },
          image: {
            type: 'string',
            format: 'binary',
            required: true,
            description:
              'Required field. Avatar of your pet. Minimum dimension 500x500. Maximum size is 5MB',
          },
        },
      },
      PatchPetDto: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Jacky',
            minLength: 2,
            maxLength: 128,
            description: 'Required field. Name of your pet',
          },
          bio: {
            type: 'string',
            maxLength: 500,
            example: 'The best dog in the W O R L D!',
            description: 'Not required field. Biography of your pet',
          },
          typeId: {
            type: 'number',
            example: 1,
            description:
              'Not required field. Type of pet. You can get this id from GET /pets/types',
          },
          image: {
            type: 'string',
            format: 'binary',
            description:
              'Required field. Avatar of your pet. Minimum dimension 500x500. Maximum size is 5MB',
          },
        },
      },
      PetObject: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 1,
            required: true,
          },
          name: {
            type: 'string',
            example: 'Jacky',
            required: true,
            maxLength: 128,
            minLength: 2,
          },
          bio: {
            type: 'string',
            maxLength: 500,
            example: 'The best dog in the W O R L D!',
          },
          petType: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                example: 1,
                required: true,
              },
              name: {
                type: 'string',
                example: 'Dog',
                required: true,
              },
            },
          },
          image: {
            type: 'object',
            required: true,
            properties: {
              hash: {
                type: 'string',
                description: 'Hash of uploaded image',
                example:
                  'eab39a72f43d2c84160cf58659c78e646725b0c28fb9c6f8e359462888950e14',
              },
            },
          },
        },
      },
      PaginationPageQueryParam: {
        type: 'number',
        minimum: 1,
        example: 1,
        default: 1,
      },
      PaginationLimitQueryParam: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        example: 6,
        default: 6,
      },
      PaginationResponseMeta: {
        type: 'object',
        properties: {
          itemCount: {
            type: 'number',
            example: 20,
            description:
              'The length of items array (i.e., the amount of items on this page)',
          },
          totalItems: {
            type: 'number',
            example: 20,
            description:
              'The total amount of SomeEntity matching the filter conditions',
          },
          itemsPerPage: {
            type: 'number',
            example: 10,
            description:
              'The requested items per page (i.e., the limit parameter)',
          },
          totalPages: {
            type: 'number',
            example: 5,
            description: 'The total amount of pages (based on the limit)',
          },
          currentPage: {
            type: 'number',
            example: 2,
            description:
              'The current page this paginator "points" to links.first',
          },
        },
      },
      PaginationResponseLinks: {
        type: 'object',
        properties: {
          first: {
            type: 'string',
            example: 'http://cats.com/cats?limit=10',
            description:
              'A URL for the first page to call | "" (blank) if no route is defined. Do note that links.first may not have the \'page\' query param defined',
          },
          previous: {
            type: 'string',
            example: 'http://cats.com/cats?page=1&limit=10',
            description:
              'A URL for the previous page to call | "" (blank) if no previous to call',
          },
          next: {
            type: 'string',
            example: 'http://cats.com/cats?page=3&limit=10',
            description:
              'A URL for the next page to call | "" (blank) if no page to call',
          },
          last: {
            type: 'string',
            example: 'http://cats.com/cats?page=5&limit=10',
            description:
              'A URL for the last page to call | "" (blank) if no route is defined',
          },
        },
      },
    },
  },
};

export default swaggerDescription;
