import Response from '../utils/Response'
import InputFields from '../utils/InputFields'

/**
 *
 * @class Validation
 * @description class to handle request validations
 *
 * @method signinValidator
 */
class CustomerValidator {
  /**
   *
   * @description signinValidator
   *
   * @param {object} request
   * @param {object} response
   * @param {function} next
   *
   * @returns {object} http response object
   */
  static validateLogin = (request, response, next) => {
    const { requiredFields } = InputFields
    const { isValid, issues } = requiredFields(request.body, [
      'email',
      'password',
    ])

    if (!isValid) {
      return Response.errorResponse(response, 400, 'invalid input', issues)
    }
    next()
  }
}

export default CustomerValidator
