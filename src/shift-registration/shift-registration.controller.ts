import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ShiftRegistrationService } from './shift-registration.service';

@Controller('shift-registration')
export class ShiftRegistrationController {
  constructor(private readonly service: ShiftRegistrationService) {}

  @Post('toggle')
  async toggle(@Body() body: { email: string; shift: 'ca-chieu' | 'ca-toi' }) {
    return this.service.toggleShift(body.email, body.shift);
  }
  @Get('all')
  async getAll() {
    return this.service.getAllRegistrations();
  }

  @Get(':email')
  async getByEmail(@Param('email') email: string) {
    return this.service.getByEmail(email);
  }
}
