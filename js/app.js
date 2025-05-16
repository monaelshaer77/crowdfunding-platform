
document.addEventListener("DOMContentLoaded", () => {
  const campaignList = document.querySelector(".projects-container");
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
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
  function InitializeCampaign() {
    fetch('http://localhost:3000/campaigns')
      .then(response => response.json())
      .then(data => {
        campaignList.innerHTML = ""; 

        if (data.length === 0) {
          campaignList.innerHTML = "<p>No campaigns available.</p>";
        } else {
          data.forEach(campaign => {
    
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
                <button class="donate-more-btn" onclick="viewCampaign(${campaign.id})">Read More & Donate</button>
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

  function viewCampaign(id) {
    window.location.href = `campaign.html?id=${id}`;
  }
  

  InitializeCampaign();
});
