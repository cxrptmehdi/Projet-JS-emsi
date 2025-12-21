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
if (!localStorage.getItem("categories")) {
    localStorage.setItem(
        "categories",
        JSON.stringify([
            { id: 1, name: "Machines", description: "Heavy equipment" },
            { id: 2, name: "Seeds", description: "All seed types" },
            { id: 3, name: "Irrigation", description: "Water systems" }
        ])
    );
}

// =====================
// STATE
// =====================
let categories = JSON.parse(localStorage.getItem("categories"));
let editingId = null;
let currentPage = 1;
const perPage = 5;

// =====================
// DOM ELEMENTS
// =====================
const table = document.getElementById("categoriesTable");
const searchInput = document.getElementById("searchInput");
const form = document.getElementById("categoryForm");

const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// =====================
// RENDER
// =====================
function render(list = categories) {
    table.innerHTML = "";

    const start = (currentPage - 1) * perPage;
    list.slice(start, start + perPage).forEach(c => {
        table.innerHTML += `
            <tr>
                <td>${c.name}</td>
                <td>${c.description}</td>
                <td>
                    <button onclick="editCategory(${c.id})">Edit</button>
                    <button onclick="deleteCategory(${c.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

render();

// =====================
// SEARCH
// =====================
searchInput.oninput = () => {
    currentPage = 1;
    const q = searchInput.value.toLowerCase();
    render(categories.filter(c => c.name.toLowerCase().includes(q)));
};

// =====================
// CREATE / UPDATE
// =====================
form.onsubmit = e => {
    e.preventDefault();

    const category = {
        id: editingId || Date.now(),
        name: nameInput.value.trim(),
        description: descriptionInput.value.trim()
    };

    if (!category.name) {
        alert("Category name is required");
        return;
    }

    if (editingId) {
        categories = categories.map(c =>
            c.id === editingId ? category : c
        );
        editingId = null;
    } else {
        categories.push(category);
    }

    localStorage.setItem("categories", JSON.stringify(categories));
    form.reset();
    render();
};

// =====================
// EDIT
// =====================
function editCategory(id) {
    const c = categories.find(c => c.id === id);
    nameInput.value = c.name;
    descriptionInput.value = c.description;
    editingId = id;
}

// =====================
// DELETE
// =====================
function deleteCategory(id) {
    if (!confirm("Delete category?")) return;

    categories = categories.filter(c => c.id !== id);
    localStorage.setItem("categories", JSON.stringify(categories));
    render();
}

// =====================
// PAGINATION
// =====================
prevBtn.onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        render();
    }
};

nextBtn.onclick = () => {
    if (currentPage * perPage < categories.length) {
        currentPage++;
        render();
    }
};

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

document.getElementById("exportCsvBtn").onclick = () => {
    exportToCSV("categories.csv", categories);
};
