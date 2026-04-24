// Invoice Generator JavaScript

let items = [];

function generateInvoiceNumber() {
    const now = new Date();
    return now.getFullYear().toString() +
           (now.getMonth() + 1).toString().padStart(2, '0') +
           now.getDate().toString().padStart(2, '0') +
           now.getHours().toString().padStart(2, '0') +
           now.getMinutes().toString().padStart(2, '0') +
           now.getSeconds().toString().padStart(2, '0');
}

function addItems() {
    const numItems = parseInt(document.getElementById('num-items').value);
    const container = document.getElementById('items-container');

    if (isNaN(numItems) || numItems <= 0) {
        alert('Please enter a valid number of items.');
        return;
    }

    container.innerHTML = '';

    for (let i = 0; i < numItems; i++) {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <input type="text" placeholder="Item Name" required>
            <input type="number" placeholder="Qty" min="1" required>
            <input type="number" placeholder="Price" min="0" step="0.01" required>
        `;
        container.appendChild(itemRow);
    }
}

function getClientDetails() {
    const name = document.getElementById('client-name').value.trim();
    const contact = document.getElementById('client-contact').value.trim();
    return { name, contact };
}

function getItems() {
    const itemRows = document.querySelectorAll('.item-row');
    const items = [];

    itemRows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const name = inputs[0].value.trim();
        const qty = parseInt(inputs[1].value);
        const price = parseFloat(inputs[2].value);

        if (name && !isNaN(qty) && qty > 0 && !isNaN(price) && price >= 0) {
            const total = qty * price;
            items.push({ name, qty, price, total });
        }
    });

    return items;
}

function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.total, 0);
}

function applyTaxAndDiscount(subtotal, taxPercent, discountPercent) {
    const taxAmount = subtotal * (taxPercent / 100);
    const discountAmount = subtotal * (discountPercent / 100);
    const finalTotal = subtotal + taxAmount - discountAmount;
    return { taxAmount, discountAmount, finalTotal };
}

function generateInvoice() {
    const client = getClientDetails();
    const items = getItems();
    const taxPercent = parseFloat(document.getElementById('tax-percent').value) || 0;
    const discountPercent = parseFloat(document.getElementById('discount-percent').value) || 0;

    if (!client.name || !client.contact) {
        alert('Please fill in client details.');
        return;
    }

    if (items.length === 0) {
        alert('Please add at least one item.');
        return;
    }

    const subtotal = calculateTotal(items);
    const { taxAmount, discountAmount, finalTotal } = applyTaxAndDiscount(subtotal, taxPercent, discountPercent);
    const invoiceNum = generateInvoiceNumber();

    const invoiceContent = `==================================================
Invoice No: ${invoiceNum}
Client: ${client.name}
Contact: ${client.contact}
==================================================
${'Item'.padEnd(15)} ${'Qty'.padEnd(5)} ${'Price'.padEnd(8)} ${'Total'.padEnd(8)}
--------------------------------------------------
${items.map(item =>
    `${item.name.padEnd(15)} ${item.qty.toString().padEnd(5)} ${item.price.toFixed(2).padEnd(8)} ${item.total.toFixed(2).padEnd(8)}`
).join('\n')}
--------------------------------------------------
Subtotal: ${subtotal.toFixed(2)}
Tax (${taxPercent}%): ${taxAmount.toFixed(2)}
Discount (${discountPercent}%): ${discountAmount.toFixed(2)}
Final Total: ${finalTotal.toFixed(2)}
==================================================`;

    document.getElementById('invoice-content').textContent = invoiceContent;
    document.getElementById('invoice-display').classList.remove('hidden');

    // Store invoice data for download
    window.currentInvoice = {
        content: invoiceContent,
        filename: `invoice_${invoiceNum}.txt`
    };
}

function downloadInvoice() {
    if (!window.currentInvoice) return;

    const blob = new Blob([window.currentInvoice.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = window.currentInvoice.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Event listeners
document.getElementById('add-items-btn').addEventListener('click', addItems);

document.getElementById('invoice-form').addEventListener('submit', function(e) {
    e.preventDefault();
    generateInvoice();
});

document.getElementById('download-btn').addEventListener('click', downloadInvoice);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Any initialization code here
});