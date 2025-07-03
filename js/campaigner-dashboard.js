const form = document.getElementById("campaignForm");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");
const campaignList = document.getElementById("campaignList");
const submitBtn = document.getElementById("submitBtn");

const currentUserId = "admin123"; // Current user
let base64Image = "";

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".campaign-form, .campaigns-section");

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        sections.forEach(section => section.classList.add("hidden"));
        const sectionId = link.dataset.section;
        document.getElementById(sectionId).classList.remove("hidden");

        if (sectionId === "campaigns-list") {
            loadCampaigns();
        }
    });
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            base64Image = reader.result;
            imagePreview.src = base64Image;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const deadline = document.getElementById("deadline").value;
    const goal = parseFloat(document.getElementById("goal").value);
    const rewardTitle = document.getElementById("rewardTitle").value;
    const rewardDescription = document.getElementById("rewardDescription").value;

    if (!base64Image || !title || !description || !deadline || !goal || !rewardTitle || !rewardDescription || !category) {
        Swal.fire("Missing Information", "Please fill all fields and upload an image.", "warning");
        submitBtn.disabled = false;
        return;
    }

    const campaign = {
        title,
        description,
        category,
        image: base64Image,
        deadline,
        goal,
        rewards: [{ title: rewardTitle, description: rewardDescription }],
        raised: 0,
        isApproved: false,
        creatorId: currentUserId
    };

    try {
        const response = await fetch("http://localhost:3000/campaigns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(campaign)
        });

        if (!response.ok) throw new Error("Failed to create campaign");

        form.reset();
        base64Image = "";
        imagePreview.src = "";
        imagePreview.style.display = "none";

        Swal.fire("Success", "Campaign created successfully!", "success");

        if (!document.getElementById("campaigns-list").classList.contains("hidden")) {
            await loadCampaigns();
        }
    } catch (error) {
        Swal.fire("Error", "Failed to create campaign.", "error");
    } finally {
        submitBtn.disabled = false;
    }
});

async function loadCampaigns() {
    try {
        campaignList.innerHTML = '<div class="text-muted text-center">Loading...</div>';
        const res = await fetch("http://localhost:3000/campaigns");
        if (!res.ok) throw new Error("Failed to fetch campaigns");

        const campaigns = await res.json();

        const userCampaigns = campaigns.filter(c => c.creatorId === currentUserId);

        campaignList.innerHTML = userCampaigns.length
            ? ""
            : '<div class="text-muted text-center">No campaigns found.</div>';

        userCampaigns.forEach(c => {
            const card = document.createElement("div");
            card.className = "col-lg-4 col-md-6 mb-4";
            card.innerHTML = `
            <div class="campaign-card">
              <img src="${c.image}" alt="Campaign Image">
              <h4>${c.title}</h4>
              <p>${c.description}</p>
              <p><strong>Goal:</strong> $${c.goal}</p>
              <p><strong>Raised:</strong> $${c.raised || 0}</p>
              <p><strong>Deadline:</strong> ${new Date(c.deadline).toLocaleDateString()}</p>
              <p><strong>Reward:</strong> ${c.rewards?.[0]?.title || "-"}</p>
              <div class="d-flex gap-2">
                <button class="btn btn-warning btn-sm edit-btn" data-id="${c.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${c.id}">Delete</button>
                <button class="btn btn-info btn-sm pledges-btn" data-id="${c.id}">Pledges</button>
                <button class="btn btn-primary btn-sm update-btn" data-id="${c.id}">Update</button>
              </div>
            </div>
          `;
            campaignList.appendChild(card);
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => editCampaign(btn.dataset.id));
        });
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => deleteCampaign(btn.dataset.id, btn));
        });
        document.querySelectorAll(".pledges-btn").forEach(btn => {
            btn.addEventListener("click", () => loadPledges(btn.dataset.id));
        });
        document.querySelectorAll(".update-btn").forEach(btn => {
            btn.addEventListener("click", () => postUpdatePrompt(btn.dataset.id));
        });
    } catch (error) {
        campaignList.innerHTML = '<div class="text-danger text-center">Failed to load campaigns</div>';
    }
}

function editCampaign(id) {
    Swal.fire("Redirecting", `Edit campaign ${id}`, "info");
    window.location.href = `edit-campaign.html?id=${id}`;
}

async function deleteCampaign(id, button) {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    button.disabled = true;
    try {
        const response = await fetch(`http://localhost:3000/campaigns/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Failed to delete campaign");
        await loadCampaigns();
        Swal.fire("Deleted!", "Your campaign has been deleted.", "success");
    } catch (error) {
        Swal.fire("Error", "Failed to delete campaign.", "error");
    } finally {
        button.disabled = false;
    }
}

async function updateCampaign(id, updatedData) {
    try {
        const response = await fetch(`http://localhost:3000/campaigns/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) throw new Error("Failed to update campaign");

        Swal.fire("Updated!", "Campaign updated successfully.", "success");
        await loadCampaigns();
    } catch (error) {
        Swal.fire("Error", "Failed to update campaign.", "error");
    }
}

async function loadPledges(campaignId) {
    try {
        const res = await fetch(`http://localhost:3000/pledges?campaignId=${campaignId}`);
        if (!res.ok) throw new Error("Failed to fetch pledges");
        const pledges = await res.json();
        const pledgeList = pledges.map(p => `💵 $${p.amount} by ${p.userId}`).join("<br>") || "No pledges yet.";

        Swal.fire({
            title: `Pledges for Campaign`,
            html: pledgeList,
            icon: "info",
        });
    } catch (error) {
        Swal.fire("Error", "Failed to load pledges.", "error");
    }
}

async function postUpdatePrompt(campaignId) {
    const { value: content } = await Swal.fire({
        title: "Post an Update",
        input: "textarea",
        inputLabel: "Your update message",
        inputPlaceholder: "Type your update here...",
        showCancelButton: true,
    });

    if (!content) return;

    const update = { campaignId, content, createdAt: new Date() };
    try {
        const response = await fetch("http://localhost:3000/updates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(update)
        });
        if (!response.ok) throw new Error("Failed to post update");
        Swal.fire("Success", "Update posted successfully!", "success");
    } catch (error) {
        Swal.fire("Error", "Failed to post update.", "error");
    }
}

document.querySelector('.nav-link[data-section="campaigns-list"]')?.addEventListener("click", loadCampaigns);
