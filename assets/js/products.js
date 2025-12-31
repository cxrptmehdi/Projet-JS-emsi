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
if (!loggedUser) window.location.href = "index.html";

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

if (loggedUser.role !== "admin") {
    document.getElementById("adminSection").style.display = "none";
    document.querySelectorAll(".admin-only").forEach(e => e.style.display = "none");
}

// ================= INPUT REFERENCES (IMPORTANT FIX) =================
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");

// ================= LOAD CATEGORIES =================
function loadCategories() {
    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    categoryInput.innerHTML = `<option value="">-- Select Category --</option>`;

    categories.forEach(c => {
        const option = document.createElement("option");
        option.value = c.name;      // store name in product
        option.textContent = c.name;
        categoryInput.appendChild(option);
    });
}

loadCategories();



// ================= CART =================
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
        cartCount.innerText = cart.reduce((s, i) => s + i.qty, 0);
    }
}

updateCartCount();

function addToCart(productId) {
    let cart = getCart();
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;

    const existing = cart.find(i => String(i.id) === String(productId));

    if (existing) {
        if (existing.qty < product.stock) existing.qty++;
        else return alert("Not enough stock");
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    }

    saveCart(cart);
    updateCartCount();
}

// ================= PRODUCTS DATA =================
if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify([
        { id: "p1", name: "Tractor", category: "Machines", price: 12000, stock: 3 },
        { id: "p2", name: "Water Pump", category: "Irrigation", price: 300, stock: 15 },
        { id: "p3", name: "Seeds Pack", category: "Seeds", price: 20, stock: 100 }
    ]));
}

let products = JSON.parse(localStorage.getItem("products")) || [];
let editingId = null;
let currentPage = 1;
const perPage = 5;

const table = document.getElementById("productsTable");
const searchInput = document.getElementById("searchInput");

// ================= RENDER =================
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
                        ? `<button data-i18n="edit" onclick="editProduct('${p.id}')">Edit</button>
                           <button data-i18n="delete" onclick="deleteProduct('${p.id}')">Delete</button>`
                        : `<button onclick="addToCart('${p.id}')">Add to cart</button>`
                    }
                </td>
            </tr>
        `;
    });
}

render();

// ================= SEARCH =================
searchInput.oninput = () => {
    currentPage = 1;
    render(products.filter(p =>
        p.name.toLowerCase().includes(searchInput.value.toLowerCase())
    ));
};

// ================= FORM =================
document.getElementById("productForm").onsubmit = e => {
    e.preventDefault();

    const product = {
        id: editingId || `p_${Date.now()}`,
        name: nameInput.value.trim(),
        category: categoryInput.value.trim(),
        price: +priceInput.value,
        stock: +stockInput.value
    };

    if (!product.name) return alert("Product name is required");

    if (editingId) {
        products = products.map(p =>
            String(p.id) === String(editingId) ? product : p
        );
        editingId = null;
    } else {
        products.push(product);
    }

    localStorage.setItem("products", JSON.stringify(products));
    e.target.reset();
    render();
};

// ================= EDIT / DELETE =================
function editProduct(id) {
    const p = products.find(p => String(p.id) === String(id));
    if (!p) return;

    nameInput.value = p.name;
    categoryInput.value = p.category;
    priceInput.value = p.price;
    stockInput.value = p.stock;
    editingId = p.id;
}

function deleteProduct(id) {
    if (!confirm("Delete product?")) return;
    products = products.filter(p => String(p.id) !== String(id));
    localStorage.setItem("products", JSON.stringify(products));
    render();
}

// ================= PAGINATION =================
prevBtn.onclick = () => {
    if (currentPage > 1) currentPage--;
    render();
};

nextBtn.onclick = () => {
    if (currentPage * perPage < products.length) currentPage++;
    render();
};

// ================= EXPORT CSV =================
function exportToCSV(filename, rows) {
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const csv = [
        headers.join(","),
        ...rows.map(r => headers.map(h => `"${r[h]}"`).join(","))
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
