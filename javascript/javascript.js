// ========== 🌐 General Form Logic ==========

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#contactForm');
    const statusDiv = document.querySelector('#formStatus');
    if (!form) return console.error("Contact form not found!");

    // 📌 Map all fields (same as process_form.php)
    const fields = {
        fullName: form.querySelector('#fullName'),
        email: form.querySelector('#email'),
        phone: form.querySelector('#phone'),
        city: form.querySelector('#city'),
        goals: form.querySelector('#goals'),
        budget: form.querySelector('#budget'),
        timeline: form.querySelector('#timeline'),
        referenceLinks: form.querySelector('#referenceLinks'),
        referralName: form.querySelector('#referralName'),
        referralContact: form.querySelector('#referralContact'),
        inquiry: form.querySelector('#inquiry'),

        websiteType: form.querySelector('#websiteType'),
        packageSelect: form.querySelector('#packageSelect'),
        dronesDetails: form.querySelector('#dronesDetails'),
        vehiclesDetails: form.querySelector('#vehiclesDetails'),
        armorDetails: form.querySelector('#armorDetails'),
        architectureDetails: form.querySelector('#architectureDetails'),

        graphicType: form.querySelector('#graphicType'),
        graphicPackage: form.querySelector('#graphicPackage'),
        graphicDescription: form.querySelector('#graphicDescription'),

        socialService: form.querySelector('#socialService'),
        socialPackage: form.querySelector('#socialPackage'),
        socialPlatforms: form.querySelector('#socialPlatforms'),

        aiAgentService: form.querySelector('#aiAgentService'),
        aiAgentPurpose: form.querySelector('#aiAgentPurpose'),

        customOption: form.querySelector('#customOption'),
        customDescription: form.querySelector('#customDescription'),

        fileUpload: form.querySelector('#fileUpload'),
    };

    // 🧠 Validators
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^\(?\+?[0-9]*\)?[-.\s]?([0-9]{1,4})?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{4,6}$/.test(phone);
    }

    // ❌ Mark field invalid
    function markInvalid(field, message = "This field is required.") {
        if (!field) return;
        field.classList.add('is-invalid');
        let feedback = field.parentElement.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentElement.appendChild(feedback);
        }
        feedback.innerText = message;
    }

    // 🧽 Clear validation errors
    function clearValidation() {
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        statusDiv.innerHTML = '';
    }

    // 📤 Submit form via AJAX
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        clearValidation();

        let valid = true;

        // ✅ Required field checks
        if (!fields.fullName.value.trim()) { markInvalid(fields.fullName, "Full name is required."); valid = false; }
        if (!isValidEmail(fields.email.value.trim())) { markInvalid(fields.email, "Valid email required."); valid = false; }
        if (!isValidPhone(fields.phone.value.trim())) { markInvalid(fields.phone, "Valid phone number required."); valid = false; }
        if (!fields.goals.value.trim()) { markInvalid(fields.goals, "Project goals are required."); valid = false; }
        if (!fields.referralName.value.trim()) { markInvalid(fields.referralName, "Referral name is required."); valid = false; }
        if (!fields.referralContact.value.trim()) { markInvalid(fields.referralContact, "Referral contact is required."); valid = false; }

        if (!valid) {
            statusDiv.innerHTML = `<div class="alert alert-danger">Please correct the highlighted fields.</div>`;
            statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // 🚀 Submit via fetch
        statusDiv.innerHTML = "Sending...";
        const formData = new FormData(form);

        try {
            const response = await fetch("process_form.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.status === "success") {
                statusDiv.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
                form.reset();
            } else {
                const msg = result.errors ? result.errors.join("<br>") : result.message;
                statusDiv.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
            }
        } catch (error) {
            console.error("Form submission error:", error);
            statusDiv.innerHTML = `<div class="alert alert-danger">An unexpected error occurred. Please try again later.</div>`;
        }
    });
});

// ========== 🎨 Theme Toggle ==========

document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn?.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        themeIcon.classList.toggle('fa-sun', isLight);
        themeIcon.classList.toggle('fa-moon', !isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
});

// ========== 🔘 Dynamic Section Toggles ==========

document.addEventListener('DOMContentLoaded', () => {
    const toggleSection = (checkboxId, sectionId) => {
        const checkbox = document.getElementById(checkboxId);
        const section = document.getElementById(sectionId);
        checkbox?.addEventListener("change", () => {
            section.style.display = checkbox.checked ? "block" : "none";
        });
    };

    toggleSection("webDevCheck", "webDevSection");
    toggleSection("graphicDesignCheck", "graphicDesignSection");
    toggleSection("socialMediaCheck", "socialMediaSection");
    toggleSection("customSolutionsCheck", "customSolutionsSection");
    toggleSection("aiAgentsCheck", "aiAgentsSection");
    toggleSection("dronesCheck", "dronesSection");
    toggleSection("vehiclesCheck", "vehiclesSection");
    toggleSection("armorCheck", "armorSection");
    toggleSection("architectureCheck", "architectureSection");
});

// ========== 🖼️ Project Modal Viewer ==========

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('projectModal');
    const closeBtn = modal?.querySelector('.close');
    const viewProjectButtons = document.querySelectorAll('.btn-primary');

    function openModal(id) {
        modal.style.display = 'flex';
        const modalImages = modal.querySelector('.modal-images');
        modalImages.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
            const img = document.createElement('img');
            img.src = `images/project${id}_image${i}.jpg`;
            img.alt = `Project ${id} Image ${i}`;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '90vh';
            modalImages.appendChild(img);
        }
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    viewProjectButtons.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            openModal(id);
        });
    });

    closeBtn?.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});

// ========== ✅ Select2 Initialization ==========

document.addEventListener('DOMContentLoaded', function () {
    if (window.$ && $.fn.select2) {
        $('#websiteType').select2({
            placeholder: 'Search or select a website type',
            allowClear: true
        });
    }
});
