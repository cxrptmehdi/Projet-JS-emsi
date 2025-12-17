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

//cart helper


const cartKey = `cart_${loggedUser.email}`;

function getCart() {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        cartCount.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    }
}

updateCartCount();

function addToCart(productId) {
    let cart = getCart();
    const product = products.find(p => p.id === productId);

    const existing = cart.find(i => i.id === productId);

    if (existing) {
        if (existing.qty < product.stock) {
            existing.qty++;
        } else {
            alert("Not enough stock");
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1
        });
    }

    saveCart(cart);
    updateCartCount();
}



//other products js code

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if (!loggedUser) window.location.href = "index.html";

document.getElementById("username").innerText = loggedUser.name;
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
};

if (loggedUser.role !== "admin") {
    document.getElementById("adminSection").style.display = "none";
    document.querySelectorAll(".admin-only").forEach(e => e.style.display = "none");
}

if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify([
        { id: 1, name: "Tractor", category: "Machines", price: 12000, stock: 3 },
        { id: 2, name: "Water Pump", category: "Irrigation", price: 300, stock: 15 },
        { id: 3, name: "Seeds Pack", category: "Seeds", price: 20, stock: 100 }
    ]));
}

let products = JSON.parse(localStorage.getItem("products"));
let editingId = null;
let currentPage = 1;
const perPage = 5;

const table = document.getElementById("productsTable");
const searchInput = document.getElementById("searchInput");

function render(list = products) {
    table.innerHTML = "";
    const start = (currentPage - 1) * perPage;
    const pageItems = list.slice(start, start + perPage);

    pageItems.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.price}</td>
                <td>${p.stock}</td>
                <td>
                    ${loggedUser.role === "admin"
                        ? `<button onclick="editProduct(${p.id})">Edit</button>
                           <button onclick="deleteProduct(${p.id})">Delete</button>`
                        : `<button onclick="addToCart(${p.id})">Add to cart</button>`
                    }
                </td>
            </tr>
        `;
    });
}

render();

searchInput.oninput = () => {
    currentPage = 1;
    const q = searchInput.value.toLowerCase();
    render(products.filter(p => p.name.toLowerCase().includes(q)));
};

document.getElementById("productForm").onsubmit = e => {
    e.preventDefault();

    const product = {
        id: editingId || Date.now(),
        name: name.value,
        category: category.value,
        price: +price.value,
        stock: +stock.value
    };

    if (editingId) {
        products = products.map(p => p.id === editingId ? product : p);
        editingId = null;
    } else {
        products.push(product);
    }

    localStorage.setItem("products", JSON.stringify(products));
    e.target.reset();
    render();
};

function editProduct(id) {
    const p = products.find(p => p.id === id);
    name.value = p.name;
    category.value = p.category;
    price.value = p.price;
    stock.value = p.stock;
    editingId = id;
}

function deleteProduct(id) {
    if (!confirm("Delete product?")) return;
    products = products.filter(p => p.id !== id);
    localStorage.setItem("products", JSON.stringify(products));
    render();
}

prevBtn.onclick = () => {
    if (currentPage > 1) currentPage--;
    render();
};

nextBtn.onclick = () => {
    if (currentPage * perPage < products.length) currentPage++;
    render();
};



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
    exportToCSV("products.csv", products);
};
