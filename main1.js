// FAQApp 
class FAQApp {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.faqItems = document.querySelectorAll('.accordion-item');
    this.searchInput = document.getElementById('searchInput');
    this.tabItems = document.querySelectorAll('.tab-item');
    this.tabContents = document.querySelectorAll('.tab-content');
    this.activeFilter = 'all';

    this.init();
  }

  init() {
    this.setupTabs();
    this.setupFilters();
    this.setupSearch();
  }

  setupTabs() {
    this.tabItems.forEach(item => {
      item.addEventListener('click', () => this.activateTab(item));
    });
  }

  activateTab(item) {
    this.tabItems.forEach(i => i.classList.remove('active'));
    this.tabContents.forEach(content => content.classList.add('d-none'));

    item.classList.add('active');
    const target = document.querySelector(item.dataset.target);
    if (target) target.classList.remove('d-none');
  }

  setupFilters() {
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeFilter = btn.getAttribute('data-filter');
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.applyFilters();
      });
    });
  }

  setupSearch() {
    if (!this.searchInput) return;
    this.searchInput.addEventListener('input', () => this.applyFilters());
  }

  applyFilters() {
    const query = this.searchInput.value.toLowerCase();
    this.faqItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const title = item.querySelector('.accordion-button').textContent.toLowerCase();

      const matchesFilter = this.activeFilter === 'all' || category === this.activeFilter;
      const matchesSearch = title.includes(query);

      item.style.display = (matchesFilter && matchesSearch) ? 'block' : 'none';
    });
  }
}

// ContactForm
class ContactForm {
  constructor(formId, successMessageId) {
    this.form = document.getElementById(formId);
    this.successMessage = document.getElementById(successMessageId);

    if (this.form && this.successMessage) {
      this.inputs = {
        name: this.form.querySelector('#name'),
        email: this.form.querySelector('#email'),
        phone: this.form.querySelector('#phone'),
        subject: this.form.querySelector('#subject'),
        message: this.form.querySelector('#message')
      };
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    this.resetValidation();

    if (this.validateForm()) {
      this.successMessage.style.display = 'block';
      this.form.reset();
      setTimeout(() => {
        this.successMessage.style.display = 'none';
      }, 5000);
    }
  }

  resetValidation() {
    Object.values(this.inputs).forEach(input => {
      input.classList.remove('is-invalid');
    });
    this.successMessage.style.display = 'none';
  }

  validateForm() {
    let valid = true;

    if (this.inputs.name.value.trim().length < 2) {
      this.inputs.name.classList.add('is-invalid');
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.inputs.email.value.trim())) {
      this.inputs.email.classList.add('is-invalid');
      valid = false;
    }

    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    if (!phoneRegex.test(this.inputs.phone.value.trim())) {
      this.inputs.phone.classList.add('is-invalid');
      valid = false;
    }

    if (this.inputs.subject.value.trim().length < 2) {
      this.inputs.subject.classList.add('is-invalid');
      valid = false;
    }

    if (this.inputs.message.value.trim().length === 0) {
      this.inputs.message.classList.add('is-invalid');
      valid = false;
    }

    return valid;
  }
}

//Initialize 
document.addEventListener('DOMContentLoaded', () => {
  new FAQApp();
  new ContactForm('contactForm', 'successMessage');
});
