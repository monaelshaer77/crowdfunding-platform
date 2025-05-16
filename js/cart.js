
document.addEventListener('DOMContentLoaded', function() {
function localContent(elementId,fileName)
{
    fetch(fileName)
    .then(response=>response.text())
    .then(data=>{
        document.getElementById(elementId).innerHTML=data;
    })
    .catch(err=>console.log('Error loading content'));
}
localContent("header-container",'../components/header.html');
localContent("footer-conteriner","../components/footer.html");
    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Donation amount selection
    const amountOptions = document.querySelectorAll('.amount-option');
    const customAmountInput = document.getElementById('custom-amount');
    const donationTotal = document.getElementById('donation-total');
    
    amountOptions.forEach(option => {
        option.addEventListener('click', function() {
            amountOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            const amount = this.getAttribute('data-amount');
            if (amount === 'custom') {
                customAmountInput.focus();
                if (customAmountInput.value) {
                    donationTotal.textContent = '$' + customAmountInput.value;
                }
            } else {
                donationTotal.textContent = '$' + amount;
                customAmountInput.value = amount;
            }
        });
    });
    
    customAmountInput.addEventListener('input', function() {
        const customOption = document.querySelector('[data-amount="custom"]');
        amountOptions.forEach(o => o.classList.remove('active'));
        customOption.classList.add('active');
        
        if (this.value) {
            donationTotal.textContent = '$' + this.value;
        } else {
            donationTotal.textContent = '$0';
        }
    });
    
    // Form submission
    const donationForm = document.getElementById('donation-form');
    donationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const requiredFields = donationForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '#d0d5dd';
            }
        });
        
        if (isValid) {
            alert('Thank you for your donation of ' + donationTotal.textContent + '!');
            // In a real application, you would submit the form data to a server here
        } else {
            alert('Please fill in all required fields.');
        }
    });
    
    // Header donate button
    const donateBtn = document.querySelector('.donate-btn');
    donateBtn.addEventListener('click', function() {
        window.scrollTo({
            top: document.querySelector('.donation-amount').offsetTop,
            behavior: 'smooth'
        });
    });
});