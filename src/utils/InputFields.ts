interface Output {
  isValid: boolean
  issues: {
    invalidFields?: Array<any>;
  }
}

/**
 *
 * @description InputFields class
 *
 * @method requiredFields
 * @method optionalFields
 */
class InputFields {
  /**
   *
   * @description required input fields validator
   *
   * @param { requestBody }
   *
   * @return { Object } output
   */
  static requiredFields = (requestBody, requiredFields) => {
    const output: Output = {
      isValid: true,
      issues: {},
    }
    output.issues.invalidFields = [];

    for (let i = 0; i < requiredFields.length; i++) {
      if (requestBody[requiredFields[i]] === undefined) {
        if (output.isValid === true) {
          output.issues.invalidFields = [];
        }
        output.issues.invalidFields.push(`${requiredFields[i].toString()} is required`);
        output.isValid = false
      }
    }

    if (!output.isValid) {
      return output
    }

    return output
  }

  /**
   *
   * @description optional input fields validator
   *
   * @param { requestBody }
   *
   * @return { Object } output
   */
  static optionalFields = (requestBody, requiredFields) => {
    const output: Output = {
      isValid: true,
      issues: {},
    }
    output.issues.invalidFields = [];

    if (Object.keys(requestBody).length <= 1) {
      for (let i = 0; i < requiredFields.length; i++) {
          if (output.isValid === true) {
            output.issues.invalidFields = []
          }
          output.issues.invalidFields.push(`'${requiredFields[i].toString()}' can be included`);
          output.isValid = false
      }
    }

    if (!output.isValid) {
      return output
    }

    return output
  }

  /**
   *
   * @description number validation method
   *
   * @param { number }
   *
   * @return { true | false }  boolean
   */
  static numberValidator = (number) => {
    const numberValidator = /^[0-9]*$/

    return numberValidator.test(number) && typeof number === 'number'
  }
}

export default InputFields
