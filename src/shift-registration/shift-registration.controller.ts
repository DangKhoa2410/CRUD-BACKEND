import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
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
  getAll() {
    return this.service.getAllRegistrations();
  }

  @Get('/date/:date')
  getByDate(@Param('date') date: string) {
    return this.service.getByDate(date);
  }

  @Get(':email')
  getByEmail(@Param('email') email: string) {
    return this.service.getByEmail(email);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(Number(id));
  }

  @Patch(':email/approve-all')
  approveAll(@Param('email') email: string) {
    return this.service.approveAllByEmail(email);
  }

  @Patch(':email/reject-all')
  rejectAll(@Param('email') email: string) {
    return this.service.rejectAllByEmail(email);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
