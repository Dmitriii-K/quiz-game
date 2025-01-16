import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsOptional } from 'class-validator';
import { Trim } from '../transform/trim';

// Объединение декораторов
export const IsOptionalEmail = () =>
    applyDecorators(IsEmail(), Trim(), IsOptional());// Пример реализации