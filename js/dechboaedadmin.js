document.addEventListener("DOMContentLoaded", () => {

  class UserManager {
    constructor() {
      this.userListEl = document.getElementById("user-list");

      // إضافة event listener على الحاوية
      this.userListEl.addEventListener("click", (e) => {
        if (e.target.classList.contains("approve")) {
          const id = e.target.dataset.id;
          this.approveUser(id);
        } else if (e.target.classList.contains("ban")) {
          const id = e.target.dataset.id;
          this.banUser(id);
        }
      });

      this.fetchUsers();
    }

    fetchUsers() {
      fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(users => {
          this.userListEl.innerHTML = "<h3 class='text-xl font-semibold mb-2'>Users</h3>";
          users.forEach(user => this.renderUser(user));
        })
        .catch(err => console.log("Error fetching users:", err));
    }

    renderUser(user) {
      if (user.role !== "campaigner" && !user.isApproved) {
        user.isApproved = true;
        fetch(`http://localhost:3000/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        }).catch(err => console.log("Error updating user:", err));
      }

      const userDiv = document.createElement("div");
      userDiv.className = "user-card bg-gray-100 p-4 rounded-lg shadow mb-2";
      userDiv.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p><strong>Status:</strong> ${user.isActive ? "Active" : "Banned"}</p>
        <p><strong>Approved:</strong> ${user.isApproved ? "Yes" : "No"}</p>
        ${user.role === "campaigner" && !user.isApproved ? 
          `<button class="approve" data-id="${user.id}">Approve</button>` : ""}
        <button class="ban" data-id="${user.id}">Ban</button>
      `;
      this.userListEl.appendChild(userDiv);
    }

    approveUser(id) {
      fetch(`http://localhost:3000/users/${id}`)
        .then(response => response.json())
        .then(user => {
          user.isApproved = true;
          fetch(`http://localhost:3000/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
          }).then(() => this.fetchUsers());
        })
        .catch(err => console.log("Error approving user:", err));
    }

    banUser(id) {
      fetch(`http://localhost:3000/users/${id}`)
        .then(response => response.json())
        .then(user => {
          user.isActive = false;
          fetch(`http://localhost:3000/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
          }).then(() => this.fetchUsers());
        })
        .catch(err => console.log("Error banning user:", err));
    }
  }

  class CampaignManager {
    constructor() {
      this.campaignListEl = document.getElementById("campaign-list");

      // event delegation لأزرار الـ approve و delete
      this.campaignListEl.addEventListener("click", (e) => {
        if (e.target.classList.contains("approve")) {
          const id = e.target.dataset.id;
          this.approveCampaign(id);
        } else if (e.target.classList.contains("delete")) {
          const id = e.target.dataset.id;
          this.deleteCampaign(id);
        }
      });

      this.fetchCampaigns();
    }

    fetchCampaigns() {
      fetch("http://localhost:3000/campaigns")
        .then(response => response.json())
        .then(campaigns => {
          this.campaignListEl.innerHTML = "<h3>Pending Campaigns</h3>";
          campaigns.forEach(campaign => this.renderCampaign(campaign));
        })
        .catch(err => console.log("Error fetching campaigns:", err));
    }

    renderCampaign(campaign) {
      const campaignDiv = document.createElement("div");
      campaignDiv.className = "campaign-card bg-gray-100 p-4 rounded-lg shadow mb-2";
      campaignDiv.innerHTML = `
        <h4>${campaign.title}</h4>
        <p>Goal: $${campaign.goal}</p>
        <p>Raised: $${campaign.raised}</p>
        <p>Status: ${campaign.isApproved ? "Approved" : "Pending"}</p>
        <button class="approve" data-id="${campaign.id}">Approve</button>
        <button class="delete" data-id="${campaign.id}">Delete</button>
      `;
      this.campaignListEl.appendChild(campaignDiv);
    }

    approveCampaign(id) {
      fetch(`http://localhost:3000/campaigns/${id}`)
        .then(response => response.json())
        .then(campaign => {
          campaign.isApproved = true;
          fetch(`http://localhost:3000/campaigns/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(campaign)
          }).then(() => this.fetchCampaigns());
        })
        .catch(err => console.log("Error approving campaign:", err));
    }

   deleteCampaign(id) {
  console.log("Deleting campaign with id:", id);
  if (confirm("Are you sure you want to delete this campaign?")) {
    fetch(`http://localhost:3000/campaigns/${id}`, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to delete campaign");
      }
      return response.json(); // أو response.text() حسب API
    })
    .then(() => this.fetchCampaigns())
    .catch(err => console.log("Error deleting campaign:", err));
  }
}

  }


  const userManager = new UserManager();
  const campaignManager = new CampaignManager();

});
