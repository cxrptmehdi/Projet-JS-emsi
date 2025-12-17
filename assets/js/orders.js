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
if (!loggedUser) location.href = "index.html";

username.innerText = loggedUser.name;
logoutBtn.onclick = () => {
    localStorage.removeItem("loggedUser");
    location.href = "index.html";
};

if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([
        { id: 1, client: "Ahmed", date: "2025-01-10", total: 500, status: "Pending" },
        { id: 2, client: "Sara", date: "2025-01-12", total: 1200, status: "Delivered" }
    ]));
}

let orders = JSON.parse(localStorage.getItem("orders"));

function render() {
    ordersTable.innerHTML = "";
    orders.forEach(o => {
        ordersTable.innerHTML += `
            <tr>
                <td>${o.client}</td>
                <td>${o.date}</td>
                <td>$${o.total}</td>
                <td>${o.status}</td>
                <td class="admin-only">
                    <button onclick="removeOrder(${o.id})">Delete</button>
                </td>
            </tr>`;
    });

    if (loggedUser.role !== "admin") {
        document.querySelectorAll(".admin-only").forEach(e => e.style.display = "none");
    }
}

render();

function removeOrder(id) {
    if (!confirm("Delete order?")) return;
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem("orders", JSON.stringify(orders));
    render();
}


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
    exportToCSV("products.csv", orders);
};
