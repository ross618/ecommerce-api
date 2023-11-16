import { Router } from 'express'
import { CustomerController } from '../controllers'
import { CustomerValidator } from '../middleware'

const customerController = new CustomerController()

const router = Router()
const { validateLogin } = CustomerValidator
const { getCustomer, logoutCustomer } = customerController

function forwardID(req, res, next) {
  res.locals.anonymousId = req.headers.token
  next()
}

router.post(
  '/login',
  validateLogin,
  forwardID,
  getCustomer.bind(customerController)
/*  #swagger.parameters['object'] = { in: 'body', description: 'Log in with commercetools user', 
    schema: { email: 'rosstest@example.com', password: 'password' }}
*/
)
router.post('/logout', logoutCustomer.bind(customerController))

export default router
