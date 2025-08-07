// Complete Course Registration System JavaScript
// This file handles all functionality for the course registration system

// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080',
    ENDPOINTS: {
        COURSES: '/courses',
        ENROLL: '/courses/enroll',
        ENROLLED_STUDENTS: '/courses/enrolled'
    }
};

// Utility Functions
class CourseRegistrationSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handlePageLoad();
    }

    // Setup event listeners for all pages
    setupEventListeners() {
        // Form submission handler
        const enrollForm = document.querySelector('form[action*="/courses/enroll"]');
        if (enrollForm) {
            enrollForm.addEventListener('submit', this.handleFormSubmission.bind(this));
        }

        // Back button handlers
        const backButtons = document.querySelectorAll('.back-button');
        backButtons.forEach(button => {
            button.addEventListener('click', this.handleBackNavigation.bind(this));
        });

        // Enhanced form interactions
        this.setupFormEnhancements();
        
        // Navigation enhancements
        this.setupNavigationEnhancements();
    }

    // Handle page load based on current page
    handlePageLoad() {
        const currentPage = this.getCurrentPageName();
        
        switch(currentPage) {
            case 'availcourse.html':
            case 'availcourse':
                this.loadAvailableCourses();
                break;
            case 'enrolled.html':
            case 'enrolled':
                this.loadEnrolledStudents();
                break;
            case 'register.html':
            case 'register':
                this.setupRegistrationForm();
                break;
            case 'index.html':
            case 'index':
            default:
                this.setupHomePage();
                break;
        }
    }

    // Get current page name
    getCurrentPageName() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }

    // Load available courses
    async loadAvailableCourses() {
        const tableBody = document.getElementById('coursetable');
        if (!tableBody) return;

        try {
            // Show loading state
            this.showLoadingState(tableBody, 4);

            // Fetch courses from API
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COURSES}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const courses = await response.json();
            
            // Clear loading state
            tableBody.innerHTML = '';

            if (courses && courses.length > 0) {
                courses.forEach((course, index) => {
                    const row = this.createCourseRow(course, index);
                    tableBody.appendChild(row);
                });
                
                // Add stagger animation
                this.addStaggerAnimation('.courses-table tbody tr');
            } else {
                this.showEmptyState(tableBody, 4, 'No courses available at the moment.');
            }

        } catch (error) {
            console.error('Error loading courses:', error);
            this.showErrorState(tableBody, 4, 'Failed to load courses. Please check your connection and try again.');
        }
    }

    // Load enrolled students
    async loadEnrolledStudents() {
        const tableBody = document.getElementById('coursetable') || document.getElementById('enrolledtable');
        if (!tableBody) return;

        try {
            // Show loading state
            this.showLoadingState(tableBody, 3);

            // Fetch enrolled students from API
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENROLLED_STUDENTS}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const students = await response.json();
            
            // Clear loading state
            tableBody.innerHTML = '';

            if (students && students.length > 0) {
                students.forEach((student, index) => {
                    const row = this.createStudentRow(student, index);
                    tableBody.appendChild(row);
                });
                
                // Add stagger animation
                this.addStaggerAnimation('.courses-table tbody tr');
            } else {
                this.showEmptyState(tableBody, 3, 'No enrolled students found.');
            }

        } catch (error) {
            console.error('Error loading enrolled students:', error);
            this.showErrorState(tableBody, 3, 'Failed to load enrolled students. Please check your connection and try again.');
        }
    }

    // Create course row element
    createCourseRow(course, index) {
        const row = document.createElement('tr');
        row.className = 'course-row';
        row.style.animationDelay = `${index * 0.1}s`;
        
        row.innerHTML = `
            <td>${this.escapeHtml(course.courseId || 'N/A')}</td>
            <td>${this.escapeHtml(course.courseName || 'N/A')}</td>
            <td>${this.escapeHtml(course.trainer || course.instructor || 'N/A')}</td>
            <td>${this.escapeHtml(course.durationInWeeks || course.duration || 'N/A')} ${course.durationInWeeks ? 'weeks' : ''}</td>
        `;
        
        return row;
    }

    // Create student row element
    createStudentRow(student, index) {
        const row = document.createElement('tr');
        row.className = 'course-row';
        row.style.animationDelay = `${index * 0.1}s`;
        
        row.innerHTML = `
            <td>${this.escapeHtml(student.name || 'N/A')}</td>
            <td>${this.escapeHtml(student.emailId || student.email || 'N/A')}</td>
            <td>${this.escapeHtml(student.courseName || 'N/A')}</td>
        `;
        
        return row;
    }

    // Show loading state
    showLoadingState(tableBody, colspan) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="${colspan}" class="loading">
                    <div class="loading-spinner"></div>
                    Loading data...
                </td>
            </tr>
        `;
    }

    // Show empty state
    showEmptyState(tableBody, colspan, message) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="${colspan}" style="padding: 2rem; color: rgba(255, 255, 255, 0.6); font-style: italic;">
                    ${message}
                </td>
            </tr>
        `;
    }

    // Show error state
    showErrorState(tableBody, colspan, message) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="${colspan}" style="padding: 2rem; color: #ff6b6b; text-align: center;">
                    ⚠️ ${message}
                    <br><br>
                    <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: rgba(255, 107, 107, 0.2); color: #ff6b6b; border: 1px solid #ff6b6b; border-radius: 6px; cursor: pointer;">
                        Try Again
                    </button>
                </td>
            </tr>
        `;
    }

    // Handle form submission
    async handleFormSubmission(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            submitButton.style.background = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Validate form data
            if (!this.validateFormData(data)) {
                throw new Error('Please fill in all required fields correctly.');
            }

            // Submit to API
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENROLL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Registration failed: ${errorText || response.statusText}`);
            }

            // Success handling
            this.showSuccessMessage('Registration successful! You will be redirected shortly.');
            
            // Reset form
            form.reset();
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            this.showErrorMessage(error.message || 'Registration failed. Please try again.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.style.background = '';
        }
    }

    // Validate form data
    validateFormData(data) {
        const { name, emailId, courseName } = data;
        
        if (!name || name.trim().length < 2) {
            this.showErrorMessage('Please enter a valid name (at least 2 characters).');
            return false;
        }
        
        if (!emailId || !this.isValidEmail(emailId)) {
            this.showErrorMessage('Please enter a valid email address.');
            return false;
        }
        
        if (!courseName) {
            this.showErrorMessage('Please select a course.');
            return false;
        }
        
        return true;
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show success message
    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    // Show error message
    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    // Show notification
    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
            ${type === 'success' 
                ? 'background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);' 
                : 'background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);'
            }
        `;
        notification.textContent = message;

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Setup registration form enhancements
    setupRegistrationForm() {
        const form = document.querySelector('form');
        if (!form) return;

        // Populate course options from API
        this.populateCourseOptions();
        
        // Add real-time validation
        this.setupRealTimeValidation();
    }

    // Populate course options dynamically
    async populateCourseOptions() {
        const courseSelect = document.getElementById('course');
        if (!courseSelect) return;

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COURSES}`);
            if (response.ok) {
                const courses = await response.json();
                
                // Clear existing options except the first one
                const firstOption = courseSelect.querySelector('option[value=""]');
                courseSelect.innerHTML = '';
                if (firstOption) courseSelect.appendChild(firstOption);
                
                // Add course options
                courses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.courseName || course.courseId;
                    option.textContent = `${course.courseName} (${course.durationInWeeks} weeks)`;
                    courseSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.warn('Could not load course options:', error);
            // Keep the default static options
        }
    }

    // Setup real-time validation
    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch(field.type || field.tagName.toLowerCase()) {
            case 'text':
                if (field.name === 'name') {
                    isValid = value.length >= 2;
                    message = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                isValid = this.isValidEmail(value);
                message = 'Please enter a valid email address';
                break;
            case 'select-one':
                isValid = value !== '';
                message = 'Please select a course';
                break;
        }

        if (!isValid && value !== '') {
            this.showFieldError(field, message);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    // Show field error
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#ff6b6b';
        field.style.boxShadow = '0 0 0 4px rgba(255, 107, 107, 0.1)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = 'color: #ff6b6b; font-size: 0.8rem; margin-top: 0.25rem;';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    // Clear field error
    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }

    // Setup form enhancements
    setupFormEnhancements() {
        const inputs = document.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'translateY(-2px) translateZ(10px)';
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = 'translateY(0px) translateZ(0px)';
            });
        });
    }

    // Setup navigation enhancements
    setupNavigationEnhancements() {
        const navButtons = document.querySelectorAll('.nav-button');
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Add click effect
                button.style.transform = 'translateY(2px) scale(0.98)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            });
        });
    }

    // Setup home page
    setupHomePage() {
        // Add any home page specific functionality
        this.setupNavigationEnhancements();
    }

    // Handle back navigation
    handleBackNavigation(event) {
        event.preventDefault();
        
        // Use history.back() if available, otherwise redirect to index
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    }

    // Add stagger animation to elements
    addStaggerAnimation(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
        });
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, (m) => map[m]);
    }

    // Utility method to handle API errors gracefully
    handleApiError(error, context) {
        console.error(`API Error in ${context}:`, error);
        
        // You can extend this to send error reports to your logging service
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return 'Unable to connect to the server. Please check your internet connection.';
        }
        
        return error.message || 'An unexpected error occurred. Please try again.';
    }
}

// Legacy function support (for backwards compatibility)
function showCourses() {
    if (window.courseSystem) {
        window.courseSystem.loadAvailableCourses();
    }
}

function showEnrolledStudents() {
    if (window.courseSystem) {
        window.courseSystem.loadEnrolledStudents();
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.courseSystem = new CourseRegistrationSystem();
});

// Also support window.onload for compatibility
window.addEventListener('load', function() {
    if (!window.courseSystem) {
        window.courseSystem = new CourseRegistrationSystem();
    }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CourseRegistrationSystem;
}