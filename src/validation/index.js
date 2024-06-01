import { boolean, mixed, object, string } from "yup";

export const storeRecipe = object({
  title: string().required().label("title"),
  recipe: string().required().label("recipe"),
  thumbnail: mixed().required().label("thumbnail"),
});
export const editRecipe = object({
  id: string().required().label("id"),
  title: string().required().label("title"),
  recipe: string().required().label("recipe"),
});

/**
 * Checks the title and recipe fields for errors.
 * @param {String} title
 * @param {String} recipe
 * @param {String} imgType
 * @param {Boolean} edit - Flag to indicate if it's an edit form.
 * @returns {Object} - An object containing error types and messages.
 */
export function errors([title, recipe, imgType = ``], edit = false) {
  const errorMessages = {};

  if (!edit) {
    if (!title.trim().length > 0) {
      errorMessages.title = "Title is required.";
    }

    if (!recipe.trim().length > 0) {
      errorMessages.recipe = "Recipe is required.";
    }
    if (!imgType.trim().length > 0) {
      errorMessages.imgType = "Image is required.";
    }
  }

  if (edit) {
    if (!title.trim().length > 0 && !recipe.trim().length > 0) {
      errorMessages.general = "At least one of title or recipe must be filled.";
    }
  }

  if (imgType.trim().length > 0 && !checkImageType(imgType)) {
    errorMessages.imgType =
      "Invalid image type. Only jpg, jpeg, and png are allowed.";
  }

  return errorMessages;
}

/**
 * Checks if the image type is valid.
 * @param {String} imageType
 * @returns {boolean} - True if the image type is valid, false otherwise.
 */
export function checkImageType(imageType) {
  return /\.(jpg|jpeg|png)$/i.test(imageType);
}

/**
 * Checks the submit fields.
 * @param {String} title
 * @param {String} recipe
 * @param {String} imgType
 * @returns {boolean} - True if the submit fields are valid, false otherwise.
 */
export function checkSubmitFields(title, recipe, imgType) {
  return (
    (title.trim().length > 0 || recipe.trim().length > 0) &&
    checkImageType(imgType)
  );
}
