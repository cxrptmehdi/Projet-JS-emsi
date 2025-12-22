// =====================
// DARK MODE
// =====================
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

// =====================
// AUTH / ROLE CHECK
// =====================
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if (!loggedUser || loggedUser.role !== "admin") {
    window.location.href = "dashboard.html";
}

document.getElementById("username").innerText = loggedUser.name;
if (logoutBtn) {
    logoutBtn.onclick = () => {
        const lang = localStorage.getItem("lang") || "en";
        const message = translations[lang].logout_confirm;

        if (!confirm(message)) return;

        localStorage.removeItem("loggedUser");
        location.href = "index.html";
    };
}

// =====================
// INIT STORAGE
// =====================
if (!localStorage.getItem("suppliers")) {
    localStorage.setItem("suppliers", JSON.stringify([]));
}

// =====================
// STATE
// =====================
let suppliers = JSON.parse(localStorage.getItem("suppliers"));
let editingId = null;

// =====================
// DOM ELEMENTS
// =====================
const table = document.getElementById("suppliersTable");
const supplierForm = document.getElementById("supplierForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

// =====================
// RENDER
// =====================
function renderSuppliers() {
    table.innerHTML = "";

    suppliers.forEach(s => {
        table.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.phone}</td>
                <td>
                    <button onclick="editSupplier(${s.id})">Edit</button>
                    <button onclick="deleteSupplier(${s.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

renderSuppliers();

// =====================
// CREATE / UPDATE
// =====================
supplierForm.onsubmit = e => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !email || !phone) {
        alert("All fields are required");
        return;
    }

    if (editingId) {
        suppliers = suppliers.map(s =>
            s.id === editingId
                ? { id: editingId, name, email, phone }
                : s
        );
        editingId = null;
    } else {
        suppliers.push({
            id: Date.now(),
            name,
            email,
            phone
        });
    }

    localStorage.setItem("suppliers", JSON.stringify(suppliers));
    supplierForm.reset();
    renderSuppliers();
};

// =====================
// EDIT
// =====================
function editSupplier(id) {
    const s = suppliers.find(s => s.id === id);
    if (!s) return;

    nameInput.value = s.name;
    emailInput.value = s.email;
    phoneInput.value = s.phone;
    editingId = id;
}

// =====================
// DELETE
// =====================
function deleteSupplier(id) {
    if (!confirm("Delete this supplier?")) return;

    suppliers = suppliers.filter(s => s.id !== id);
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
    renderSuppliers();
}
