import {
  IsOptional,
} from 'class-validator';

export class RoleUpdateDto {
    @IsOptional()
    name: string;
}
