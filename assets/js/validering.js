
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.newsletter form');
    const emailInput = document.querySelector('.newsletter-input');
    const submitButton = document.querySelector('.newsletter-submit');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const email = emailInput.value;
        const isValidEmail = validateEmail(email);

        if (isValidEmail) {
            alert('Thanks for subscribing! We’re excited to share our updates with you.');
            emailInput.value = ''; 
        } else {
            alert('Please enter a valid email address.');
            emailInput.focus();
        }
    });

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }
});

