import Response from '../utils/Response'
import UserInputs from '../utils/UserInput'

/**
 *
 * @class Validation
 * @description class to handle product request validations
 *
 * @method validateGetProduct
 * @method validateAddProduct
 * @method validateUpdateProduct
 * @method validateDeleteProduct
 */
class ProductValidator {
  /**
   *
   * @description getProductValidator
   *
   * @param {object} request
   * @param {object} response
   * @param {function} next
   *
   * @returns {object} http response object
   */
  static validateGetProduct = (request, response, next) => {
    const { requiredFields } = UserInputs
    const { isValid, issues } = requiredFields(request.body, [
      'productId'
    ])
    if (!isValid) {
      return Response.errorResponse(response, 400, 'invalid input', issues)
    }
    next()
  }

  /**
   *
   * @description addProductValidator
   *
   * @param {object} request
   * @param {object} response
   * @param {function} next
   *
   * @returns {object} http response object
   */
  static validateAddProduct = (request, response, next) => {
    const { requiredFields } = UserInputs
    const { isValid, issues } = requiredFields(request.body, [
      'name',
      'description',
      'slug',
      'sku',
      'price',
      'quantityOnStock',
    ])
    if (!isValid) {
      return Response.errorResponse(response, 400, 'invalid input', issues)
    }
    next()
  }

  /**
   *
   * @description updateProductValidator
   *
   * @param {object} request
   * @param {object} response
   * @param {function} next
   *
   * @returns {object} http response object
   */
  static validateUpdateProduct = (request, response, next) => {
    const { requiredFields, optionalFields } = UserInputs
    let { isValid, issues } = requiredFields(request.body, [
      'productId'
    ]);
    if (!isValid) {
      return Response.errorResponse(response, 400, 'invalid input', issues)
    }
    ({ isValid, issues } = optionalFields(request.body, [
      'name',
      'description',
      'price',
      'quantityOnStock',
    ]));
    if (!isValid) {
      return Response.errorResponse(response, 400, 'invalid input', issues)
    }
    next()
  }

  /**
   *
   * @description signupProductValidator
   *
   * @param {object} request
   * @param {object} response
   * @param {function} next
   *
   * @returns {object} http response object
   */
  static validateDeleteProduct = (request, response, next) => {
    const { requiredFields } = UserInputs
    let { isValid, issues } = requiredFields(request.body, [
      'productId'
    ]);
    if (!isValid) {
      return Response.errorResponse(response, 400, 'invalid input', issues)
    }
    next()
  }
}

export default ProductValidator
