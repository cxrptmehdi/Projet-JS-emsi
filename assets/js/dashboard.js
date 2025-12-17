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

if (loggedUser.role !== "admin") {
    document.querySelectorAll(".admin-only").forEach(e => e.style.display = "none");
}

const products = JSON.parse(localStorage.getItem("products")) || [];
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const clients = JSON.parse(localStorage.getItem("clients")) || [];

productsCount.innerText = `Products\n${products.length}`;
ordersCount.innerText = `Orders\n${orders.length}`;
clientsCount.innerText = `Clients\n${clients.length}`;

const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
revenue.innerText = `Revenue\n$${totalRevenue}`;

new Chart(document.getElementById("ordersChart"), {
    type: "bar",
    data: {
        labels: orders.map(o => o.date),
        datasets: [{
            label: "Orders Total",
            data: orders.map(o => o.total)
        }]
    }
});
