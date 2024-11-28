// @Module({
//   controllers: [AuthController],
//   providers: [AuthService, PrismaService, JwtStrategy, UsersService],
//   import: [
//     UsersModule,
//     PassportModule,
//     JwtModule.register({
//       secret: process.env.JWT_SECRET,
//       signOptions: {
//         expiresIn: process.env.EXPIRES_IN
//       }
//     })
//   ]
// })
// export class AuthModule()
