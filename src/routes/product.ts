import { Router } from 'express'
import { ProductController } from '../controllers'
import { Auth, ProductValidator } from '../middleware'

const productController = new ProductController()

const router = Router()
const { authenticate } = Auth;
const { validateAddProduct, validateGetProduct, validateUpdateProduct, validateDeleteProduct } = ProductValidator
const { getProducts, getProductById, addProduct, updateProduct, deleteProductById } = productController

router.get('/products', getProducts.bind(productController))
router.post('/single-product', validateGetProduct, getProductById.bind(productController))

router.post('/product', authenticate, validateAddProduct, addProduct.bind(productController))

router.put('/product', authenticate, validateUpdateProduct, updateProduct.bind(productController))
router.delete('/product', authenticate, validateDeleteProduct, deleteProductById.bind(productController))

export default router
