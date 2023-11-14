import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express'
import cors from 'cors'

import routes from './routes'

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

export default app
