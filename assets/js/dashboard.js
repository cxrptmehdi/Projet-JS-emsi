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

if (loggedUser.role !== "admin") {
    document.querySelectorAll(".admin-only").forEach(e => e.style.display = "none");
}

// ================= DATA =================
const products = JSON.parse(localStorage.getItem("products")) || [];
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const clients = JSON.parse(localStorage.getItem("clients")) || [];

// ================= SUMMARY CARDS =================
productsCount.innerHTML = `<h3>Products</h3><p>${products.length}</p>`;
ordersCount.innerHTML = `<h3>Orders</h3><p>${orders.length}</p>`;
clientsCount.innerHTML = `<h3>Clients</h3><p>${clients.length}</p>`;

const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
revenue.innerHTML = `<h3>Revenue</h3><p>$${totalRevenue}</p>`;

// ================= COMMON =================
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ================= ORDERS PER MONTH (BAR) =================
const ordersByMonth = new Array(12).fill(0);

orders.forEach(o => {
    const m = new Date(o.date || Date.now()).getMonth();
    ordersByMonth[m]++;
});

new Chart(document.getElementById("ordersChart"), {
    type: "bar",
    data: {
        labels: months,
        datasets: [{
            label: "Orders per Month",
            data: ordersByMonth
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        }
    }
});

// ================= PRODUCTS BY CATEGORY (PIE) =================
const categoryStats = {};
products.forEach(p => {
    categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
});

new Chart(document.getElementById("productsChart"), {
    type: "pie",
    data: {
        labels: Object.keys(categoryStats),
        datasets: [{
            data: Object.values(categoryStats)
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

// ================= REVENUE TREND (LINE) =================
const revenueByMonth = new Array(12).fill(0);

orders.forEach(o => {
    const m = new Date(o.date || Date.now()).getMonth();
    revenueByMonth[m] += o.total || 0;
});

new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: {
        labels: months,
        datasets: [{
            label: "Revenue Trend",
            data: revenueByMonth,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});
