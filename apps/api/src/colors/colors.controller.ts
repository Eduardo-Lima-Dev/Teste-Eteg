import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Delete as HttpDelete,
} from '@nestjs/common'
import { ColorsService } from './colors.service'
import { CreateColorDto } from './dto/create-color.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  findAll() {
    return this.colorsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.colorsService.findOne(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateColorDto) {
    return this.colorsService.create(dto)
  }

  @HttpDelete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.colorsService.remove(id)
  }
}
