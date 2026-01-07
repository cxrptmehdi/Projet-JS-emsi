// ===== DARK MODE ======
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
};



// ===== DEFAULT USERS =====
const defaultUsers = [
    {
        name: "Admin",
        email: "admin@app.com",
        password: "admin123",
        role: "admin"
    },
    {
        name: "User",
        email: "user@app.com",
        password: "user123",
        role: "user"
    }
];

// Initial users
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// ===== LOGIN =====
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const users = JSON.parse(localStorage.getItem("users"));

        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (!user) {
            alert("Invalid email or password");
            return;
        }

        localStorage.setItem("loggedUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
    });
}

// ===== REGISTER =====
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (password.length < 4) {
            alert("Password must be at least 4 characters");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users"));

        const exists = users.some(u => u.email === email);
        if (exists) {
            alert("Email already exists");
            return;
        }

        const newUser = {
            name,
            email,
            password,
            role: "user"
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Account created successfully");
        window.location.href = "index.html";
    });
}
