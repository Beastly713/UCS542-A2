// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    /**
     * ------------------------------------------------
     * Task 1: Active Navigation Link
     * Runs on all pages
     * ------------------------------------------------
     */
    const currentPage = window.location.pathname; // Gets the current file path
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        // Use .includes() to match the link href
        // This handles both "/index.html" and "/"
        if (currentPage.endsWith(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });


    /**
     * ------------------------------------------------
     * Task 2: Dynamic Packages Table
     * Runs only on the packages page
     * ------------------------------------------------
     */
    if (document.body.id === 'packages-page') {
        const packages = [
            { id: 'beach', destination: 'Maldives', durationDays: 7, basePrice: 200000, season: 'Peak' },
            { id: 'mountain', destination: 'Nepal', durationDays: 10, basePrice: 145000, season: 'Off' },
            { id: 'ancient', destination: 'Rome, Italy', durationDays: 5, basePrice: 175000, season: 'Peak' },
            { id: 'city', destination: 'Tokyo, Japan', durationDays: 7, basePrice: 240000, season: 'Shoulder' }
        ];

        // Function to calculate price based on season
        function calculateFinalPrice(package) {
            let finalPrice = package.basePrice;
            
            // Use switch for seasonal logic
            switch (package.season) {
                case 'Peak':
                    finalPrice *= 1.25; // 25% surcharge
                    break;
                case 'Off':
                    finalPrice *= 0.85; // 15% discount
                    break;
                case 'Shoulder':
                    // No change
                    break;
            }
            return finalPrice;
        }

        // Function to render the table
        function renderPackageTable() {
            const tableBody = document.getElementById('packages-tbody');
            tableBody.innerHTML = ''; // Clear existing content

            // Loop through packages and create table rows
            packages.forEach(pkg => {
                const finalPrice = calculateFinalPrice(pkg);
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pkg.id.charAt(0).toUpperCase() + pkg.id.slice(1)}</td>
                    <td>${pkg.destination}</td>
                    <td>${pkg.durationDays} Days</td>
                    <td>₹${pkg.basePrice.toFixed(2)}</td>
                    <td>₹${finalPrice.toFixed(2)}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Initial render
        renderPackageTable();
    }


    /**
     * ------------------------------------------------
     * Task 3: Booking Price Estimator
     * Runs only on the booking page
     * ------------------------------------------------
     */
    if (document.body.id === 'booking-page') {
        // Base prices object (must match select <option> values)
        const packageBasePrices = {
            'beach': 200000,
            'mountain': 145000,
            'ancient': 175000,
            'city': 240000
        };

        const form = document.querySelector('.booking-form');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const packageSelect = document.getElementById('package');
        const guestsInput = document.getElementById('guests');
        const promoInput = document.getElementById('promo');
        const totalDisplay = document.getElementById('estimated-total');
        const submitButton = document.getElementById('submit-btn');

        function validateForm() {
            // Check for empty required fields
            if (!nameInput.value || !emailInput.value || !startDateInput.value || !endDateInput.value || !packageSelect.value || !guestsInput.value) {
                return false;
            }

            // Check if dates are logical
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            if (endDate <= startDate) {
                return false;
            }
            
            return true; // All good
        }

        function calculateTotalPrice() {
            let finalPrice = packageBasePrices[packageSelect.value] || 0;
            
            // 1. Apply guest multiplier
            const guests = parseInt(guestsInput.value);
            if (guests > 2) {
                finalPrice *= 1.2; // +20% for more than 2 guests
            } else if (guests < 1) {
                finalPrice = 0; // Cannot have less than 1 guest
            }

            // 2. Apply promo code discount
            const promoCode = promoInput.value.trim().toUpperCase();
            if (promoCode === 'EARLYBIRD') {
                finalPrice *= 0.9; // 10% discount
            }

            // Update display
            totalDisplay.textContent = `Estimated Total: ₹${finalPrice.toFixed(2)}`;
            
            // 3. Enable/disable submit button
            submitButton.disabled = !validateForm();
        }

        // Add event listeners to all form fields
        form.addEventListener('input', calculateTotalPrice);
        
        // Initial call to set button state
        calculateTotalPrice();
    }


    /**
     * ------------------------------------------------
     * Task 4: Gallery Modal
     * Runs only on the gallery page
     * ------------------------------------------------
     */
    if (document.body.id === 'gallery-page') {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalImage = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        const closeModalBtn = document.getElementById('modal-close');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Read data-* attributes
                const largeImageUrl = item.getAttribute('data-large');
                const captionText = item.getAttribute('data-caption');

                // Update modal attributes
                modalImage.setAttribute('src', largeImageUrl);
                modalImage.setAttribute('alt', captionText);
                modalCaption.textContent = captionText;

                // Update style via JS to show modal
                modalBackdrop.style.display = 'flex';
            });
        });

        // Function to close the modal
        function closeModal() {
            modalBackdrop.style.display = 'none';
        }

        // Close modal listeners
        closeModalBtn.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', (event) => {
            // Only close if the click is on the backdrop itself, not the content
            if (event.target === modalBackdrop) {
                closeModal();
            }
        });
    }

});