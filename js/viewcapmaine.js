
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

document.addEventListener("DOMContentLoaded", loadCampaign);
