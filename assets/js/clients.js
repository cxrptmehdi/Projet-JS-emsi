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
// DEMO DATA
// =====================
if (!localStorage.getItem("clients")) {
    localStorage.setItem("clients", JSON.stringify([]));
}

// =====================
// STATE
// =====================
let clients = JSON.parse(localStorage.getItem("clients"));

// =====================
// DOM ELEMENTS
// =====================
const table = document.getElementById("clientsTable");
const clientForm = document.getElementById("clientForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const exportBtn = document.getElementById("exportCsvBtn");

// =====================
// RENDER
// =====================
function renderClients() {
    table.innerHTML = "";

    clients.forEach(c => {
        table.innerHTML += `
            <tr>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>
                    <button onclick="deleteClient(${c.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

renderClients();

// =====================
// CREATE
// =====================
clientForm.onsubmit = e => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !email || !phone) {
        alert("All fields are required");
        return;
    }

    if (clients.some(c => c.email === email)) {
        alert("Client with this email already exists");
        return;
    }

    clients.push({
        id: Date.now(),
        name,
        email,
        phone
    });

    localStorage.setItem("clients", JSON.stringify(clients));
    clientForm.reset();
    renderClients();
};

// =====================
// DELETE
// =====================
function deleteClient(id) {
    if (!confirm("Delete this client?")) return;

    clients = clients.filter(c => c.id !== id);
    localStorage.setItem("clients", JSON.stringify(clients));
    renderClients();
}

// =====================
// EXPORT CSV
// =====================
function exportToCSV(filename, rows) {
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const csv = [
        headers.join(","),
        ...rows.map(row =>
            headers.map(h => `"${row[h]}"`).join(",")
        )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

exportBtn.onclick = () => {
    exportToCSV("clients.csv", clients);
};
