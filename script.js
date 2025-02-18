let items = JSON.parse(localStorage.getItem('pnlItems')) || [];
let totalIncome = 0;
let totalExpense = 0;

function addItem() {
    const description = document.getElementById('description').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;

    if (!description || !quantity || !price || !date) {
        alert('Please fill all fields!');
        return;
    }

    const amount = quantity * price;

    const item = {
        date,
        description,
        quantity,
        price,
        amount,
        type
    };

    items.push(item);
    saveToLocalStorage();
    updateTable();
    updateSummary();
    clearForm();
}

function updateTable() {
    const tbody = document.querySelector('#pnlTable tbody');
    tbody.innerHTML = '';

    items.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.amount.toFixed(2)}</td>
            <td><span class="type ${item.type}">${item.type}</span></td>
            <td><button onclick="deleteItem(${index})"><i class="fas fa-trash"></i></button></td>
        `;
        tbody.appendChild(row);
    });
}

function updateSummary() {
    totalIncome = items.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    totalExpense = items.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const netProfit = totalIncome - totalExpense;

    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
    document.getElementById('totalExpense').textContent = totalExpense.toFixed(2);
    document.getElementById('netProfit').textContent = netProfit.toFixed(2);
}

function deleteItem(index) {
    items.splice(index, 1);
    saveToLocalStorage();
    updateTable();
    updateSummary();
}

function clearForm() {
    document.getElementById('description').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('price').value = '';
    document.getElementById('date').value = '';
}

function clearAll() {
    if (confirm('Are you sure you want to clear all data?')) {
        items = [];
        saveToLocalStorage();
        updateTable();
        updateSummary();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('pnlItems', JSON.stringify(items));
}

function exportToExcel() {
    const wsData = items.map(item => [item.date, item.description, item.quantity, item.price, item.amount, item.type]);
    const ws = XLSX.utils.aoa_to_sheet([['Date', 'Description', 'Quantity', 'Price', 'Amount', 'Type'], ...wsData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PNL Data');
    XLSX.writeFile(wb, 'pnl_data.xlsx');
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    updateTable();
    updateSummary();
});
