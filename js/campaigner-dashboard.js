const form = document.getElementById("campaignForm");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");
const campaignList = document.getElementById("campaignList");
const submitBtn = document.getElementById("submitBtn");

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
    const deadline = document.getElementById("deadline").value;
    const goal = parseFloat(document.getElementById("goal").value);
    const rewardTitle = document.getElementById("rewardTitle").value;
    const rewardDescription = document.getElementById("rewardDescription").value;

    if (!base64Image || !title || !description || !deadline || !goal || !rewardTitle || !rewardDescription) {
        alert("Please fill all fields and upload an image.");
        submitBtn.disabled = false;
        return;
    }

    const campaign = {
        title,
        description,
        image: base64Image,
        deadline,
        goal,
        rewards: [{ title: rewardTitle, description: rewardDescription }],
        raised: 0,
        isApproved: false
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
        alert("Campaign created!");
        if (!document.getElementById("campaigns-list").classList.contains("hidden")) {
            await loadCampaigns();
        }
    } catch (error) {
        alert("Error creating campaign");
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

        campaignList.innerHTML = campaigns.length ? "" : '<div class="text-muted text-center">No campaigns found.</div>';

        campaigns.forEach(c => {
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
    } catch (error) {
        campaignList.innerHTML = '<div class="text-danger text-center">Failed to load campaigns</div>';
    }
}

function editCampaign(id) {
    window.location.href = `edit-campaign.html?id=${id}`;
}

async function deleteCampaign(id, button) {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    button.disabled = true;
    try {
        const response = await fetch(`http://localhost:3000/campaigns/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Failed to delete campaign");
        await loadCampaigns();
        alert("Campaign deleted!");
    } catch (error) {
        alert("Error deleting campaign");
    } finally {
        button.disabled = false;
    }
}

document.querySelector('.nav-link[data-section="campaigns-list"]').addEventListener("click", () => {
    loadCampaigns();
});