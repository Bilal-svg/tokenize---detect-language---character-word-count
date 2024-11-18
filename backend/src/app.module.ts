import { Module } from '@nestjs/common';

import { TokenModule } from './token/token.module.js';

@Module({
  imports: [TokenModule],
})
export class AppModule {}
