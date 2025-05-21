function localContent(elementId, fileName) {
            fetch(fileName)
                .then(response => response.text())
                .then(data => {
                    document.getElementById(elementId).innerHTML = data;
                })
                .catch(err => console.log('Error loading content'));
        }

        localContent("header-container", '../components/header.html');
        localContent("footer-container", "../components/footer.html");
        document.getElementById('categorySearch').addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.industry-card');

            cards.forEach(card => {
                const title = card.querySelector('.industry-title').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });