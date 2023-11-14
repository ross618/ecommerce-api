import { Router } from 'express'
import { ProductController } from '../controller'
import { Auth, ProductValidator } from '../middleware'

const productController = new ProductController()

const router = Router()
const { authenticate } = Auth;
const { validateAddProduct, validateGetProduct, validateUpdateProduct, validateDeleteProduct } = ProductValidator
const { getProducts, getProductById, addProduct, updateProduct, deleteProductById } = productController

router.get('/products', getProducts.bind(productController))
router.post('/single-product', validateGetProduct, getProductById.bind(productController)
/*  #swagger.parameters['object'] = { in: 'body', description: 'Get specific product by id', 
    schema: { productId: '7718f2d9-610e-4571-a85f-1c5defee147a' }}
*/
)
router.post('/product', authenticate, validateAddProduct, addProduct.bind(productController)
/*  #swagger.security = { bearerAuth: { type: 'http', scheme: 'bearer' } } */
)

router.put('/product', authenticate, validateUpdateProduct, updateProduct.bind(productController))
router.delete('/product', authenticate, validateDeleteProduct, deleteProductById.bind(productController))

export default router
