// ==========================================
// SpendWise Interactive Budget Manager
// ==========================================

// 1. Initial State & Data Store (Array of Objects)
let monthlyBudget = 3000.00; // Overall budget reference
let expenses = [
    { name: "Weekly Groceries", amount: 85.50, category: "Food", date: "2026-09-01" },
    { name: "Bus Pass", amount: 30.00, category: "Transport", date: "2026-09-03" },
    { name: "Monthly Rent", amount: 750.00, category: "Rent", date: "2026-09-05" },
    { name: "Movie Night", amount: 15.00, category: "Entertainment", date: "2026-09-10" },
    { name: "Utility Bill", amount: 60.25, category: "Other", date: "2026-09-15" }
];

// Budget limits per category for conditional evaluations
const categoryBudgets = {
    Food: 500.00,
    Transport: 200.00,
    Rent: 1200.00,
    Entertainment: 150.00,
    Other: 180.00
};

// 2. Process and Render Data on Page Load
document.addEventListener("DOMContentLoaded", function () {
    renderExpensesTable();
    updateBudgetOverview();

    // 3. Handle Form Submission via Event Listener
    const expenseForm = document.getElementById("expense-form");
    const addButton = expenseForm.querySelector(".btn-primary");

    addButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent page refresh

        // Grab input values
        const nameInput = document.getElementById("expense-name");
        const amountInput = document.getElementById("expense-amount");
        const categorySelect = document.getElementById("expense-category");
        const dateInput = document.getElementById("expense-date");

        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const category = categorySelect.value;
        const date = dateInput.value;

        // Validation check before adding
        if (!name || isNaN(amount) || amount <= 0 || !date) {
            alert("Please fill in all fields with valid information.");
            return;
        }

        // Create new expense object and push to array
        const newExpense = {
            name: name,
            amount: amount,
            category: category,
            date: date
        };

        expenses.push(newExpense);

        // Reset form inputs
        expenseForm.reset();

        // Dynamically update the UI
        renderExpensesTable();
        updateBudgetOverview();

        console.log("New expense added successfully:", newExpense);
    });
});

// 4. Function to render expense records into the HTML table using a loop
function renderExpensesTable() {
    const tableBody = document.querySelector(".expense-table tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    // Loop through the array of records
    for (let i = 0; i < expenses.length; i++) {
        const item = expenses[i];

        const row = document.createElement("tr");

        // Format category lowercase for CSS tag styling mapping
        const tagClass = `tag-${item.category.toLowerCase()}`;

        row.innerHTML = `
            <td class="font-medium">${escapeHTML(item.name)}</td>
            <td class="amount-cell">KSH ${item.amount.toFixed(2)}</td>
            <td><span class="tag ${tagClass}">${escapeHTML(item.category)}</span></td>
            <td>${escapeHTML(item.date)}</td>
        `;

        tableBody.appendChild(row);
    }
}

// 5. Function to calculate totals using loops and evaluate conditional status
function updateBudgetOverview() {
    let totalSpent = 0;
    let categoryTotals = {
        Food: 0,
        Transport: 0,
        Rent: 0,
        Entertainment: 0,
        Other: 0
    };

    // Process all records using a for...of loop
    for (let expense of expenses) {
        totalSpent += expense.amount;
        
        // Accumulate totals per category if it exists in our tracker
        if (categoryTotals.hasOwnProperty(expense.category)) {
            categoryTotals[expense.category] += expense.amount;
        }
    }

    // Dynamic Decision Making: Evaluate overall financial health console logs
    console.log("===== SpendWise Live Summary =====");
    console.log(`Total Spent Across All Categories: KSH ${totalSpent.toFixed(2)}`);

    if (totalSpent > monthlyBudget) {
        console.warn("⚠️ Warning: You have exceeded your overall monthly budget threshold!");
    } else {
        console.log("✅ Budget status is healthy.");
    }
    console.log("==================================");

    // Optional: You can also dynamically update card text elements here if assigned IDs in HTML cards.
}

// Helper security utility to prevent script injection when rendering input text dynamically
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
