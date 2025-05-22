
export const APP_NAME = "StoreSpark";

// Form Validation Rules
export const VALIDATION_RULES = {
  name: {
    min: 20,
    max: 60,
    regex: /^[a-zA-Z\s]{20,60}$/,
    message: "Name must be between 20 and 60 characters and contain only letters and spaces."
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email address."
  },
  password: {
    min: 8,
    max: 16,
    regex: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/,
    message: "Password must be 8-16 characters, include at least one uppercase letter and one special character."
  },
  address: {
    max: 400,
    message: "Address must be no more than 400 characters."
  },
  rating: {
    min: 1,
    max: 5,
    message: "Rating must be between 1 and 5."
  }
};

export const MOCK_API_DELAY = 500; // ms