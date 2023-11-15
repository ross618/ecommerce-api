import Response from '../utils/Response'
import InputFields from '../utils/InputFields'

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
class CartValidator {
  /**
   *
   * @description addToCartValidator
   *
   * @param {object} request
   * @param {object} response
   * @param {function} next
   *
   * @returns {object} http response object
   */
  static validateAddToCart = (request, response, next) => {
    const { requiredFields, numberValidator } = InputFields
    let { isValid, issues } = requiredFields(request.body, [
      'productId',
      'quantity'
    ])
    if (!numberValidator(request.body?.quantity)) {
      isValid = false;
      issues.invalidFields.push('quantity must be a number');
    }
    // isValid = numberValidator(request.body?.quantity)
    if (!isValid) {
      return Response.errorResponse(response, 400, 'invalid input', issues)
    }
    next()
  }

  /**
   *
   * @description deleteCartItemCartValidator
   *
   * @param {object} request
   * @param {object} response
   * @param {function} next
   *
   * @returns {object} http response object
   */
  static validateDeleteCartItem = (request, response, next) => {
    const { requiredFields, numberValidator } = InputFields
    let { isValid, issues } = requiredFields(request.body, [
      'productId',
      'quantity'
    ])
    if (!numberValidator(request.body?.quantity)) {
      isValid = false;
      issues.invalidFields.push('quantity must be a number');
    }
    if (!isValid) {
      return Response.errorResponse(response, 400, 'invalid input', issues)
    }
    next()
  }
}

export default CartValidator
