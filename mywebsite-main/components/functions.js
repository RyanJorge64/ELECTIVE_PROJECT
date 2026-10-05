const carouselContainer = document.querySelector('.imageContainer');
const slides = document.querySelectorAll('.slideImages img');
const yearSelect = document.getElementById('year');
const currentYear = new Date().getFullYear();
/*password strength checker*/
var strengthValue = document.getElementById('strengthValue');

let slideIndex = 0;
let interval = null;

let showPswrdbtn = document.getElementById('showPswrdid'); //show password
let pswrd = document.getElementById('password'); //password
let confirmPswrd = document.getElementById('confirmPassword'); //confirm password


document.addEventListener('DOMContentLoaded', () => {

    /* categories */
    const categoryList = document.querySelector('.unorderedList-Categories');
    const categories = [
        { name: 'Home', slug: 'home' },
        { name: 'New Arrivals', slug: 'new-arrivals' },
        { name: 'Clothing', slug: 'clothing' },
        { name: 'Shoes', slug: 'shoes' },
        { name: 'Accessories', slug: 'accessories' },
        { name: 'Sale', slug: 'sale' },
    ];

    if (categoryList) {
        categories.forEach(category => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = `Home.html?category=${encodeURIComponent(category.slug)}`;
            link.textContent = category.name;
            item.append(link);
            categoryList.append(item);
        });
    }

    /* ============ Search Clear Button ============ */
    const searchForm = document.querySelector('.searchBoxFormWrapper');
    const searchInput = document.querySelector('.searchInputElement');
    const searchClearButton = document.querySelector('.searchClearButton');

    if (searchForm && searchInput && searchClearButton) {
        function updateSearchClearButton() {
            searchForm.classList.toggle('has-query', searchInput.value.length > 0);
        }

        searchInput.addEventListener('input', updateSearchClearButton);
        searchClearButton.addEventListener('click', () => {
            searchInput.value = '';
            updateSearchClearButton();
            searchInput.focus();
        });

        updateSearchClearButton();
    }

    /* ============ Slider ============ */
    const slides = document.querySelectorAll('.slideImages img');
    let slideIndex = 0;
    let interval = null;

    function initSlider() {
        if (!slides.length) return;

        slides[slideIndex].style.transition = 'none';
        slides[slideIndex].classList.add('active');

        setTimeout(() => {
            slides[slideIndex].style.transition = '';
            interval = setInterval(nextSlide, 8000);
        }, 50);
    }

    function showSlide(index) {
        slideIndex = (index + slides.length) % slides.length;

        slides.forEach(img => {
            if (img.classList.contains('active')) {
                img.classList.remove('active');
                img.classList.add('previous');
                setTimeout(() => img.classList.remove('previous'), 600);
            }
        });

        slides[slideIndex].classList.add('active');
    }

    function previousSlide() {
        showSlide(slideIndex - 1);
    }

    function nextSlide() {
        showSlide(slideIndex + 1);
    }

    function resetAutoSlide() {
        if (interval) clearInterval(interval);
        interval = setInterval(nextSlide, 8000);
    }

    document.querySelectorAll('.carouselMoveBtn').forEach((button, index) => {
        button.addEventListener('click', () => {
            if (index === 0) {
                previousSlide();
            } else {
                nextSlide();
            }
            resetAutoSlide();
        });
    });

    initSlider();

    /* ============ Show/Hide Password ============ */
    document.querySelectorAll('.showPswrd').forEach(showPasswordButton => {
        const passwordInput = showPasswordButton
            .closest('.containerInput')
            ?.querySelector('input[type="password"], input[type="text"]');

        if (!passwordInput) return;

        showPasswordButton.addEventListener('click', () => {
            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            showPasswordButton.textContent = isHidden ? 'Hide' : 'Show';
        });
    });

    /* ============ Date Dropdowns ============ */
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');
    const currentYear = new Date().getFullYear();
    const months = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];

    if (yearSelect && monthSelect && daySelect) {
        // Populate Year
        yearSelect.innerHTML = '<option value="">Year</option>' +
            Array.from({ length: 100 }, (_, i) => currentYear - i)
                .map(y => `<option value="${y}">${y}</option>`)
                .join('');

        // Populate Month
        monthSelect.innerHTML = '<option value="">Month</option>' +
            months.map((m, i) => `<option value="${i + 1}">${m}</option>`).join('');

        // Populate Day (dynamic based on month/year)
        function updateDays() {
            const year = yearSelect.value || currentYear;
            const month = monthSelect.value || 1;
            const daysInMonth = new Date(year, month, 0).getDate(); // day 0 = last day of prev month

            daySelect.innerHTML = '<option value="">Day</option>' +
                Array.from({ length: daysInMonth }, (_, i) => i + 1)
                    .map(d => `<option value="${d}">${d}</option>`)
                    .join('');
        }

        updateDays();

        monthSelect.addEventListener('change', updateDays);
        yearSelect.addEventListener('change', updateDays);
    } else {
        console.warn('Date dropdown elements not found: check #year, #month, #day ids.');
    }

    /* ============ Password Strength Checker ============ */
   /* ============ Password Strength Checker ============ */
const strengthBar   = document.getElementById('strengthBar');
const strengthFill  = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

if (pswrd && strengthBar && strengthFill && strengthLabel) {
    pswrd.addEventListener('input', () => {
        const value = pswrd.value;

        if (value.length === 0) {
            strengthBar.style.display = 'none';
            strengthLabel.textContent = '';
            return;
        }

        strengthBar.style.display = 'block';

        const checks = {
            length:    value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number:    /[0-9]/.test(value),
            symbol:    /[^A-Za-z0-9]/.test(value),
        };

        const score = Object.values(checks).filter(Boolean).length; // 0–5

        // Map score (0-5) to a percentage and a color/label
        const percent = (score / 5) * 100;
        let color, label;

        if (score <= 2) {
            color = 'red';      label = 'Weak';
        } else if (score === 3) {
            color = 'orange';   label = 'Medium';
        } else if (score === 4) {
            color = 'green';    label = 'Strong';
        } else {
            color = '#00a550';  label = 'Very Strong';
        }

        strengthFill.style.width = `${percent}%`;
        strengthFill.style.backgroundColor = color;
        strengthLabel.textContent = label;
        strengthLabel.style.color = color;
        strengthLabel.style.fontWeight = score === 5 ? 'bold' : 'normal';
    });
} else {
    console.warn('Password strength elements not found: check #password, #strengthBar, #strengthFill, #strengthLabel ids.');
}
});