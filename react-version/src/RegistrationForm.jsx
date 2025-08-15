import React, { useState, useEffect, useCallback } from 'react';

/**
 * RegistrationForm Component
 * React version of the registration form with all original functionality
 */
const RegistrationForm = () => {
  // State management for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
    aboutMe: '',
    profession: '',
    terms: false
  });

  // State for form validation and UI feedback
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState({});

  // Password strength requirements
  const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    maxLength: 128,
    patterns: {
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      number: /[0-9]/,
      special: /[^A-Za-z0-9]/
    }
  };

  /**
   * Update form data when input values change
   */
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Email validation
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          email: ''
        }));
      }
    }

    // Update password strength if password field changes
    if (field === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
      
      // Set password field error if password doesn't meet requirements
      if (value && strength.feedback.length > 0) {
        setErrors(prev => ({
          ...prev,
          password: `Password must contain: ${strength.feedback.join(', ')}`
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          password: ''
        }));
      }
      
      // Check confirm password match when password changes
      if (formData.confirmPassword) {
        if (!value) {
          // Password is empty, show error for confirm password
          setErrors(prev => ({
            ...prev,
            confirmPassword: 'Please enter a password first'
          }));
        } else if (value !== formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: 'Passwords do not match'
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            confirmPassword: ''
          }));
        }
      }
    }

    // Check confirm password match when confirm password changes
    if (field === 'confirmPassword') {
      if (!formData.password) {
        // Password is empty, show error
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Please enter a password first'
        }));
      } else if (value && value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else if (value && value === formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      } else {
        // Confirm password is empty, clear error
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  }, [errors, formData.password, formData.confirmPassword]);

  /**
   * Handle field blur (lose focus)
   */
  const handleBlur = useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  /**
   * Real-time password confirmation validation
   */
  useEffect(() => {
    if (formData.confirmPassword) {
      if (!formData.password) {
        // Password is empty, show error
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Please enter a password first'
        }));
      } else if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    } else {
      // Confirm password is empty, clear error
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  }, [formData.password, formData.confirmPassword]);

  /**
   * Calculate password strength (matching traditional version)
   */
  const calculatePasswordStrength = useCallback((password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (password.length < 8) feedback.push("At least 8 characters");
    if (!/[a-z]/.test(password)) feedback.push("One lowercase letter");
    if (!/[A-Z]/.test(password)) feedback.push("One uppercase letter");
    if (!/[0-9]/.test(password)) feedback.push("One number");
    if (!/[^A-Za-z0-9]/.test(password)) feedback.push("One special character");

    return { score, feedback };
  }, []);

  /**
   * Validate form fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required field validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!formData.gender) newErrors.gender = 'Please select your gender';
    if (!formData.profession) newErrors.profession = 'Please select your profession';
    if (!formData.terms) newErrors.terms = 'You must accept the terms and conditions';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (formData.username && !usernameRegex.test(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters, letters, numbers, and underscores only';
    }

    // Password validation (matching traditional version)
    if (formData.password) {
      const strengthInfo = calculatePasswordStrength(formData.password);
      if (strengthInfo.feedback.length > 0) {
        newErrors.password = `Password must contain: ${strengthInfo.feedback.join(', ')}`;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Age validation
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.birthDate = 'You must be at least 18 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, passwordStrength.score]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasSubmitted(true);

    if (validateForm()) {
      // Simulate form submission
      setTimeout(() => {
        setShowSuccessModal(true);
        setIsSubmitting(false);
      }, 1000);
    } else {
      setIsSubmitting(false);
    }
  }, [validateForm]);

  /**
   * Hide success modal
   */
  const hideSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
  }, []);

  /**
   * Toggle password visibility
   */
  const togglePassword = useCallback((field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  }, [showPassword, showConfirmPassword]);

  /**
   * Handle date input change with placeholder logic
   */
  const handleDateChange = useCallback((e) => {
    const value = e.target.value;
    handleInputChange('birthDate', value);
    
    // Set data attribute for CSS styling
    if (value) {
      e.target.setAttribute('data-has-value', 'true');
    } else {
      e.target.removeAttribute('data-has-value');
    }
  }, [handleInputChange]);

  return (
    <div className="form-container">
      <h1>User Registration Form</h1>
      
      <form onSubmit={handleSubmit} id="registration-form" className={hasSubmitted ? 'form-submitted' : ''}>
        <section>
          <h2><span className="dot"></span> Personal Information</h2>
          
          <label htmlFor="firstName">First Name: *
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="Enter your first name"
              required
              minLength="2"
              maxLength="50"
              className={
                touched.firstName && errors.firstName ? 'error' : 
                touched.firstName && formData.firstName && !errors.firstName ? 'valid' : ''
              }
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </label>

          <label htmlFor="lastName">Last Name: *
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder="Enter your last name"
              required
              minLength="2"
              maxLength="50"
              className={
                touched.lastName && errors.lastName ? 'error' : 
                touched.lastName && formData.lastName && !errors.lastName ? 'valid' : ''
              }
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </label>

          <label htmlFor="email">Email: *
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email address"
              required
              className={
                touched.email && errors.email ? 'error' : 
                touched.email && formData.email && !errors.email ? 'valid' : ''
              }
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </label>

          <label htmlFor="username">Username: *
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              placeholder="Choose a username (3-20 characters)"
              required
              minLength="3"
              maxLength="20"
              className={
                touched.username && errors.username ? 'error' : 
                touched.username && formData.username && !errors.username ? 'valid' : ''
              }
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </label>

          <label htmlFor="password">Password: *
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password (min 8 characters)"
                required
                minLength="8"
                maxLength="128"
                className={
                  (touched.password || formData.password) && errors.password ? 'error' : 
                  touched.password && passwordStrength.feedback.length > 0 && formData.password ? 'error' : 
                  touched.password && passwordStrength.feedback.length === 0 && formData.password ? 'valid' : ''
                }
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePassword('password')}
              >
                <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
            <div className="password-requirements">
              <small>
                {!formData.password 
                  ? 'Password must contain: uppercase, lowercase, number, special character, min 8 chars'
                  : passwordStrength.feedback.length > 0 
                    ? `Still needed: ${passwordStrength.feedback.join(', ')}`
                    : <span style={{color: '#27ae60'}}>✓ Password meets all requirements!</span>
                }
              </small>
            </div>
            {formData.password && (
              <div className="password-strength">
                <div 
                  className={`password-strength-bar ${
                    passwordStrength.feedback.length > 0 ? 'password-strength-weak' : 'password-strength-very-strong'
                  }`}
                  style={{ 
                    width: passwordStrength.feedback.length > 0 ? '25%' : '100%'
                  }}
                ></div>
              </div>
            )}
          </label>

          <label htmlFor="confirmPassword">Confirm Password: *
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Confirm your password"
                required
                minLength="8"
                maxLength="128"
                className={
                  (touched.confirmPassword || formData.confirmPassword) && errors.confirmPassword ? 'error' : 
                  touched.confirmPassword && formData.confirmPassword && formData.password && formData.confirmPassword === formData.password && !errors.confirmPassword ? 'valid' : ''
                }
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePassword('confirmPassword')}
              >
                <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showConfirmPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </label>
        </section>

        <section>
          <h2><span className="dot"></span> Other details</h2>
          
          <label htmlFor="birthDate">Birth Date: *
            <input
              type="date"
              id="birthDate"
              value={formData.birthDate}
              onChange={handleDateChange}
              onBlur={() => handleBlur('birthDate')}
              required
              placeholder="yyyy/mm/dd"
              className={
                touched.birthDate && errors.birthDate ? 'error' : 
                touched.birthDate && formData.birthDate && !errors.birthDate ? 'valid' : ''
              }
            />
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </label>

          <fieldset className={
            touched.gender && errors.gender ? 'error' : 
            touched.gender && formData.gender && !errors.gender ? 'valid' : ''
          }>
            <legend>Gender: *</legend>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                onBlur={() => handleBlur('gender')}
                required
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                onBlur={() => handleBlur('gender')}
              />
              Female
            </label>
            <label>
                              <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === 'other'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  onBlur={() => handleBlur('gender')}
                />
              Other
            </label>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </fieldset>

          <label htmlFor="aboutMe">About Me:
            <textarea
              id="aboutMe"
              value={formData.aboutMe}
              onChange={(e) => handleInputChange('aboutMe', e.target.value)}
              placeholder="Tell us about yourself... (optional)"
              rows="4"
              maxLength="500"
            />
            <div className="char-count">
              <small>{formData.aboutMe.length}/500 characters</small>
            </div>
          </label>

          <label htmlFor="profession">Choose Your Profession: *
            <select
              id="profession"
              value={formData.profession}
              onChange={(e) => handleInputChange('profession', e.target.value)}
              onBlur={() => handleBlur('profession')}
              required
              className={
                touched.profession && errors.profession ? 'error' : 
                touched.profession && formData.profession && !errors.profession ? 'valid' : ''
              }
            >
              <option value="">Select a profession</option>
              <option value="web_development">Web Development</option>
              <option value="data_analytics">Data Analytics</option>
              <option value="ui_ux_design">UI/UX Design</option>
              <option value="ai">AI</option>
              <option value="other">Other</option>
            </select>
            {errors.profession && <span className="error-message">{errors.profession}</span>}
          </label>
        </section>

        <label className="terms">
          <input
            type="checkbox"
            id="terms"
            checked={formData.terms}
            onChange={(e) => handleInputChange('terms', e.target.checked)}
            onBlur={() => handleBlur('terms')}
            required
            className={
              touched.terms && errors.terms ? 'error' : 
              touched.terms && formData.terms && !errors.terms ? 'valid' : ''
            }
          />
          I'm accepting Terms and Conditions *
          {errors.terms && <span className="error-message">{errors.terms}</span>}
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={hideSuccessModal}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <h2>Registration Successful!</h2>
            <p>Welcome aboard! Your account has been created successfully.</p>
            <div className="success-details">
              <div className="detail-item">
                <span className="detail-label">Username:</span>
                <span className="detail-value">{formData.username}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{formData.email}</span>
              </div>
            </div>
            <div className="success-actions">
              <button className="success-btn primary" onClick={hideSuccessModal}>
                Continue
              </button>
              <button className="success-btn secondary" onClick={hideSuccessModal}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
