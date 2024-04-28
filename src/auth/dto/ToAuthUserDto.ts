import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { t } from '../../config/translation/translation';

export class ToAuthUserDto {
  @IsEmail(undefined, { message: t().errorMessages.validation.notEmail })
  email: string;

  @IsNotEmpty({ message: t().errorMessages.validation.notEmptyPassword })
  @MinLength(6, {
    message: t().errorMessages.validation.passwordLength,
  })
  @Matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/, {
    message: t().errorMessages.validation.notValidPassword,
  })
  password: string;
}
