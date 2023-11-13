import { Router } from 'express'
import { CartController } from '../controller'
import { CartValidator } from '../middleware'

// build the client
const cartController = new CartController()

const router = Router()
const { validateAddToCart, validateDeleteCartItem } = CartValidator
const {
  createCartForCurrentCustomer,
  getActiveCart,
  updateActiveCart,
  removeLineItem,
} = cartController

router.get('/cart', getActiveCart.bind(cartController))
router.post('/cart', createCartForCurrentCustomer.bind(cartController))
router.put('/cart', validateAddToCart, updateActiveCart.bind(cartController))
router.delete('/cart', validateDeleteCartItem, removeLineItem.bind(cartController))

export default router
