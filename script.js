// Data storage
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// DOM elements
const notesList = document.getElementById('notes-list');
const expensesList = document.getElementById('expenses-list');
const totalAmountDisplay = document.getElementById('totalAmount');
const expenseChart = document.getElementById('expense-chart');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderNotes();
    renderExpenses();
    updateTotal();
    renderChart();
    
    // Setup tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
        });
    });
    
    // Add note button
    document.getElementById('addNoteBtn').addEventListener('click', addNote);
    
    // Add expense button
    document.getElementById('addExpenseBtn').addEventListener('click', addExpense);
});

// Add a new note
function addNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title || !content) {
        alert('Please enter both title and content for your note.');
        return;
    }
    
    const newNote = {
        id: Date.now(),
        title,
        content,
        date: new Date().toLocaleString()
    };
    
    notes.push(newNote);
    saveToLocalStorage();
    renderNotes();
    
    // Clear form
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
}

// Add a new expense
function addExpense() {
    const name = document.getElementById('expenseName').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    
    if (!name || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid description and amount for your expense.');
        return;
    }
    
    const newExpense = {
        id: Date.now(),
        name,
        amount,
        category,
        date: new Date().toLocaleString()
    };
    
    expenses.push(newExpense);
    saveToLocalStorage();
    renderExpenses();
    updateTotal();
    renderChart();
    
    // Clear form
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
}

// Delete a note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveToLocalStorage();
    renderNotes();
}

// Delete an expense
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveToLocalStorage();
    renderExpenses();
    updateTotal();
    renderChart();
}

// Render all notes
function renderNotes() {
    if (notes.length === 0) {
        notesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sticky-note"></i>
                <p>No notes yet. Add your first note!</p>
            </div>
        `;
        return;
    }
    
    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'list-item';
        noteElement.innerHTML = `
            <div class="note-content">
                <div class="note-title">${note.title}</div>
                <div class="note-text">${note.content}</div>
                <div class="item-date">${note.date}</div>
            </div>
            <button class="delete-btn" onclick="deleteNote(${note.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        notesList.appendChild(noteElement);
    });
}

// Render all expenses
function renderExpenses() {
    if (expenses.length === 0) {
        expensesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>No expenses recorded yet. Add your first expense!</p>
            </div>
        `;
        return;
    }
    
    expensesList.innerHTML = '';
    expenses.forEach(expense => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'list-item';
        
        // Get category icon
        let categoryIcon = 'fas fa-question';
        switch(expense.category) {
            case 'food': categoryIcon = 'fas fa-utensils'; break;
            case 'shopping': categoryIcon = 'fas fa-shopping-cart'; break;
            case 'transport': categoryIcon = 'fas fa-bus'; break;
            case 'entertainment': categoryIcon = 'fas fa-film'; break;
            case 'utilities': categoryIcon = 'fas fa-lightbulb'; break;
            case 'health': categoryIcon = 'fas fa-heartbeat'; break;
            default: categoryIcon = 'fas fa-question';
        }
        
        expenseElement.innerHTML = `
            <div class="expense-item">
                <div class="expense-details">
                    <div class="note-title">${expense.name}</div>
                    <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
                    <div class="expense-category"><i class="${categoryIcon}"></i> ${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</div>
                </div>
                <div>
                    <div class="item-date">${expense.date}</div>
                </div>
            </div>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        expensesList.appendChild(expenseElement);
    });
}

// Calculate and display total expenses
function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmountDisplay.textContent = total.toFixed(2);
}

// Render chart for expense categories
function renderChart() {
    // Group expenses by category
    const categories = {
        food: 0,
        shopping: 0,
        transport: 0,
        entertainment: 0,
        utilities: 0,
        health: 0,
        other: 0
    };
    
    expenses.forEach(expense => {
        categories[expense.category] += expense.amount;
    });
    
    // Find max value for scaling
    const maxValue = Math.max(...Object.values(categories), 1);
    
    // Generate chart bars
    expenseChart.innerHTML = '';
    for (const [category, amount] of Object.entries(categories)) {
        if (amount > 0) {
            const barHeight = (amount / maxValue) * 150;
            const bar = document.createElement('div');
            bar.style.cssText = `
                width: 40px;
                height: ${barHeight}px;
                background: linear-gradient(to top, #e44d26, #f16529);
                border-radius: 5px 5px 0 0;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                margin: 0 5px;
            `;
            
            // Add label
            const label = document.createElement('div');
            label.textContent = category.charAt(0).toUpperCase();
            label.style.cssText = `
                color: white;
                font-weight: bold;
                padding: 5px 0;
            `;
            bar.appendChild(label);
            
            // Add tooltip
            bar.title = `${category.charAt(0).toUpperCase() + category.slice(1)}: ₹${amount.toFixed(2)}`;
            
            expenseChart.appendChild(bar);
        }
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('expenses', JSON.stringify(expenses));
}
