import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/gobalErrorHandler';
import router from './app/routes';
const app = express();

//parser
// app.use(
//   cors({
//     origin: ['https://bank-management-with-ant.vercel.app'],
//     credentials: true,
//   })
// );

//for deployment use case
app.use(
  cors({
    origin: 'https://bank-management-with-ant.vercel.app',
    credentials: true,
  })
);
//for locally use case
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);
app.use(globalErrorHandler);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'successfully working Express Backend setup Application',
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: {
      path: req.originalUrl,
      message: 'Not Found',
    },
  });
  next();
});
export default app;
