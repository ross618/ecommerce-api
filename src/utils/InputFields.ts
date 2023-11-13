interface Output {
  isValid: boolean
  issues: {
    invalidField?: string
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

    for (let i = 0; i < requiredFields.length; i++) {
      if (requestBody[requiredFields[i]] === undefined) {
        if (output.isValid === true) {
          output.issues.invalidField = ''
        }
        output.issues.invalidField += `'${requiredFields[i]
          .toString()}' is required.`
        output.isValid = false
      }
    }

    if (!output.isValid) {
      return output
    }

    return output
  }

  static optionalFields = (requestBody, requiredFields) => {
    const output: Output = {
      isValid: true,
      issues: {},
    }

    if (Object.keys(requestBody).length <= 1) {
      for (let i = 0; i < requiredFields.length; i++) {
          if (output.isValid === true) {
            output.issues.invalidField = 'Optional fields are missing: '
          }
          output.issues.invalidField += `'${requiredFields[i]
            .toString()}' `
          output.isValid = false
      }
    }

    if (!output.isValid) {
      return output
    }

    return output
  }
}

export default InputFields
