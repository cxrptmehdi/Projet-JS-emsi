// ================= DARK MODE =================
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

// ================= AUTH =================
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if (!loggedUser) location.href = "index.html";

username.innerText = loggedUser.name;
logoutBtn.onclick = () => {
    localStorage.removeItem("loggedUser");
    location.href = "index.html";
};

// ================= ORDERS =================
if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]));
}

let orders = JSON.parse(localStorage.getItem("orders"));

// ================= RENDER =================
function render() {
    ordersTable.innerHTML = "";
    orders.forEach(o => {
        ordersTable.innerHTML += `
            <tr>
                <td>${o.client}</td>
                <td>${new Date(o.date).toLocaleString()}</td>
                <td>$${o.total}</td>
                <td>${o.status}</td>
                <td class="admin-only">
                    <button onclick="toggleStatus('${o.id}')">
                        ${o.status === 'Pending' ? 'Mark Delivered' : 'Mark Pending'}
                    </button>
                    <button onclick="removeOrder('${o.id}')">Delete</button>
                </td>
            </tr>`;
    });

    if (loggedUser.role !== "admin") {
        document.querySelectorAll(".admin-only").forEach(e => e.style.display = "none");
    }
}

render();

// ================= DELETE ORDER =================
function removeOrder(id) {
    if (!confirm("Delete order?")) return;
    orders = orders.filter(o => String(o.id) !== String(id));
    localStorage.setItem("orders", JSON.stringify(orders));
    render();
}

// ================= TOGGLE STATUS =================
function toggleStatus(id) {
    const order = orders.find(o => String(o.id) === String(id));
    if (!order) return;
    order.status = order.status === "Pending" ? "Delivered" : "Pending";
    localStorage.setItem("orders", JSON.stringify(orders));
    render();
}

// ================= EXPORT CSV =================
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
    exportToCSV("orders.csv", orders);
};
