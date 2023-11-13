import Response from '../utils/Response'
import UserInputs from '../utils/UserInput'

/**
 *
 * @class Validation
 * @description class to handle request validations
 *
 * @method validateAddProduct
 * @method signinValidator
 */
class ProductValidator {
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
  static validateAddProduct = (request, response, next) => {
    const { validateFields } = UserInputs
    const { isValid, issues } = validateFields(request.body, [
      'name',
      'slug',
      'sku',
      'productTypeID',
      'price',
    ])
    if (!isValid) {
      return Response.errorResponse(response, 400, 'invalid input', issues)
    }
    next()
  }

  /**
   *
   * @description signinProductValidator
   *
   * @param {object} request
   * @param {object} response
   * @param {function} next
   *
   * @returns {object} http response object
   */
  static validateLogin = (request, response, next) => {
    const { validateFields } = UserInputs
    const { isValid, issues } = validateFields(request.body, [
      'email',
      'password',
    ])

    if (!isValid) {
      return Response.errorResponse(response, 400, 'invalid input', issues)
    }
    next()
  }
}

export default ProductValidator
