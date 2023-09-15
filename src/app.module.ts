import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('HOST'),
        port: configService.getOrThrow<number>('PORT_DB'),
        username: configService.getOrThrow<string>('USERNAME_DB'),
        password: configService.getOrThrow<string>('PASSWORD_DB'),
        database: configService.getOrThrow<string>('DATABASE'),
        autoLoadEntities: configService.getOrThrow<boolean>('AUTOLOADENTITIES'),
        synchronize: configService.getOrThrow<boolean>('SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
    DoctorsModule,
    PatientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
