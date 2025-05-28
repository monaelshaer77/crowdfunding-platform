
function loadCampaign() {
  const params = new URLSearchParams(window.location.search);
  const campaignId = params.get("id");

  const titleElement = document.getElementById("campaign-title");
  const goalElement = document.querySelector(".campaign-goal");
  const raisedElement = document.querySelector(".campaign-raised");
  const deadlineElement = document.querySelector(".campaign-deadline");
  const campaignImage=document.querySelector(".viewcampaineimage");
  const rewardsElement = document.querySelector(".campaign-rewards");

  function localContent(elementId, fileName) {
    fetch(fileName)
      .then(response => response.text())
      .then(data => {
        document.getElementById(elementId).innerHTML = data;
      })
      .catch(err => console.log("Error loading content:", err));
  }

  localContent("header-container", "../components/header.html");
  localContent("footer-container", "../components/footer.html");

  if (!campaignId) {
    titleElement.textContent = "Campaign not found!";
    return; 
  }

  fetch(`http://localhost:3000/campaigns/${campaignId}`)
    .then(response => response.json())
    .then(campaign => {
        console.log("Campaign data:", campaign);
      console.log("Campaign title:", campaign.title);   
      if (!campaign.id) {
        titleElement.textContent = "Campaign not found!";
        return;
      }

      titleElement.innerHTML = campaign.title;
      goalElement.textContent = `Goal: $${campaign.goal}`;
      raisedElement.textContent = `Raised: $${campaign.raised}`;
      deadlineElement.textContent = `Deadline: ${campaign.deadline}`;
      campaignImage.src=`${campaign.image}`;

      const progressBar = document.querySelector(".progress-bar");
    const raised = Number(campaign.raised);
    const goal = Number(campaign.goal);
    const percent = goal === 0 ? 0 : Math.min((raised / goal) * 100, 100);
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", percent.toFixed(1));
    //   if (campaign.rewards && campaign.rewards.length > 0) {
    //     rewardsElement.innerHTML = "<h3>Rewards:</h3>";
    //     campaign.rewards.forEach(reward => {
    //       const rewardItem = document.createElement("div");
    //       rewardItem.className = "reward";
    //       rewardItem.innerHTML = `
    //         <p>Title: ${reward.title}</p>
    //         <p>Amount: $${reward.amount}</p>
    //       `;
    //       rewardsElement.appendChild(rewardItem);
    //     });
    //   } else {
    //     rewardsElement.innerHTML = "<p>No rewards available.</p>";
    //   }
     })
    .catch(error => {
      console.error("Error fetching campaign:", error);
      titleElement.textContent = "Error loading campaign data.";
    });
}
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
function viewCampaign(id){
    window.location.href = `../pages/cartPage.html?id=${id}`;

}
//Initialize 
document.addEventListener('DOMContentLoaded', () => {
  new FAQApp();
  new ContactForm('contactForm', 'successMessage');
});

document.addEventListener("DOMContentLoaded", loadCampaign);
