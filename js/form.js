
 document.getElementById('image').addEventListener('change', function(event) {
     const file = event.target.files[0];
     if (file) {
         const reader = new FileReader();
         reader.onload = function(e) {
             const preview = document.getElementById('imagePreview');
             preview.src = e.target.result;
             preview.style.display = 'block';
         };
         reader.readAsDataURL(file);
     }
 });
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

    document.getElementById('campaignForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const campaign = {
            title: document.getElementById('description').value,
            category :document.getElementById('category').value,
            deadline: document.getElementById('deadline').value,
            raised:0,
            goal: parseFloat(document.getElementById('target').value),
            rewardTitle: document.getElementById('rewardTitle').value,
            rewardDescription: document.getElementById('rewardDescription').value,
            image: document.getElementById('imagePreview').src
        };

        fetch("http://localhost:3000/campaigns", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(campaign)
        })
        .then(response => response.json())
        .then(data => {
            alert("Campaign created successfully!");
            document.getElementById('campaignForm').reset();
            document.getElementById('imagePreview').style.display = 'none';
            console.log("Saved:", data);
        })
        .catch(error => {
            alert("Failed to create campaign.");
            console.error(error);
        });
    });

