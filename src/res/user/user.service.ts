import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async getMainPage() {
    return 'User Main Page';
  }
}
