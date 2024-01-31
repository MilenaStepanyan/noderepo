// userValidation.js
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const userLoginSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});

export const validateUserRegistration = (data) => {
  try {
    userRegistrationSchema.parse(data);
    return null; 
  } catch (error) {
    return error.errors;
  }
};

export const validateUserLogin = (data) => {
  try {
    userLoginSchema.parse(data);
    return null; 
  } catch (error) {
    return error.errors; 
  }
};
