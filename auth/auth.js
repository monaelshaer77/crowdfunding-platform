
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


class AuthFormHandler {
    constructor() {
        this.apiURL = "http://localhost:3000/users";
        this.initLoginForm();
        this.initRegisterForm();
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePhone(phone) {
        return /^(010|011|012|015)\d{8}$/.test(phone.replace(/\s+/g, ""));
    }

    async registerUser(userData) {
        const res = await fetch(this.apiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        return res.ok;
    }

    async userExists(email) {
        const res = await fetch(`${this.apiURL}?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        return data.length > 0;
    }

    async validateLogin(email, password) {
        const res = await fetch(`${this.apiURL}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        const data = await res.json();
        return data.length > 0 ? data[0] : null;
    }

    addError(input) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }

    addSuccess(input) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    }

    initLoginForm() {
        const loginForm = document.getElementById("loginForm");
        const loginSuccess = document.getElementById("loginSuccess");

        if (!loginForm) return;

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const emailInput = loginForm.querySelector("#email");
            const passwordInput = loginForm.querySelector("#password");

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            let valid = true;

            if (!this.validateEmail(email)) {
                this.addError(emailInput);
                valid = false;
            } else {
                this.addSuccess(emailInput);
            }

            if (password.length < 6) {
                this.addError(passwordInput);
                valid = false;
            } else {
                this.addSuccess(passwordInput);
            }

            if (!valid) return;

            const user = await this.validateLogin(email, password);

            if (user) {
                loginSuccess.style.display = "block";
                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 1500);
            } else {
                alert("Incorrect email or password.");
                this.addError(emailInput);
                this.addError(passwordInput);
            }
        });
    }

    initRegisterForm() {
        const registerForm = document.getElementById("registerForm");
        const successMessage = document.getElementById("successMessage");

        if (!registerForm) return;

        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nameInput = registerForm.name;
            const emailInput = registerForm.email;
            const passwordInput = registerForm.password;
            const phoneInput = registerForm.phone;
            const roleInput = registerForm.querySelector('input[name="role"]:checked');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const phone = phoneInput.value.trim();
            const role = roleInput?.value;

            let valid = true;

            if (name.length < 2) {
                this.addError(nameInput);
                valid = false;
            } else {
                this.addSuccess(nameInput);
            }

            if (!this.validateEmail(email)) {
                this.addError(emailInput);
                valid = false;
            } else {
                this.addSuccess(emailInput);
            }

            if (password.length < 6) {
                this.addError(passwordInput);
                valid = false;
            } else {
                this.addSuccess(passwordInput);
            }

            if (!this.validatePhone(phone)) {
                this.addError(phoneInput);
                valid = false;
            } else {
                this.addSuccess(phoneInput);
            }

            if (!role) {
                alert("Please select a role.");
                valid = false;
            }

            if (!valid) return;

            const exists = await this.userExists(email);
            if (exists) {
                alert("Email already registered.");
                this.addError(emailInput);
                return;
            }

            const success = await this.registerUser({ name, email, password, phone, role });
            if (success) {
                successMessage.style.display = 'block';
                setTimeout(() => successMessage.style.display = "none", 3000);
                registerForm.reset();

                [nameInput, emailInput, passwordInput, phoneInput].forEach(input => {
                    input.classList.remove("is-valid", "is-invalid");
                });
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new AuthFormHandler();
});
