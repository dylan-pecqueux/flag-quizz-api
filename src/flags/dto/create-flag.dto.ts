import {
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateFlagDto {
  @IsString()
  @MinLength(1)
  country: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Za-z]{2}$/, {
    message: 'countryCode must be an ISO 3166-1 alpha-2 code',
  })
  countryCode: string;
}
