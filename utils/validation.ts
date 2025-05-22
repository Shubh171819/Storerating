
import { VALIDATION_RULES } from '../constants.js';

export const validateName = (name) => {
  if (!name) return "Name is required.";
  if (name.length < VALIDATION_RULES.name.min) return `Name must be at least ${VALIDATION_RULES.name.min} characters.`;
  if (name.length > VALIDATION_RULES.name.max) return `Name must be no more than ${VALIDATION_RULES.name.max} characters.`;
  // The regex from constants is a bit restrictive (only letters and spaces).
  // For a real app, consider if names can include hyphens, apostrophes etc.
  // if (!VALIDATION_RULES.name.regex.test(name)) return VALIDATION_RULES.name.message;
  return undefined;
};

export const validateEmail = (email) => {
  if (!email) return "Email is required.";
  if (!VALIDATION_RULES.email.regex.test(email)) return VALIDATION_RULES.email.message;
  return undefined;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < VALIDATION_RULES.password.min || password.length > VALIDATION_RULES.password.max) {
    return `Password must be between ${VALIDATION_RULES.password.min} and ${VALIDATION_RULES.password.max} characters.`;
  }
  if (!VALIDATION_RULES.password.regex.test(password)) return VALIDATION_RULES.password.message;
  return undefined;
};

export const validateAddress = (address) => {
  if (!address) return "Address is required.";
  if (address.length > VALIDATION_RULES.address.max) return VALIDATION_RULES.address.message;
  return undefined;
};

export const validateRating = (rating) => {
  if (rating < VALIDATION_RULES.rating.min || rating > VALIDATION_RULES.rating.max) {
    return VALIDATION_RULES.rating.message;
  }
  return undefined;
};