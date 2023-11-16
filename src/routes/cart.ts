import { Router } from 'express'
import { CartController } from '../controllers'
import { Auth, CartValidator } from '../middleware'

// build the client
const cartController = new CartController()

const router = Router()
const { authenticate } = Auth;
const { validateAddToCart, validateDeleteCartItem } = CartValidator
const {
  getCartById,
  updateActiveCart,
  removeLineItem,
} = cartController

router.use('/', authenticate);

router.get('/cart', getCartById.bind(cartController))
router.put('/cart', validateAddToCart, updateActiveCart.bind(cartController))
router.delete('/cart', validateDeleteCartItem, removeLineItem.bind(cartController))

export default router
