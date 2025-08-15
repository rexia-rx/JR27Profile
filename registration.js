document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registration-form');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const aboutMe = document.getElementById('about_me');
    
    // Form submission state
    let isSubmitting = false;
    
    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = 0;
        const feedback = [];
        
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        if (password.length < 8) feedback.push("At least 8 characters");
        if (!/[a-z]/.test(password)) feedback.push("One lowercase letter");
        if (!/[A-Z]/.test(password)) feedback.push("One uppercase letter");
        if (!/[0-9]/.test(password)) feedback.push("One number");
        if (!/[^A-Za-z0-9]/.test(password)) feedback.push("One special character");
        
        return { strength, feedback };
    }
    
    // Update password strength indicator
    function updatePasswordStrength() {
        if (!password || !password.value) {
            // Reset password strength display
            const strengthBar = document.querySelector('.password-strength-bar');
            if (strengthBar) {
                strengthBar.className = 'password-strength-bar';
            }
            
            const requirementsDiv = document.querySelector('.password-requirements');
            if (requirementsDiv) {
                requirementsDiv.innerHTML = '<small>Password must contain: uppercase, lowercase, number, special character, min 8 chars</small>';
            }
            
            // Reset password field styling to default
            if (password) {
                password.style.borderColor = '';
                password.style.backgroundColor = '';
            }
            return;
        }
        
        const strengthInfo = checkPasswordStrength(password.value);
        let strengthBar = document.querySelector('.password-strength-bar');
        
        if (!strengthBar) return;
        
        // Remove existing classes
        strengthBar.className = 'password-strength-bar';
        
        // Add appropriate strength class based on whether all requirements are met
        if (strengthInfo.feedback.length > 0) {
            // Still missing requirements - show red
            strengthBar.classList.add('password-strength-weak');
        } else {
            // All requirements met - show green
            strengthBar.classList.add('password-strength-very-strong');
        }
        
        // Update requirements text
        const requirementsDiv = document.querySelector('.password-requirements');
        if (requirementsDiv) {
            if (strengthInfo.feedback.length > 0) {
                requirementsDiv.innerHTML = `<small>Still needed: ${strengthInfo.feedback.join(', ')}</small>`;
                // Set password field to error state
                password.style.borderColor = '#e74c3c';
                password.style.backgroundColor = '#fdf2f2';
            } else {
                requirementsDiv.innerHTML = '<small style="color: #27ae60;">✓ Password meets all requirements!</small>';
                // Set password field to valid state
                password.style.borderColor = '#2ecc71';
                password.style.backgroundColor = '#f0f9f0';
            }
        }
    }
    
    // Password confirmation validation
    function validatePassword() {
        const errorElement = document.getElementById('confirm_password_error');
        
        if (!confirmPassword.value) {
            // Confirm password is empty, clear error
            confirmPassword.setCustomValidity('');
            if (errorElement) {
                errorElement.textContent = '';
            }
            confirmPassword.style.borderColor = '';
            confirmPassword.style.backgroundColor = '';
            return;
        }
        
        if (!password.value) {
            // Password is empty, show error for confirm password
            confirmPassword.setCustomValidity("Please enter a password first");
            if (errorElement) {
                errorElement.textContent = "Please enter a password first";
            }
            confirmPassword.style.borderColor = '#e74c3c';
            confirmPassword.style.backgroundColor = '#fdf2f2';
        } else if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords don't match");
            if (errorElement) {
                errorElement.textContent = "Passwords don't match";
            }
            // Set confirm password field to error state
            confirmPassword.style.borderColor = '#e74c3c';
            confirmPassword.style.backgroundColor = '#fdf2f2';
        } else {
            confirmPassword.setCustomValidity('');
            if (errorElement) {
                errorElement.textContent = '';
            }
            // Set confirm password field to valid state
            confirmPassword.style.borderColor = '#2ecc71';
            confirmPassword.style.backgroundColor = '#f0f9f0';
        }
    }
    
    // Real-time validation with custom error messages
    function validateField(field) {
        const errorElement = document.getElementById(field.id + '_error');
        if (!errorElement) return '';
        
        let errorMessage = '';
        
        if (field.validity.valueMissing) {
            errorMessage = 'This field is required';
        } else if (field.validity.typeMismatch && field.type === 'email') {
            errorMessage = 'Please enter a valid email address';
        } else if (field.validity.tooShort) {
            errorMessage = `Minimum length is ${field.minLength} characters`;
        } else if (field.validity.tooLong) {
            errorMessage = `Maximum length is ${field.maxLength} characters`;
        } else if (field.validity.patternMismatch) {
            errorMessage = field.title || 'Invalid format';
        }
        
        errorElement.textContent = errorMessage;
        return errorMessage;
    }
    
    // Update character count for about me
    function updateCharCount() {
        if (!aboutMe) return;
        
        const countElement = document.getElementById('about_me_count');
        if (countElement) {
            countElement.textContent = aboutMe.value.length;
        }
    }
    
    // Email validation function
    function validateEmail() {
        const emailField = document.getElementById('email');
        const errorElement = document.getElementById('email_error');
        
        if (!emailField || !errorElement) return;
        
        const email = emailField.value.trim();
        
        if (!email) {
            // Clear error if field is empty
            errorElement.textContent = '';
            emailField.style.borderColor = '';
            emailField.style.backgroundColor = '';
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorElement.textContent = 'Please enter a valid email address';
            emailField.style.borderColor = '#e74c3c';
            emailField.style.backgroundColor = '#fdf2f2';
        } else {
            errorElement.textContent = '';
            emailField.style.borderColor = '#2ecc71';
            emailField.style.backgroundColor = '#f0f9f0';
        }
    }
    
    // Event listeners for real-time validation
    if (password) {
        password.addEventListener('input', function() {
            updatePasswordStrength();
            // Also validate confirm password when password changes
            if (confirmPassword) {
                validatePassword();
            }
        });
        password.addEventListener('blur', function() {
            updatePasswordStrength();
            // Also validate confirm password when password loses focus
            if (confirmPassword) {
                validatePassword();
            }
        });
    }
    
    if (confirmPassword) {
        confirmPassword.addEventListener('input', validatePassword);
        confirmPassword.addEventListener('blur', validatePassword);
    }
    
    // Email validation event listeners
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('input', validateEmail);
        emailField.addEventListener('blur', validateEmail);
    }
    
    if (aboutMe) {
        aboutMe.addEventListener('input', updateCharCount);
        updateCharCount(); // Initialize count
    }
    
    // Set date input placeholder
    const birthDateField = document.getElementById('birth_date');
    if (birthDateField) {
        // Set a custom attribute to track if value is set
        birthDateField.addEventListener('change', function() {
            if (this.value) {
                this.setAttribute('data-has-value', 'true');
            } else {
                this.removeAttribute('data-has-value');
            }
        });
    }
    
    // Form submission with enhanced validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (isSubmitting) return; // Prevent multiple submissions
        
        console.log('Form submission started'); // Debug log
        
        // Add form-submitted class to enable validation styling
        form.classList.add('form-submitted');
        
        // Clear previous error messages and messages
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.textContent = '');
        
        // Clear any existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Comprehensive validation
        let isValid = true;
        const validationErrors = [];
        
        // 1. Check all required fields have values
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                const errorMsg = 'This field is required';
                validationErrors.push(`${field.name || field.id}: ${errorMsg}`);
                
                // Set error message in DOM
                const errorElement = document.getElementById(field.id + '_error');
                if (errorElement) {
                    errorElement.textContent = errorMsg;
                }
                
                // Set error styling
                field.style.borderColor = '#e74c3c';
                field.style.backgroundColor = '#fdf2f2';
            }
        });
        
        // 2. Check email format (if email field has value)
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            const email = emailField.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                isValid = false;
                validationErrors.push('email: Please enter a valid email address');
                
                const errorElement = document.getElementById('email_error');
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid email address';
                }
                
                emailField.style.borderColor = '#e74c3c';
                emailField.style.backgroundColor = '#fdf2f2';
            }
        }
        
        // 3. Check first name format (letters and spaces only, 2-50 chars)
        const firstNameField = document.getElementById('first_name');
        if (firstNameField && firstNameField.value.trim()) {
            const firstName = firstNameField.value.trim();
            if (!/^[A-Za-z\s]{2,50}$/.test(firstName)) {
                isValid = false;
                validationErrors.push('first_name: Must be 2-50 characters, letters and spaces only');
                
                const errorElement = document.getElementById('first_name_error');
                if (errorElement) {
                    errorElement.textContent = 'Must be 2-50 characters, letters and spaces only';
                }
                
                firstNameField.style.borderColor = '#e74c3c';
                firstNameField.style.backgroundColor = '#fdf2f2';
            }
        }
        
        // 4. Check last name format (letters and spaces only, 2-50 chars)
        const lastNameField = document.getElementById('last_name');
        if (lastNameField && lastNameField.value.trim()) {
            const lastName = lastNameField.value.trim();
            if (!/^[A-Za-z\s]{2,50}$/.test(lastName)) {
                isValid = false;
                validationErrors.push('last_name: Must be 2-50 characters, letters and spaces only');
                
                const errorElement = document.getElementById('last_name_error');
                errorElement.textContent = 'Must be 2-50 characters, letters and spaces only';
                
                lastNameField.style.borderColor = '#e74c3c';
                lastNameField.style.backgroundColor = '#fdf2f2';
            }
        }
        
        // 5. Check username format (alphanumeric + underscore, 3-20 chars)
        const usernameField = document.getElementById('username');
        if (usernameField && usernameField.value.trim()) {
            const username = usernameField.value.trim();
            if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
                isValid = false;
                validationErrors.push('username: Must be 3-20 characters, letters, numbers, and underscores only');
                
                const errorElement = document.getElementById('username_error');
                if (errorElement) {
                    errorElement.textContent = 'Must be 3-20 characters, letters, numbers, and underscores only';
                }
                
                usernameField.style.borderColor = '#e74c3c';
                usernameField.style.backgroundColor = '#fdf2f2';
            }
        }
        
        // 6. Check radio button selection (gender)
        const genderRadios = form.querySelectorAll('input[name="gender"]');
        const genderSelected = Array.from(genderRadios).some(radio => radio.checked);
        if (!genderSelected) {
            isValid = false;
            validationErrors.push('gender: Please select a gender');
            
            const errorElement = document.getElementById('gender_error');
            if (errorElement) {
                errorElement.textContent = 'Please select a gender';
            }
            
            // Style the fieldset
            const fieldset = form.querySelector('fieldset');
            if (fieldset) {
                fieldset.style.borderColor = '#e74c3c';
                fieldset.style.backgroundColor = '#fdf2f2';
            }
        }
        
        // 7. Check checkbox (terms)
        const termsCheckbox = form.querySelector('input[name="terms"]');
        if (!termsCheckbox.checked) {
            isValid = false;
            validationErrors.push('terms: You must accept the terms and conditions');
            
            const errorElement = document.getElementById('terms_error');
            if (errorElement) {
                errorElement.textContent = 'You must accept the terms and conditions';
            }
            
            termsCheckbox.style.borderColor = '#e74c3c';
            termsCheckbox.style.backgroundColor = '#fdf2f2';
        }
        
        // 8. Check password confirmation
        if (password.value !== confirmPassword.value) {
            isValid = false;
            validationErrors.push('confirm_password: Passwords do not match');
            
            const errorElement = document.getElementById('confirm_password_error');
            if (errorElement) {
                errorElement.textContent = 'Passwords do not match';
            }
            
            confirmPassword.style.borderColor = '#e74c3c';
            confirmPassword.style.backgroundColor = '#fdf2f2';
        }
        
        // 9. Check password strength (if password is provided)
        if (password.value) {
            const strengthInfo = checkPasswordStrength(password.value);
            if (strengthInfo.feedback.length > 0) {
                isValid = false;
                validationErrors.push(`password: Password must contain: ${strengthInfo.feedback.join(', ')}`);
                
                const errorElement = document.getElementById('password_error');
                if (errorElement) {
                    errorElement.textContent = `Password must contain: ${strengthInfo.feedback.join(', ')}`;
                }
                
                password.style.borderColor = '#e74c3c';
                password.style.backgroundColor = '#fdf2f2';
            }
        }
        
        // Debug logging
        console.log('Validation result:', { isValid, validationErrors });
        
        if (isValid) {
            console.log('Form is valid, proceeding with submission'); // Debug log
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            isSubmitting = true;
            
            // Simulate form processing
            setTimeout(() => {
                console.log('Showing success modal'); // Debug log
                
                // Show success modal
                showSuccessModal(
                    document.getElementById('username').value,
                    document.getElementById('email').value
                );
                
                // Reset form after showing success
                setTimeout(() => {
                    resetForm();
                }, 1000);
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                isSubmitting = false;
            }, 2000);
            
        } else {
            console.log('Form has validation errors, showing error message'); // Debug log
            
            // Show error message with details
            const errorDetails = validationErrors.length > 0 ? 
                `Please fix the following errors: ${validationErrors.slice(0, 3).join(', ')}` :
                'Please fill in all required fields correctly.';
            
            showMessage(errorDetails, 'error');
            
            // Scroll to first error
            const firstError = form.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Message display function
    function showMessage(message, type) {
        // Remove any existing message first
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Insert message at the top of the form
        form.insertBefore(messageDiv, form.firstChild);
        
        // Apply styling based on type
        if (type === 'success') {
            messageDiv.style.color = '#27ae60';
            messageDiv.style.backgroundColor = '#d5f4e6';
            messageDiv.style.borderColor = '#27ae60';
        } else if (type === 'error') {
            messageDiv.style.color = '#e74c3c';
            messageDiv.style.backgroundColor = '#fadbd8';
            messageDiv.style.borderColor = '#e74c3c';
        }
        
        // Auto-hide error messages after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
        
        console.log(`Message displayed: ${type} - ${message}`); // Debug log
    }
    
    // Success modal functions
    function showSuccessModal(username, email) {
        const modal = document.getElementById('success-modal');
        const usernameSpan = document.getElementById('success-username');
        const emailSpan = document.getElementById('success-email');
        
        if (usernameSpan) usernameSpan.textContent = username;
        if (emailSpan) emailSpan.textContent = email;
        
        modal.style.display = 'flex';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            hideSuccessModal();
        }, 3000);
    }
    
    function hideSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Reset form function
    function resetForm() {
        // Reset form data
        form.reset();
        
        // Clear error messages
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.textContent = '');
        
        // Clear error styling
        const fields = form.querySelectorAll('input, select, textarea, fieldset');
        fields.forEach(field => {
            field.style.borderColor = '';
            field.style.backgroundColor = '';
        });
        
        // Reset password strength
        updatePasswordStrength();
        
        // Reset character count
        updateCharCount();
        
        // Hide success modal
        hideSuccessModal();
        
        console.log('Form reset completed'); // Debug log
    }
    
    // Initialize validation on page load
    updatePasswordStrength();
    updateCharCount();
    
    // Make functions globally available for onclick handlers
    window.hideSuccessModal = hideSuccessModal;
});
