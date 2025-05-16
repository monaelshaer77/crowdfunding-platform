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

    clearError(input) {
        input.classList.remove("input-error");
    }

    showError(input) {
        input.classList.add("input-error");
        input.focus();
    }

    initLoginForm() {
        const loginForm = document.getElementById("loginForm");
        const loginSuccess = document.getElementById("loginSuccess");

        if (!loginForm) return;

        const emailInput = loginForm.querySelector("#email");
        const passwordInput = loginForm.querySelector("#password");

        [emailInput, passwordInput].forEach(input => {
            input.addEventListener("input", () => this.clearError(input));
        });

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            let isValid = true;

            if (!this.validateEmail(email)) {
                this.showError(emailInput);
                isValid = false;
            }

            if (password.length < 6) {
                this.showError(passwordInput);
                isValid = false;
            }

            if (!isValid) return;

            const user = await this.validateLogin(email, password);

            if (user) {
                loginSuccess.style.display = "block";
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } else {
                alert("Incorrect email or password.");
                this.showError(emailInput);
                this.showError(passwordInput);
            }
        });
    }

    initRegisterForm() {
        const registerForm = document.getElementById("registerForm");
        const successMessage = document.getElementById("successMessage");

        if (!registerForm) return;

        const nameInput = registerForm.name;
        const emailInput = registerForm.email;
        const passwordInput = registerForm.password;
        const phoneInput = registerForm.phone;

        // إزالة الخط الأحمر عند التعديل
        [nameInput, emailInput, passwordInput, phoneInput].forEach(input => {
            input.addEventListener("input", () => this.clearError(input));
        });

        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const roleInput = registerForm.querySelector('input[name="role"]:checked');
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const phone = phoneInput.value.trim();
            const role = roleInput?.value;

            let isValid = true;

            if (name.length < 2) {
                this.showError(nameInput);
                isValid = false;
            }

            if (!this.validateEmail(email)) {
                this.showError(emailInput);
                isValid = false;
            }

            if (password.length < 6) {
                this.showError(passwordInput);
                isValid = false;
            }

            if (!this.validatePhone(phone)) {
                this.showError(phoneInput);
                isValid = false;
            }

            if (!role) {
                const roleField = registerForm.querySelector('input[name="role"]');
                this.showError(roleField);
                isValid = false;
            }

            if (!isValid) return;

            const exists = await this.userExists(email);
            if (exists) {
                alert("Email already registered.");
                this.showError(emailInput);
                return;
            }

            const success = await this.registerUser({ name, email, password, phone, role });
            if (success) {
                successMessage.style.display = 'block';
                setTimeout(() => successMessage.style.display = "none", 3000);
                registerForm.reset();

                [nameInput, emailInput, passwordInput, phoneInput].forEach(input => this.clearError(input));
            } else {
                alert("Registration failed. Please try again.");
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new AuthFormHandler();
});
