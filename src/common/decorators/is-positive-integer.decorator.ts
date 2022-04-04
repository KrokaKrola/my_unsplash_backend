import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPositiveInteger(
  property?: { min?: number; max?: number },
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPositiveInteger',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        ...validationOptions,
        message: validationOptions?.message || 'Not valid query param',
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log(args, property);
          const number = Number(value);
          if (Number.isNaN(number)) {
            return false;
          }

          if (!Number.isInteger(number)) {
            return false;
          }

          if (property.min && number < property.min) {
            return false;
          }

          if (property.max && number > property.max) {
            return false;
          }

          return true;
        },
      },
    });
  };
}
