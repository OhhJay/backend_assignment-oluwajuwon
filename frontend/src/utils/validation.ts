// utils/validation.ts

export const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePassword = (password: string) => {
    // Example validation: minimum 8 characters, at least one letter and one number
    const re = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  };
  
  export const validateUser = (user: { email: string; password: string }) => {
    const errors: string[] = [];
  
    if (!validateEmail(user.email)) {
      errors.push('Invalid email address.');
    }
  
    if (!validatePassword(user.password)) {
      errors.push('Password must be at least 8 characters long, with at least one letter and one number.');
    }
  
    return errors;
  };
  