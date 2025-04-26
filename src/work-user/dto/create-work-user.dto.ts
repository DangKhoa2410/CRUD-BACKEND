export class CreateWorkUserDto {
  nameUser: string;
  email: string;
  registeredDate: Date;
  shift: ('ca-chieu' | 'ca-toi')[];
}
