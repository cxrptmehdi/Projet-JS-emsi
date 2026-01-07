const translations = {
    en: {
        dashboard: "Dashboard",
        products: "Products",
        categories: "Categories",
        clients: "Clients",
        orders: "Orders",
        suppliers: "Suppliers",
        cart: "Cart",
        add_to_cart: "Add to cart",
        logout: "Logout",
        logout_confirm: "Are you sure you want to log out?",
        price: "Price",
        stock: "Stock",
        search: "Search...",
        total: "Total",
        your_cart: "Your Cart",
        revenue: "Revenue",
        name: "Name",
        category: "Category",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        phone: "Phone",
        checkout: "Checkout",
        qty: "Qty"
    },

    fr: {
        dashboard: "Tableau de bord",
        products: "Produits",
        categories: "Catégories",
        clients: "Clients",
        orders: "Commandes",
        suppliers: "Fournisseurs",
        cart: "Panier",
        add_to_cart: "Ajouter au panier",
        logout: "Déconnexion",
        logout_confirm: "Êtes-vous sûr de vouloir vous déconnecter ?",
        price: "Prix",
        stock: "Stock",
        search: "Rechercher...",
        total: "Total",
        your_cart: "Votre panier",
        revenue: "Revenu",
        name: "Nom",
        category: "Catégorie",
        save: "Enregistrer",
        edit: "Modifier",
        delete: "Supprimer",
        phone: "Téléphone",
        checkout: "Passer à la caisse",
        qty: "Qté"
    }
};


function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    applyTranslations();
}

function applyTranslations() {
    const lang = localStorage.getItem("lang") || "en";

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

document.addEventListener("DOMContentLoaded", applyTranslations);
