import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
