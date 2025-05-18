// function viewCampaign(id) {
//   window.location.href = `viewCampaign.html?id=${id}`;
// }

// document.addEventListener("DOMContentLoaded", () => {
//   const campaignList = document.querySelector(".projects-container");
//   const prevBtn = document.querySelector('.carousel-btn.prev');
//   const nextBtn = document.querySelector('.carousel-btn.next');

//   function localContent(elementId, fileName) {
//     fetch(fileName)
//       .then(response => response.text())
//       .then(data => {
//         document.getElementById(elementId).innerHTML = data;
//       })
//       .catch(err => console.log('Error loading content'));
//   }

//   localContent("header-container", '../components/header.html');
//   localContent("footer-conteriner", "../components/footer.html");

//   function InitializeCampaign() {
//     fetch('http://localhost:3000/campaigns')
//       .then(response => response.json())
//       .then(data => {
//         campaignList.innerHTML = "";

//         if (!data || data.length === 0) {
//           campaignList.innerHTML = "<p>No campaigns available.</p>";
//           return;
//         }

//         data.forEach(campaign => {
//           const {
//             id,
//             title = "Untitled Campaign",
//             image = "default.jpg",
//             goal = 0,
//             raised = 0
//           } = campaign;

//           const campaignCard = document.createElement("div");
//           campaignCard.className = "project-card";
//           campaignCard.innerHTML = `
//             <img src="${image}" alt="${title}" class="project-image">
//             <div class="project-content">
//               <h3 class="project-title">${title}</h3>
//               <div class="project-amounts">
//                 <div class="raised-amount">
//                   <span class="amount">$${raised}</span>
//                   <span class="amount-label">raised of</span>
//                 </div>
//                 <div class="target-amount">
//                   <span class="amount">$${goal}</span>
//                   <span class="amount-label">Target</span>
//                 </div>
//               </div>
//               <button class="donate-more-btn" onclick="viewCampaign(${id})">Read More & Donate</button>
//             </div>
//           `;

//           campaignList.appendChild(campaignCard);
//         });
//       })
//       .catch(error => {
//         console.error("Error fetching campaigns:", error);
//         campaignList.innerHTML = "<p>Something went wrong while loading campaigns.</p>";
//       });
//   }

//   InitializeCampaign();
// });
