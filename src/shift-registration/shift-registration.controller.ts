import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ShiftRegistrationService } from './shift-registration.service';

@Controller('shift-registration')
export class ShiftRegistrationController {
  constructor(private readonly service: ShiftRegistrationService) {}

  @Post('toggle')
  async toggle(
    @Body() body: { email: string; shift: 'ca-chieu' | 'ca-toi'; date: string },
  ) {
    return this.service.toggleShift(body.email, body.shift, body.date);
  }

  @Get('all')
  async getAll() {
    return this.service.getAllRegistrations();
  }

  @Get('/date/:date')
  async getByDate(@Param('date') date: string) {
    return this.service.getByDate(date);
  }

  @Get(':email')
  async getByEmail(@Param('email') email: string) {
    return this.service.getByEmail(email);
  }
}
