const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if (!loggedUser) location.href = "index.html";

username.innerText = loggedUser.name;
logoutBtn.onclick = () => {
    localStorage.removeItem("loggedUser");
    location.href = "index.html";
};

const cartKey = `cart_${loggedUser.email}`;
let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

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

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderCart();
}
