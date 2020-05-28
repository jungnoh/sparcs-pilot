import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import winston from 'winston';
import router from 'routes';

async function connectDB() {
  try {
    if (!process.env.MONGO_HOST) {
      winston.error('MONGO_HOST not found');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_HOST, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    winston.info('Connected to MongoDB database');
  } catch (err) {
    winston.error('Database connection failed!');
    winston.error(err);
    process.exit(1);
  }
}

export default async function createApp(_ = false): Promise<express.Express> {
  await connectDB();

  const app = express();
  if (!process.env.SESSION_SECRET) {
    winston.error('SESSION_SECRET not found');
    process.exit(1);
  }
  app.use(expressSession({
    cookie: {
      httpOnly: false, // Client-side XHR will be used
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new (MongoStore(expressSession))({
      mongooseConnection: mongoose.connection
    })
  }));
  app.use(helmet());
  app.use(morgan('dev', {stream: {
    write: (text: string) => winston.debug(text.trim())
  }}));
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(cookieParser());

  app.use(router);
  app.all('*', (_, res) => {
    res.status(404).json({success: false});
  });

  return app;
}
