document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Plan Selection
    const planCards = document.querySelectorAll('.plan-card');
    const checkoutSection = document.getElementById('checkoutSection');
    const planNameElement = document.getElementById('planName');
    const planPriceElement = document.getElementById('planPrice');
    const totalAmountElement = document.getElementById('totalAmount');

    planCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            planCards.forEach(c => c.classList.remove('selected'));
            // Add active class to selected card
            card.classList.add('selected');

            // Update checkout information
            const planType = card.dataset.plan;
            const price = planType === 'yearly' ? '$39' : '$49';
            const period = '/month';

            planNameElement.textContent = planType === 'yearly' ? 'Yearly Plan' : 'Monthly Plan';
            planPriceElement.textContent = `${price}${period}`;
            totalAmountElement.textContent = price + '.00';

            // Show checkout section
            checkoutSection.style.display = 'block';
            // Smooth scroll to checkout
            checkoutSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Card Number Formatting
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
    });

    // Expiry Date Formatting
    const expiryDateInput = document.getElementById('expiryDate');
    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        
        e.target.value = value;
    });

    // Form Validation
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const cardName = document.getElementById('cardName').value;
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        const expiryDate = expiryDateInput.value;
        const cvv = document.getElementById('cvv').value;
        const billingAddress = document.getElementById('billingAddress').value;
        const city = document.getElementById('city').value;
        const zipCode = document.getElementById('zipCode').value;

        if (!cardName || !cardNumber || !expiryDate || !cvv || !billingAddress || !city || !zipCode) {
            alert('Please fill in all required fields');
            return;
        }

        if (cardNumber.length < 16) {
            alert('Please enter a valid card number');
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            alert('Please enter a valid expiry date (MM/YY)');
            return;
        }

        if (cvv.length < 3) {
            alert('Please enter a valid CVV');
            return;
        }

        // Simulate payment processing
        const payButton = document.querySelector('.pay-now-btn');
        payButton.disabled = true;
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        setTimeout(() => {
            alert('Payment successful! Welcome to FitLife Gym!');
            window.location.href = 'dashboard.html';
        }, 2000);
    });

    // Real-time card type detection
    cardNumberInput.addEventListener('input', function(e) {
        const number = e.target.value.replace(/\D/g, '');
        const cardIcons = document.querySelectorAll('.card-icons i');
        
        // Reset all icons
        cardIcons.forEach(icon => icon.style.opacity = '0.3');
        
        // Detect card type
        if (number.startsWith('4')) {
            document.querySelector('.fa-cc-visa').style.opacity = '1';
        } else if (number.startsWith('5')) {
            document.querySelector('.fa-cc-mastercard').style.opacity = '1';
        } else if (number.startsWith('3')) {
            document.querySelector('.fa-cc-amex').style.opacity = '1';
        }
    });
});
