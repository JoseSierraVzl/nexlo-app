/**
 * Passport.js configuration for JWT authentication.
 * This file sets up the JWT strategy to authenticate users based on tokens.
 */

// import passport from 'passport';
// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// const options = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: JWT_SECRET,
// };

// passport.use(
//     new JwtStrategy(options, async (payload, done) => {
//         try {
//             const user = await prisma.user.findUnique({ where: { id: payload.id } });
//             if (user) return done(null, user);
//             return done(null, false);
//         } catch (err) {
//             return done(err, false);
//         }
//     })
// );

// export default passport;
