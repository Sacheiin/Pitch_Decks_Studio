document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('intake-form');
    const steps = Array.from(form.querySelectorAll('.form-step'));
    const nextButtons = Array.from(form.querySelectorAll('.next-btn'));
    const prevButtons = Array.from(form.querySelectorAll('.prev-btn'));
    const progressSteps = Array.from(document.querySelectorAll('.progress-indicator .step'));
    const confirmationMessage = document.getElementById('confirmation-message');

    let currentStep = 0;

    function updateProgressIndicator() {
        progressSteps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        currentStep = stepIndex;
        updateProgressIndicator();
    }

    function calculateSummary() {
        const selectedPackage = form.querySelector('input[name="package"]:checked');
        const addons = Array.from(form.querySelectorAll('input[name^="addon_"]:checked'));

        let total = 0;
        let packageName = 'N/A';
        let addonText = 'None';

        if (selectedPackage) {
            packageName = selectedPackage.parentElement.textContent.trim();
            switch (selectedPackage.value) {
                case 'basic': total += 1999; break;
                case 'pro': total += 4999; break;
                case 'premium': total += 9999; break;
            }
        }

        if (addons.length > 0) {
            addonText = addons.map(addon => {
                total += parseInt(addon.value, 10);
                return addon.parentElement.textContent.replace(/(: ₹\d+)/, '').trim(); // Extract text before price
            }).join(', ');
        }

        document.getElementById('summary-package').textContent = packageName;
        document.getElementById('summary-addons').textContent = addonText;
        // Assuming prices are in INR for calculation, display might need adjustment for dual currency
        document.getElementById('summary-total').textContent = `₹${total}`; 
    }

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Basic validation for current step before proceeding
            const currentStepElement = steps[currentStep];
            const inputs = Array.from(currentStepElement.querySelectorAll('input[required], select[required], textarea[required]'));
            let isValid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    // Add some visual feedback for invalid fields if desired
                    input.style.borderColor = 'red'; 
                } else {
                    input.style.borderColor = '#ccc'; // Reset border
                }
            });

            if (isValid && currentStep < steps.length - 1) {
                if (currentStep === 3) { // Before showing step 5 (summary)
                    calculateSummary();
                }
                showStep(currentStep + 1);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission for now
        // Here you would integrate payment processing (Stripe/Razorpay)
        // After successful payment:
        form.style.display = 'none'; // Hide the form
        confirmationMessage.style.display = 'block'; // Show confirmation
        // Trigger backend alerts/emails etc.
        console.log('Form submitted (simulated)');
    });

    // Initialize first step
    showStep(0);
});