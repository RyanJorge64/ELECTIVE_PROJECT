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
    const categories = [
        { name: 'Home', slug: 'home' },
        { name: 'New Arrivals', slug: 'new-arrivals' },
        { name: 'Clothing', slug: 'clothing' },
        { name: 'Shoes', slug: 'shoes' },
        { name: 'Accessories', slug: 'accessories' },
        { name: 'Sale', slug: 'sale' },
    ];

    const renderCategoryLinks = (container, { includeHome = false } = {}) => {
        if (!container) return;

        const list = document.createElement('ul');
        list.className = container.classList.contains('mobileSidebarNav') ? 'mobileSidebarCategoryList' : 'unorderedList-Categories';

        const items = includeHome ? [
            { name: 'Home', slug: 'home' },
            ...categories
        ] : categories;

        items.forEach(category => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = `Home.html?category=${encodeURIComponent(category.slug)}`;
            link.textContent = category.name;
            item.append(link);
            list.append(item);
        });

        container.append(list);
    };

    const desktopCategoryList = document.querySelector('.unorderedList-Categories');
    if (desktopCategoryList) {
        renderCategoryLinks(desktopCategoryList, { includeHome: false });
    }

    const mobileSidebarNav = document.querySelector('.mobileSidebarNav');
    if (mobileSidebarNav) {
        const section = document.createElement('div');
        section.className = 'mobileSidebarCategoryGroup';

        const title = document.createElement('span');
        title.className = 'mobileSidebarSectionTitle';
        title.textContent = 'Browse by category';

        const categoryList = document.createElement('ul');
        categoryList.className = 'mobileSidebarCategoryList';

        categories.forEach(category => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = `Home.html?category=${encodeURIComponent(category.slug)}`;
            link.textContent = category.name;
            item.append(link);
            categoryList.append(item);
        });

        section.append(title, categoryList);
        mobileSidebarNav.append(section);
    }

    /* ============ Search Clear Button ============ */
    document.querySelectorAll('.searchBoxFormWrapper').forEach((searchForm) => {
        const searchInput = searchForm.querySelector('.searchInputElement');
        const searchClearButton = searchForm.querySelector('.searchClearButton');

        if (!searchInput || !searchClearButton) return;

        const updateSearchClearButton = () => {
            searchForm.classList.toggle('has-query', searchInput.value.length > 0);
        };

        searchInput.addEventListener('input', updateSearchClearButton);
        searchClearButton.addEventListener('click', () => {
            searchInput.value = '';
            updateSearchClearButton();
            searchInput.focus();
        });

        updateSearchClearButton();
    });

    document.querySelectorAll('.footerAccTrigger').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.footerAccordionItem');
            if (!item) return;

            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.footerAccordionItem').forEach((accordionItem) => {
                accordionItem.classList.remove('open');
                const button = accordionItem.querySelector('.footerAccTrigger');
                if (button) {
                    button.setAttribute('aria-expanded', 'false');
                    const icon = button.querySelector('.footerAccIcon');
                    if (icon) icon.textContent = '+';
                }
            });

            if (!isOpen) {
                item.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
                const icon = trigger.querySelector('.footerAccIcon');
                if (icon) icon.textContent = '−';
            }
        });
    });

    const mobileHeader = document.querySelector('.headerMobile');
    const mobileSearchToggle = document.querySelector('.mobileSearchToggle');
    const mobileSearchOverlay = document.querySelector('.mobileSearchOverlay');
    const mobileSearchInput = mobileSearchOverlay ? mobileSearchOverlay.querySelector('.searchInputElement') : null;

    if (mobileHeader && mobileSearchToggle && mobileSearchOverlay) {
        const closeSearch = () => {
            mobileHeader.classList.remove('search-open');
            mobileSearchToggle.setAttribute('aria-expanded', 'false');
            mobileSearchOverlay.setAttribute('aria-hidden', 'true');
            if (mobileSearchInput) mobileSearchInput.blur();
        };

        const openSearch = () => {
            mobileHeader.classList.add('search-open');
            mobileSearchToggle.setAttribute('aria-expanded', 'true');
            mobileSearchOverlay.setAttribute('aria-hidden', 'false');
            setTimeout(() => {
                if (mobileSearchInput) mobileSearchInput.focus();
            }, 50);
        };

        mobileSearchToggle.addEventListener('click', () => {
            if (mobileHeader.classList.contains('search-open')) {
                closeSearch();
            } else {
                openSearch();
            }
        });

        document.addEventListener('click', (event) => {
            const clickedInside = mobileSearchOverlay.contains(event.target) || mobileSearchToggle.contains(event.target);
            if (!clickedInside && mobileHeader.classList.contains('search-open')) {
                closeSearch();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mobileHeader.classList.contains('search-open')) {
                closeSearch();
            }
        });
    }

    const sidebarButton = document.querySelector('.sideBarButton');
    const sidebarPanel = document.querySelector('.mobileSidebarPanel');
    const sidebarOverlay = document.querySelector('.mobileSidebarOverlay');
    const sidebarCloseButton = document.querySelector('.mobileSidebarClose');

    if (sidebarButton && sidebarPanel && sidebarOverlay && sidebarCloseButton) {
        const openSidebar = () => {
            document.body.classList.add('sidebar-open');
            sidebarPanel.classList.add('open');
            sidebarPanel.setAttribute('aria-hidden', 'false');
            sidebarOverlay.classList.add('visible');
            sidebarOverlay.setAttribute('aria-hidden', 'false');

            if (mobileHeader && mobileHeader.classList.contains('search-open') && mobileSearchToggle) {
                mobileSearchToggle.click();
            }
        };

        const closeSidebar = () => {
            document.body.classList.remove('sidebar-open');
            sidebarPanel.classList.remove('open');
            sidebarPanel.setAttribute('aria-hidden', 'true');
            sidebarOverlay.classList.remove('visible');
            sidebarOverlay.setAttribute('aria-hidden', 'true');
        };

        sidebarButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (sidebarPanel.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        sidebarCloseButton.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && sidebarPanel.classList.contains('open')) {
                closeSidebar();
            }
        });
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