import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express'
import cors from 'cors'

import routes from './routes'
import { serve, setup } from 'swagger-ui-express';
import swaggerDocument from './path/swagger-output.json';

import bodyParser from 'body-parser'

// const jsonParser

// var bodyParser = require('body-parser')

const app = express()
const { NODE_ENV } = process.env

// Application-Level Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Global error handler
app.use(
  (
    error: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // response to user with 403 error and details
    if (error) {
      next(error)
    } else {
      next()
    }
  }
)

// Routes
app.use('/api', routes)
app.use('/api-docs', serve, setup(swaggerDocument));
app.get('/home', async function (_, res) {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the E-commerce home route',
  })
})

export default app
