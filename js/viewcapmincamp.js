const campaignList = document.querySelector(".projects-container");

function InitializeCampaign() {
    fetch('http://localhost:3000/campaigns')
        .then(response => response.json())
        .then(data => {
            campaignList.innerHTML = "";

            const approvedCampaigns = data.filter(campaign => campaign.isApproved);

            if (approvedCampaigns.length === 0) {
                campaignList.innerHTML = "<p>No approved campaigns available.</p>";
            } else {
                approvedCampaigns.forEach(campaign => {
                    const campaignCard = document.createElement("div");
                    campaignCard.className = "project-card";
                    campaignCard.innerHTML = `
            <img src="${campaign.image}" alt="${campaign.title}" class="project-image">
            <div class="project-content">
              <h3 class="project-title">${campaign.title}</h3>
              <div class="project-amounts">
                <div class="raised-amount">
                  <span class="amount">$${campaign.raised}</span>
                  <span class="amount-label">raised of</span>
                </div>
                <div class="target-amount">
                  <span class="amount">$${campaign.goal}</span>
                  <span class="amount-label">Target</span>
                </div>
              </div>
              <p class="category">${campaign.category}</p>
              <button class="donate-more-btn" onclick="viewCampaign('${campaign.id}')">Read More</button>
            </div>
          `;
                    campaignList.appendChild(campaignCard);
                });
            }
        })
        .catch(error => {
            console.error("Error fetching campaigns:", error);
        });
}

InitializeCampaign();
