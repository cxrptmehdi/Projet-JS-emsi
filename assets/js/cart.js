// ================= AUTH =================
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if (!loggedUser) location.href = "index.html";

username.innerText = loggedUser.name;
logoutBtn.onclick = () => {
    localStorage.removeItem("loggedUser");
    location.href = "index.html";
};

// ================= DATA =================
const cartKey = `cart_${loggedUser.email}`;
let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// ================= RENDER CART =================
function renderCart() {
    cartTable.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        cartTable.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.qty}</td>
                <td>$${itemTotal}</td>
                <td>
                    <button onclick="removeItem(${index})">Remove</button>
                </td>
            </tr>
        `;
    });

    cartTotal.innerText = `Total: $${total}`;
    cartCount.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

renderCart();

// ================= REMOVE ITEM =================
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderCart();
}

// ================= CHECKOUT =================
document.getElementById("checkoutBtn").onclick = () => {
    if (!cart.length) {
        alert("Your cart is empty");
        return;
    }

    // 1️⃣ STOCK VALIDATION
    for (let item of cart) {
        const product = products.find(p => String(p.id) === String(item.id));
        if (!product || product.stock < item.qty) {
            alert(`Not enough stock for ${item.name}`);
            return;
        }
    }

    // 2️⃣ DECREASE STOCK
    cart.forEach(item => {
        const product = products.find(p => String(p.id) === String(item.id));
        product.stock -= item.qty;
    });

    // 3️⃣ CREATE ORDER (NEW STRUCTURE)
    const order = {
        id: `o_${Date.now()}`,           // unique order ID
        userEmail: loggedUser.email,     // store email
        client: loggedUser.name,         // store client name
        items: cart,                     // items array
        total: cart.reduce((s, i) => s + i.price * i.qty, 0),
        status: "Pending",               // default status
        date: new Date().toISOString()
    };

    orders.push(order);

    // 4️⃣ SAVE DATA
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem(cartKey); // clear cart

    // 5️⃣ FINISH
    alert("Checkout successful!");
    window.location.href = "orders.html";
};
