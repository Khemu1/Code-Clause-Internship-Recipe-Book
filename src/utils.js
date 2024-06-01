// https://stackoverflow.com/questions/73425133/transform-yup-validation-error-into-a-useable-object

/**
 * Transforms Yup errors into an object.
 * @param {ValidationError} errors - The Yup validation errors.
 * @returns {Record<string, string>} - An object containing the error messages.
 */
export const transformYupErrorsIntoObject = (errors) => {
  const validationErrors = {};

  errors.inner.forEach((error) => {
    if (error.path !== undefined) {
      validationErrors[error.path] = error.errors[0];
    }
  });

  return validationErrors;
};
