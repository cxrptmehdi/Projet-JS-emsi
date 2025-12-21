//DARK MODE
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



const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if (!loggedUser || loggedUser.role !== "admin") {
    window.location.href = "dashboard.html";
}

username.innerText = loggedUser.name;
if (logoutBtn) {
    logoutBtn.onclick = () => {
        const lang = localStorage.getItem("lang") || "en";
        const message = translations[lang].logout_confirm;

        if (!confirm(message)) return;

        localStorage.removeItem("loggedUser");
        location.href = "index.html";
    };
}

if (!localStorage.getItem("suppliers")) {
    localStorage.setItem("suppliers", JSON.stringify([]));
}

let suppliers = JSON.parse(localStorage.getItem("suppliers"));
let editingId = null;

function render() {
    suppliersTable.innerHTML = "";
    suppliers.forEach(s => {
        suppliersTable.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.phone}</td>
                <td>
                    <button onclick="edit(${s.id})">Edit</button>
                    <button onclick="removeSupplier(${s.id})">Delete</button>
                </td>
            </tr>`;
    });
}

render();

supplierForm.onsubmit = e => {
    e.preventDefault();
    const supplier = {
        id: editingId || Date.now(),
        name: name.value,
        email: email.value,
        phone: phone.value
    };

    editingId
        ? suppliers = suppliers.map(s => s.id === editingId ? supplier : s)
        : suppliers.push(supplier);

    editingId = null;
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
    e.target.reset();
    render();
};

function edit(id) {
    const s = suppliers.find(s => s.id === id);
    name.value = s.name;
    email.value = s.email;
    phone.value = s.phone;
    editingId = id;
}

function removeSupplier(id) {
    if (!confirm("Delete supplier?")) return;
    suppliers = suppliers.filter(s => s.id !== id);
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
    render();
}
