const form = document.getElementById("editCampaignForm");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");
const saveBtn = document.getElementById("saveBtn");

let base64Image = "";

// Load Campaign Data
async function loadCampaign() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) {
        alert("Campaign ID not found.");
        window.location.href = "campaigner-dashboard.html";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/campaigns/${id}`);
        if (!res.ok) throw new Error("Failed to fetch campaign");
        const campaign = await res.json();

        document.getElementById("campaignId").value = id;
        document.getElementById("title").value = campaign.title || "";
        document.getElementById("description").value = campaign.description || "";
        document.getElementById("deadline").value = campaign.deadline ? campaign.deadline.split('T')[0] : "";
        document.getElementById("goal").value = campaign.goal || "";
        document.getElementById("rewardTitle").value = campaign.rewards[0]?.title || "";
        document.getElementById("rewardDescription").value = campaign.rewards[0]?.description || "";
        imagePreview.src = campaign.image || "";
        imagePreview.style.display = campaign.image ? "block" : "none";
        base64Image = campaign.image || "";
    } catch (error) {
        alert("Error loading campaign");
        window.location.href = "campaigner-dashboard.html";
    }
}

// Image Preview
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
    saveBtn.disabled = true;

    const id = document.getElementById("campaignId").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const deadline = document.getElementById("deadline").value;
    const goal = parseFloat(document.getElementById("goal").value);
    const rewardTitle = document.getElementById("rewardTitle").value;
    const rewardDescription = document.getElementById("rewardDescription").value;

    if (!base64Image || !title || !description || !deadline || !goal || !rewardTitle || !rewardDescription) {
        alert("Please fill all fields.");
        saveBtn.disabled = false;
        return;
    }

    const campaignUpdate = {
        title,
        description,
        image: base64Image,
        deadline,
        goal,
        rewards: [{ title: rewardTitle, description: rewardDescription }]
    };

    try {
        const response = await fetch(`http://localhost:3000/campaigns/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(campaignUpdate)
        });

        if (!response.ok) throw new Error("Failed to update campaign");
        alert("Campaign updated successfully!");
        window.location.href = "campaigner-dashboard.html#campaigns-list";
    } catch (error) {
        alert("Error updating campaign");
    } finally {
        saveBtn.disabled = false;
    }
});

// Load campaign data on page load
loadCampaign();