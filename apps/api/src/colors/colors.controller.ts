import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
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
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.colorsService.findAll(page, limit)
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
