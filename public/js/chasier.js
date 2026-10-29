/* ============================================
   SAMPLE PRODUCT DATA
============================================ */
const products = window.PRODUCTS || [
    { id: 1, code: "BRG001", barcode: "899123456001", name: "Indomie Goreng",       price: 3500 },
    { id: 2, code: "BRG002", barcode: "899123456002", name: "Aqua 600ml",           price: 4000 },
    { id: 3, code: "BRG003", barcode: "899123456003", name: "Teh Botol Sosro",      price: 5000 },
    { id: 4, code: "BRG004", barcode: "899123456004", name: "Beras 5 Kg",           price: 75000 },
    { id: 5, code: "BRG005", barcode: "899123456005", name: "Minyak Goreng 1 Liter", price: 18000 },
    { id: 6, code: "BRG006", barcode: "899123456006", name: "Gula Pasir 1 Kg",      price: 17000 },
];

let cart = [];
let heldTransactions = [];

/* ============================================
   1. SEARCH PRODUCT
============================================ */
const searchInput = document.getElementById("searchProduct");
searchInput.addEventListener("input", searchProduct);

// Enter = tambah otomatis (scan barcode / hasil tunggal)
searchInput.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const keyword = searchInput.value.toLowerCase().trim();
    if (!keyword) return;
    const exact = products.find(
        (p) => p.barcode === keyword || p.code.toLowerCase() === keyword,
    );
    if (exact) {
        addToCart(exact.id);
        return;
    }
    const results = products.filter((p) => p.name.toLowerCase().includes(keyword));
    if (results.length === 1) addToCart(results[0].id);
});

function searchProduct() {
    const keyword = searchInput.value.toLowerCase().trim();
    const resultBox = document.getElementById("productResults");

    if (!keyword) {
        resultBox.style.display = "none";
        return;
    }

    const results = products.filter(
        (product) =>
            product.name.toLowerCase().includes(keyword) ||
            product.code.toLowerCase().includes(keyword) ||
            product.barcode.includes(keyword),
    );

    if (results.length === 0) {
        resultBox.innerHTML = `<div class="product-item">Barang tidak ditemukan</div>`;
    } else {
        resultBox.innerHTML = results
            .map(
                (product) => `
                <div class="product-item" onclick="addToCart(${product.id})">
                    <div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-code">${product.code} - ${product.barcode}</div>
                    </div>
                    <div class="product-price">${formatRupiah(product.price)}</div>
                </div>`,
            )
            .join("");
    }
    resultBox.style.display = "block";
}

document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-input")) {
        document.getElementById("productResults").style.display = "none";
    }
});

/* ============================================
   2. FORMAT RUPIAH
============================================ */
function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

/* ============================================
   ADD CART
============================================ */
function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const existing = cart.find((item) => item.id === productId);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    searchInput.value = "";
    document.getElementById("productResults").style.display = "none";
    renderCart();
    searchInput.focus();
}

/* ============================================
   RENDER CART
============================================ */
function renderCart() {
    const body = document.getElementById("cartBody");

    if (cart.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="6" class="empty-cart">
                    Keranjang masih kosong.<br>Silakan cari atau scan barang.
                </td>
            </tr>`;
        calculateTotal();
        return;
    }

    body.innerHTML = cart
        .map(
            (item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <strong>${item.name}</strong>
                    <div style="font-size:11px; color:#6c757d">${item.code}</div>
                </td>
                <td>${formatRupiah(item.price)}</td>
                <td>
                    <div class="qty-control">
                        <button onclick="changeQty(${item.id}, -1)">−</button>
                        <input type="number" value="${item.qty}" min="1" onchange="updateQty(${item.id}, this.value)">
                        <button onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td class="text-right"><strong>${formatRupiah(item.price * item.qty)}</strong></td>
                <td class="text-center">
                    <button class="remove-btn" onclick="removeItem(${item.id})">×</button>
                </td>
            </tr>`,
        )
        .join("");

    calculateTotal();
}

/* ============================================
   CHANGE / UPDATE QTY, REMOVE
============================================ */
function changeQty(id, amount) {
    const item = cart.find((item) => item.id === id);
    if (!item) return;
    item.qty += amount;
    if (item.qty <= 0) {
        removeItem(id);
        return;
    }
    renderCart();
}

function updateQty(id, qty) {
    const item = cart.find((item) => item.id === id);
    if (!item) return;
    item.qty = Math.max(1, parseInt(qty) || 1);
    renderCart();
}

function removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    renderCart();
}

/* ============================================
   CALCULATE
============================================ */
function getSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getGrandTotal() {
    const subtotal = getSubtotal();
    const discountPercent = parseFloat(document.getElementById("discountPercent").value) || 0;
    const discountAmount = parseFloat(document.getElementById("discountAmount").value) || 0;
    const tax = parseFloat(document.getElementById("tax").value) || 0;
    const otherFee = parseFloat(document.getElementById("otherFee").value) || 0;

    const discount = (subtotal * discountPercent) / 100 + discountAmount;
    return Math.max(0, subtotal - discount + tax + otherFee);
}

function calculateTotal() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    document.getElementById("totalQty").innerText = totalQty;
    document.getElementById("itemCount").innerText = totalQty + " Item";
    document.getElementById("subtotal").innerText = formatRupiah(getSubtotal());
    document.getElementById("grandTotal").innerText = formatRupiah(getGrandTotal());

    calculateChange();
}

function calculateChange() {
    const grandTotal = getGrandTotal();
    const payment = parseFloat(document.getElementById("payment").value) || 0;
    const change = payment - grandTotal;

    const changeBox = document.getElementById("changeBox");
    const changeElement = document.getElementById("change");
    const label = document.querySelector(".change-label");

    if (change >= 0) {
        changeBox.classList.remove("short-payment");
        changeElement.innerText = formatRupiah(change);
        label.innerText = "KEMBALIAN";
    } else {
        changeBox.classList.add("short-payment");
        changeElement.innerText = formatRupiah(Math.abs(change));
        label.innerText = "UANG KURANG";
    }
}

/* ============================================
   PAYMENT METHOD
============================================ */
function selectPayment(button) {
    document.querySelectorAll(".payment-method button").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
}

function getPaymentMethod() {
    const active = document.querySelector(".payment-method button.active");
    return active ? active.innerText : "Tunai";
}

/* ============================================
   RESET FORM
============================================ */
function resetTransaction() {
    cart = [];
    document.getElementById("payment").value = "";
    document.getElementById("discountPercent").value = 0;
    document.getElementById("discountAmount").value = 0;
    document.getElementById("tax").value = 0;
    document.getElementById("otherFee").value = 0;
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerType").selectedIndex = 0;
    renderCart();
}

/* ============================================
   HOLD TRANSACTION
============================================ */
function holdTransaction() {
    if (cart.length === 0) {
        alert("Tidak ada transaksi untuk ditahan.");
        return;
    }

    heldTransactions.push({
        number: document.getElementById("transactionNumber").innerText,
        cart: JSON.parse(JSON.stringify(cart)),
        total: getGrandTotal(),
    });

    resetTransaction();
    generateTransactionNumber();
    alert("Transaksi berhasil ditahan.");
}

/* ============================================
   PAYMENT
============================================ */
function processPayment() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong.");
        return;
    }

    const total = getGrandTotal();
    const payment = parseFloat(document.getElementById("payment").value) || 0;

    if (payment < total) {
        alert("Uang pembayaran masih kurang.");
        return;
    }

    const change = payment - total;
    const customer = document.getElementById("customerType").value;
    const phone = document.getElementById("customerPhone").value.trim();

    fetch("/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({
            customer_name: phone ? customer + " (" + phone + ")" : customer,
            total: Math.round(total),
            items: cart.map((i) => ({ id: i.id, qty: i.qty })),
        }),
    })
        .then((res) => {
            if (!res.ok) throw new Error("Gagal menyimpan transaksi");
            return res.json();
        })
        .then((data) => {
            alert("Pembayaran berhasil!\n\nKembali : " + formatRupiah(change));
            window.location.href = data.invoice_url;
            resetTransaction();
            generateTransactionNumber();
        })
        .catch((err) => alert(err.message));
}

/* ============================================
   CANCEL TRANSACTION
============================================ */
function cancelTransaction() {
    if (!confirm("Batalkan transaksi ini?")) return;
    resetTransaction();
}

/* ============================================
   TRANSACTION NUMBER & DATE
============================================ */
let trxCounter = 1;

function generateTransactionNumber() {
    const d = new Date();
    const ymd =
        d.getFullYear() +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0");
    document.getElementById("transactionNumber").innerText =
        "TRX-" + ymd + "-" + String(trxCounter++).padStart(3, "0");
}

function updateDate() {
    document.getElementById("currentDate").innerText = new Date().toLocaleString("id-ID");
}

/* ============================================
   KEYBOARD SHORTCUT
============================================ */
document.addEventListener("keydown", function (event) {
    if (event.key === "F2") {
        event.preventDefault();
        searchInput.focus();
    }
    if (event.key === "F4") {
        event.preventDefault();
        document.getElementById("payment").focus();
    }
    if (event.key === "Escape") {
        cancelTransaction();
    }
});

/* ============================================
   INITIAL
============================================ */
generateTransactionNumber();
updateDate();
setInterval(updateDate, 1000);
renderCart();