const products = [
  {
    id: 1,
    name: "Aurelia No. 08",
    category: "fragrance",
    price: 168,
    image:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=85",
    description:
      "Bergamot, smoked tea and white amber in a polished eau de parfum with a close, elegant trail.",
    bestseller: true
  },
  {
    id: 2,
    name: "Atelier Watch",
    category: "accessories",
    price: 420,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85",
    description:
      "A slim stainless steel timepiece with a minimal dial and refined leather strap.",
    bestseller: true
  },
  {
    id: 3,
    name: "Stone Vessel",
    category: "home",
    price: 96,
    image:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=85",
    description:
      "A sculptural ceramic vessel with soft texture, made for florals, shelves and quiet corners.",
    bestseller: false
  },
  {
    id: 4,
    name: "Velvet Serum",
    category: "skincare",
    price: 132,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85",
    description:
      "A luminous daily serum designed to leave skin supple, hydrated and camera-ready.",
    bestseller: true
  },
  {
    id: 5,
    name: "Noir Candle",
    category: "home",
    price: 78,
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85",
    description:
      "Hand-poured wax with cedar, iris and mineral smoke in a reusable glass vessel.",
    bestseller: true
  },
  {
    id: 6,
    name: "Silk Cardholder",
    category: "accessories",
    price: 155,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85",
    description:
      "Compact grained leather storage with crisp edges, tonal stitching and a soft satin lining.",
    bestseller: false
  },
  {
    id: 7,
    name: "Rose Attar",
    category: "fragrance",
    price: 210,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
    description:
      "A concentrated floral oil with damask rose, saffron and a warm sandalwood base.",
    bestseller: false
  },
  {
    id: 8,
    name: "Renewal Cream",
    category: "skincare",
    price: 118,
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=85",
    description:
      "A plush moisturizer with peptides and botanicals for a smooth, rested-looking finish.",
    bestseller: false
  }
];

const productGrid = document.querySelector("#product-grid");
const bestSellerList = document.querySelector("#best-seller-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartButton = document.querySelector(".cart-button");
const cartSidebar = document.querySelector(".cart-sidebar");
const closeCartButton = document.querySelector(".close-cart");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".quick-modal");
const modalBody = document.querySelector(".modal-body");
const modalClose = document.querySelector(".modal-close");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const searchInput = document.querySelector("#site-search");
const newsletterForm = document.querySelector(".newsletter-form");
const header = document.querySelector(".site-header");

let activeFilter = "all";
let cart = [];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function productCard(product) {
  return `
    <article class="product-card section-reveal" data-category="${product.category}">
      <button class="product-image" type="button" data-preview="${product.id}" aria-label="Preview ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </button>
      <div class="product-info">
        <div class="product-meta">
          <div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-category">${product.category}</p>
          </div>
          <span class="product-price">${money.format(product.price)}</span>
        </div>
        <div class="product-actions">
          <button class="small-button" type="button" data-add="${product.id}">Add to cart</button>
          <button class="small-button" type="button" data-preview="${product.id}">Preview</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesFilter = activeFilter === "all" || product.category === activeFilter;
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  productGrid.innerHTML = visibleProducts.length
    ? visibleProducts.map(productCard).join("")
    : `<p class="empty-state">No products match that selection.</p>`;

  observeRevealItems();
}

function renderBestSellers() {
  bestSellerList.innerHTML = products
    .filter((product) => product.bestseller)
    .map(
      (product) => `
        <article class="seller-item section-reveal">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div>
            <h3>${product.name}</h3>
            <p>${product.category} / ${money.format(product.price)}</p>
          </div>
          <button class="small-button" type="button" data-add="${product.id}">Add</button>
        </article>
      `
    )
    .join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === Number(productId));
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  if (modal.open) {
    modal.close();
  }
  openCart();
}

function renderCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = itemCount;
  cartTotal.textContent = money.format(total);

  cartItems.innerHTML = cart.length
    ? cart
        .map(
          (item) => `
            <article class="cart-line">
              <img src="${item.image}" alt="${item.name}">
              <div>
                <h3>${item.name}</h3>
                <p>${item.quantity} x ${money.format(item.price)}</p>
              </div>
              <button class="icon-button" type="button" data-remove="${item.id}" aria-label="Remove ${item.name}">x</button>
            </article>
          `
        )
        .join("")
    : `<p>Your cart is ready for its first piece.</p>`;
}

function openCart() {
  cartSidebar.classList.add("open");
  cartSidebar.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  document.body.classList.add("locked");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartSidebar.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.body.classList.remove("locked");
}

function openPreview(productId) {
  const product = products.find((item) => item.id === Number(productId));

  modalBody.innerHTML = `
    <div class="modal-content">
      <div class="modal-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="modal-copy">
        <p class="eyebrow">${product.category}</p>
        <h2 id="modal-title">${product.name}</h2>
        <p class="price">${money.format(product.price)}</p>
        <p>${product.description}</p>
        <button class="btn btn-primary" type="button" data-add="${product.id}">Add to cart</button>
      </div>
    </div>
  `;

  modal.showModal();
}

function closeMobileMenu() {
  navPanel.classList.remove("open");
  navToggle.classList.remove("active");
  header.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function setFilter(category) {
  activeFilter = category;
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === category);
  });
  renderProducts();
}

function observeRevealItems() {
  document.querySelectorAll(".section-reveal").forEach((item) => revealObserver.observe(item));
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const previewButton = event.target.closest("[data-preview]");
  const removeButton = event.target.closest("[data-remove]");
  const categoryLink = event.target.closest("[data-category-link]");

  if (addButton) {
    addToCart(addButton.dataset.add);
  }

  if (previewButton) {
    openPreview(previewButton.dataset.preview);
  }

  if (removeButton) {
    cart = cart.filter((item) => item.id !== Number(removeButton.dataset.remove));
    renderCart();
  }

  if (categoryLink) {
    setFilter(categoryLink.dataset.categoryLink);
  }

  if (event.target.matches(".nav-links a")) {
    closeMobileMenu();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
modalClose.addEventListener("click", () => modal.close());
searchInput.addEventListener("input", renderProducts);
document.querySelector(".search").addEventListener("submit", (event) => {
  event.preventDefault();
});

navToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  navToggle.classList.toggle("active", isOpen);
  header.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterForm.reset();
  newsletterForm.querySelector("button").textContent = "Joined";
});

document.querySelector(".add-detail-cart").addEventListener("click", () => addToCart(1));

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 18);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
    closeCart();
  }
});

renderBestSellers();
renderProducts();
renderCart();
observeRevealItems();
