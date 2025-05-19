document.addEventListener("DOMContentLoaded", () => {
  // دالة مساعدة لتحديث المستخدم
  async function updateUser(id, updates, successMessage, errorMessage) {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error(errorMessage);
      return true;
    } catch (err) {
      console.error(`${errorMessage}:`, err);
      alert(`${errorMessage}: ${err.message}`);
      return false;
    }
  }

  class UserManager {
    constructor() {
      this.userListEl = document.getElementById("user-list");
      this.userListEl.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("approve")) {
          this.approveUser(id);
        } else if (e.target.classList.contains("reject")) {
          this.rejectUser(id);
        } else if (e.target.classList.contains("ban")) {
          this.banUser(id);
        } else if (e.target.classList.contains("unban")) {
          this.unbanUser(id);
        }
      });
      this.fetchUsers();
    }

    async fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const users = await response.json();
        this.renderUsers(users);
      } catch (err) {
        console.error("Error fetching users:", err);
        this.userListEl.innerHTML = `<p class="text-red-500">Failed to load users: ${err.message}</p>`;
      }
    }

    renderUsers(users) {
      this.userListEl.innerHTML = "<h3 class='text-xl font-semibold mb-2'>Users</h3>";
      if (users.length === 0) {
        this.userListEl.innerHTML += `<p class="text-gray-500">No users found.</p>`;
        return;
      }
      users.forEach(user => this.renderUser(user));
    }

    renderUser(user) {
      const userDiv = document.createElement("div");
      userDiv.className = "user-card bg-gray-100 p-4 rounded-lg shadow mb-2";
      userDiv.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p><strong>Status:</strong> ${user.isActive ? "Active" : "Banned"}</p>
        <p><strong>Approved:</strong> ${user.isApproved ? "Yes" : "No"}</p>
        ${user.role === "campaigner" && !user.isApproved ? 
          `<button class="approve bg-green-500 text-white px-2 py-1 rounded mr-2" data-id="${user.id}">Approve</button>
           <button class="reject bg-red-500 text-white px-2 py-1 rounded mr-2" data-id="${user.id}">Reject</button>` : ""}
        ${user.isActive ? 
          `<button class="ban bg-gray-500 text-white px-2 py-1 rounded" data-id="${user.id}">Ban</button>` : 
          `<button class="unban bg-blue-500 text-white px-2 py-1 rounded" data-id="${user.id}">Unban</button>`}
      `;
      this.userListEl.appendChild(userDiv);
    }

    async approveUser(id) {
      if (await updateUser(id, { isApproved: true }, "User approved successfully", "Failed to approve user")) {
        this.fetchUsers();
      }
    }

    async rejectUser(id) {
      if (await updateUser(id, { isApproved: false }, "User rejected successfully", "Failed to reject user")) {
        this.fetchUsers();
      }
    }

    async banUser(id) {
      if (await updateUser(id, { isActive: false }, "User banned successfully", "Failed to ban user")) {
        this.fetchUsers();
      }
    }

    async unbanUser(id) {
      if (await updateUser(id, { isActive: true }, "User unbanned successfully", "Failed to unban user")) {
        this.fetchUsers();
      }
    }
  }

  class CampaignManager {
    constructor() {
      this.campaignListEl = document.getElementById("campaign-list");
      this.campaignListEl.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("approve")) {
          this.approveCampaign(id);
        } else if (e.target.classList.contains("reject")) {
          this.rejectCampaign(id);
        } else if (e.target.classList.contains("delete")) {
          this.deleteCampaign(id);
        }
      });
      this.fetchCampaigns();
    }

    async fetchCampaigns() {
      try {
        const response = await fetch("http://localhost:3000/campaigns");
        if (!response.ok) throw new Error("Failed to fetch campaigns");
        const campaigns = await response.json();
        this.renderCampaigns(campaigns);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        this.campaignListEl.innerHTML = `<p class="text-red-500">Failed to load campaigns: ${err.message}</p>`;
      }
    }

    renderCampaigns(campaigns) {
      this.campaignListEl.innerHTML = "<h3 class='text-xl font-semibold mb-2'>Campaigns</h3>";
      if (campaigns.length === 0) {
        this.campaignListEl.innerHTML += `<p class="text-gray-500">No campaigns found.</p>`;
        return;
      }
      campaigns.forEach(campaign => this.renderCampaign(campaign));
    }

    async renderCampaign(campaign) {
      try {
        const response = await fetch(`http://localhost:3000/pledges?campaignId=${campaign.id}`);
        if (!response.ok) throw new Error("Failed to fetch pledges");
        const pledges = await response.json();
        const raised = pledges.reduce((sum, pledge) => sum + pledge.amount, 0);

        const campaignDiv = document.createElement("div");
        campaignDiv.className = "campaign-card bg-gray-100 p-4 rounded-lg shadow mb-2";
        campaignDiv.innerHTML = `
          <h4 class="text-lg font-semibold">${campaign.title}</h4>
          <p><strong>Goal:</strong> $${campaign.goal}</p>
          <p><strong>Raised:</strong> $${raised}</p>
          <p><strong>Status:</strong> ${campaign.isApproved ? "Approved" : "Pending"}</p>
          ${!campaign.isApproved ? 
            `<button class="approve bg-green-500 text-white px-2 py-1 rounded mr-2" data-id="${campaign.id}">Approve</button>
             <button class="reject bg-red-500 text-white px-2 py-1 rounded mr-2" data-id="${campaign.id}">Reject</button>` : ""}
          <button class="delete bg-gray-500 text-white px-2 py-1 rounded" data-id="${campaign.id}">Delete</button>
        `;
        this.campaignListEl.appendChild(campaignDiv);
      } catch (err) {
        console.error(`Error rendering campaign ${campaign.id}:`, err);
      }
    }

    async approveCampaign(id) {
      if (await updateCampaign(id, { isApproved: true }, "Campaign approved successfully", "Failed to approve campaign")) {
        this.fetchCampaigns();
      }
    }

    async rejectCampaign(id) {
      if (await updateCampaign(id, { isApproved: false }, "Campaign rejected successfully", "Failed to reject campaign")) {
        this.fetchCampaigns();
      }
    }

    async deleteCampaign(id) {
      if (!confirm("Are you sure you want to delete this campaign?")) return;
      try {
        const response = await fetch(`http://localhost:3000/campaigns/${id}`, {
          method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete campaign");
        this.fetchCampaigns();
      } catch (err) {
        console.error("Error deleting campaign:", err);
        alert(`Failed to delete campaign: ${err.message}`);
      }
    }
  }

  class PledgeManager {
    constructor() {
      this.pledgeListEl = document.getElementById("pledge-list");
      this.fetchPledges();
    }

    async fetchPledges() {
      try {
        const response = await fetch("http://localhost:3000/pledges");
        if (!response.ok) throw new Error("Failed to fetch pledges");
        const pledges = await response.json();
        this.renderPledges(pledges);
      } catch (err) {
        console.error("Error fetching pledges:", err);
        this.pledgeListEl.innerHTML = `<p class="text-red-500">Failed to load pledges: ${err.message}</p>`;
      }
    }

    renderPledges(pledges) {
      this.pledgeListEl.innerHTML = "<h3 class='text-xl font-semibold mb-2'>Pledges</h3>";
      if (pledges.length === 0) {
        this.pledgeListEl.innerHTML += `<p class="text-gray-500">No pledges found.</p>`;
        return;
      }
      pledges.forEach(pledge => this.renderPledge(pledge));
    }

    renderPledge(pledge) {
      const pledgeDiv = document.createElement("div");
      pledgeDiv.className = "pledge-card bg-gray-100 p-4 rounded-lg shadow mb-2";
      pledgeDiv.innerHTML = `
        <p><strong>Campaign ID:</strong> ${pledge.campaignId}</p>
        <p><strong>User ID:</strong> ${pledge.userId}</p>
        <p><strong>Amount:</strong> $${pledge.amount}</p>
        <p><strong>Reward ID:</strong> ${pledge.rewardId || "None"}</p>
      `;
      this.pledgeListEl.appendChild(pledgeDiv);
    }
  }

  // تهيئة الكائنات
  const userManager = new UserManager();
  const campaignManager = new CampaignManager();
  const pledgeManager = new PledgeManager();
});