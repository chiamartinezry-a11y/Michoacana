// Estado global del carrito, usando localStorage para persistencia básica
let cart = JSON.parse(localStorage.getItem('michoacanaCart')) || [];
let cartTotal = 0.00;

// --- Funciones de Utilidad ---

// Guarda el carrito en el almacenamiento local
function saveCart() {
    localStorage.setItem('michoacanaCart', JSON.stringify(cart));
}

// Calcula el total del carrito y actualiza el elemento en el DOM
function calculateTotal() {
    cartTotal = cart.reduce((total, item) => total + item.price, 0);
    // Formatea el total con 2 decimales
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = `$${cartTotal.toFixed(2)} MXN`;
    }
}

// Oculta todas las secciones principales (secciones y vistas corredizas)
function hideAllContent() {
    const secciones = document.querySelectorAll('.seccion, .vista-corrediza');
    secciones.forEach(sec => sec.style.display = 'none');
}

// --- Funciones del Menú y Navegación ---

// Muestra una sección por su ID (e.g., 'inicio', 'Instagram')
function mostrarSeccion(id) {
    hideAllContent();
    const seccion = document.getElementById(id);
    if (seccion) {
        seccion.style.display = 'block';
    }
    window.scrollTo(0, 0); // Desplaza al inicio de la página al cambiar de vista
}

// Muestra una 'Vista' de categoría por nombre (e.g., 'Helados' -> 'Vista_Helados')
function mostrarVista(name) {
    hideAllContent();
    const vistaId = 'Vista_' + name; 
    const vista = document.getElementById(vistaId);
    if (vista) {
        vista.style.display = 'block';
    }
    window.scrollTo(0, 0);
}

// Muestra la vista del Carrito y actualiza su contenido
function mostrarCarrito() {
    mostrarSeccion('carrito');
    updateCartDisplay();
}

// --- Funciones del Carrito ---

// Añade un producto al carrito
function addToCart(productName, size, price) {
    const item = {
        // Reemplaza los guiones bajos por espacios para mostrar el nombre limpio
        name: productName.replace(/_/g, ' ') + ' - ' + size, 
        price: price
    };
    cart.push(item);
    saveCart();
    calculateTotal();
    
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
    
    alert(`¡${item.name} agregado al carrito! Precio: $${item.price.toFixed(2)} MXN`);
}

// Remueve un producto del carrito por su índice
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
}

// Renderiza los artículos del carrito y actualiza el contador/total
function updateCartDisplay() {
    const container = document.getElementById('cart-items-container');
    const countElement = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkout-button');
    
    if (countElement) {
        countElement.textContent = cart.length;
    }
    calculateTotal();
    
    if (container) {
        container.innerHTML = '';

        if (cart.length === 0) {
            container.innerHTML = '<p>El carrito está vacío.</p>';
            if (checkoutButton) {
                checkoutButton.disabled = true;
            }
        } else {
            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0';
            ul.style.maxWidth = '400px';
            ul.style.margin = '20px auto';
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.padding = '10px 0';
                li.style.borderBottom = '1px solid #eee';
                // El botón de eliminar llama a removeFromCart()
                li.innerHTML = `
                    <span>${item.name}</span>
                    <div>
                        <span>$${item.price.toFixed(2)} MXN</span>
                        <button onclick="removeFromCart(${index})" style="margin-left: 10px; padding: 5px 10px; cursor: pointer; background: #e74c3c; color: white; border: none; border-radius: 5px;">Eliminar</button>
                    </div>
                `;
                ul.appendChild(li);
            });
            container.appendChild(ul);
            if (checkoutButton) {
                checkoutButton.disabled = false;
            }
        }
    }
}

// Inicializa el carrito y la vista al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    calculateTotal();
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
    // Muestra la sección de inicio por defecto
    mostrarSeccion('inicio'); 
});