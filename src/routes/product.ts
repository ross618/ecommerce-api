import { Router } from 'express'
import { ProductController } from '../controller'
import { ProductValidator } from '../middleware'

const productController = new ProductController()

const router = Router()
const { validateAddProduct } = ProductValidator
const { getProducts, getProductById, addProduct, updateProduct, deleteProductById } = productController

router.get('/products', getProducts.bind(productController))
router.get('/product', getProductById.bind(productController))
router.post('/product', validateAddProduct, addProduct.bind(productController))
router.put('/product', updateProduct.bind(productController))
router.delete('/product', deleteProductById.bind(productController))

export default router
