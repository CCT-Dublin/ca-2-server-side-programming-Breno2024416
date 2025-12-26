//Keeps the logic for the csv data validation and database insertion 
/**
 * this handle the client-side validation
 * It ensures that the data entered by the user meets all requirements 
 * before the form is allowed to submit to the server.
 */

const submissionForm = document.getElementById('submissionForm');

submissionForm.addEventListener('submit', function(event) {
    // We start by assuming the form is valid.
    let isValid = true;

    // --- 1. First Name & Second Name Validation ---
    // Rule: Only letters or numbers, max 20 characters.
    const firstName = document.getElementById('firstName').value;
    const secondName = document.getElementById('secondName').value;
    // This regex checks for alphanumeric characters (a-z, A-Z, 0-9) only.
    const nameRegex = /^[a-zA-Z0-9]+$/;

    if (!nameRegex.test(firstName) || firstName.length > 20) {
        showError('firstNameError', 'First name must be alphanumeric and max 20 characters.');
        isValid = false;
    } else {
        clearError('firstNameError');
    }

    if (!nameRegex.test(secondName) || secondName.length > 20) {
        showError('secondNameError', 'Second name must be alphanumeric and max 20 characters.');
        isValid = false;
    } else {
        clearError('secondNameError');
    }

    // --- 2. Email Validation ---
    // Rule: Must be a valid email format.
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard pattern: text@text.text

    if (!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address.');
        isValid = false;
    } else {
        clearError('emailError');
    }

    // --- 3. Phone Number Validation ---
    // Rule: Contain only numbers, exactly 10 digits.
    const phoneNumber = document.getElementById('phoneNumber').value;
    const phoneRegex = /^[0-9]{10}$/; // Checks for exactly 10 digits

    if (!phoneRegex.test(phoneNumber)) {
        showError('phoneNumberError', 'Phone number must be exactly 10 digits.');
        isValid = false;
    } else {
        clearError('phoneNumberError');
    }

    // -Eircode Validation 
    // Rules: Starts with a number, alphanumeric, exactly 6 characters lon
    const eircode = document.getElementById('eircode').value;
    // Regex breakdown: ^[0-9] (starts with number), [a-zA-Z0-9]{5}$
    const eircodeRegex = /^[0-9][a-zA-Z0-9]{5}$/;

    if (!eircodeRegex.test(eircode)) {
        showError('eircodeError', 'Eircode must be 6 chars, alphanumeric, and start with a number.');
        isValid = false;
    } else {
        clearError('eircodeError');
    }

    // --- Final Check ---
    // If any validation failed, we prevent the form from actually sending data to the server.
    if (!isValid) {
        event.preventDefault(); 
        console.log("Form submission blocked due to validation errors.");
    }
});

/**
 * Helper function to display error messages in the UI.
 * This helps satisfy the requirement of showing error messages to the user.
 */
function showError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
}

/**
 * Helper function to clear error messages if the input is corrected.
 */
function clearError(elementId) {
    document.getElementById(elementId).textContent = '';
}