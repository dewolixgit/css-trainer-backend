import { BadRequestException, ValidationPipe } from '@nestjs/common';

// Is used to check ToAuthUserDto
export const loginRegistrationValidationPipe = new ValidationPipe({
  exceptionFactory: (errors) => {
    const errorsConstraints = errors[0]?.constraints;

    if (!errorsConstraints) {
      throw new Error('No errorsConstraints');
    }

    return new BadRequestException(Object.values(errorsConstraints)[0]);
  },
});
