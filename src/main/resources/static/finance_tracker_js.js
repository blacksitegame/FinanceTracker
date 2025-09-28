// Finance Tracker Application
class FinanceTracker {
  constructor() {
    this.apiUrl = "http://localhost:8080/api"; // Adjust to your Spring Boot backend URL
    this.currentUser = { userId: 2 }; // Skift til det user_id du har i database
    this.transactions = [];
    this.accounts = [];
    this.categories = [];
    this.currentTransactionType = "expense";

    this.init();
  }

  init() {
    this.renderApp();
    this.attachEventListeners();
    this.loadInitialData();
    this.setTodaysDate();
  }

  // Render the main application structure
  renderApp() {
    const app = document.getElementById("app");
    app.innerHTML = `
            <div class="container">
                <!-- Header -->
                <div class="header">
                    <h1>💰 Victors Finance Tracker</h1>
                    <p>Spor din indkomst og udgifter effektivt</p>
                </div>
                
                <!-- Dashboard Cards -->
                <div class="dashboard">
                    <div class="card balance">
                        <h2>Total Saldo</h2>
                        <div class="amount" id="totalBalance">0,00 kr</div>
                    </div>
                    <div class="card income">
                        <h2>Månedlig Indkomst</h2>
                        <div class="amount" id="monthlyIncome">+0,00 kr</div>
                    </div>
                    <div class="card expense">
                        <h2>Månedlige Udgifter</h2>
                        <div class="amount" id="monthlyExpenses">-0,00 kr</div>
                    </div>
                    <div class="card">
                        <h2>Netto Denne Måned</h2>
                        <div class="amount" id="netAmount">0,00 kr</div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div class="main-content">
                    <!-- Transaction Form -->
                    <div class="transaction-form">
                        <h2>Tilføj Transaktion</h2>
                        
                        <div class="tabs">
                            <button class="tab active" data-type="expense">Udgift</button>
                            <button class="tab" data-type="income">Indkomst</button>
                            <button class="tab" data-type="transfer">Overførsel</button>
                        </div>
                        
                        <form id="transactionForm">
                            <div class="form-group">
                                <label for="amount">Beløb</label>
                                <input type="number" id="amount" step="0.01" placeholder="0,00" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="category">Kategori</label>
                                <select id="category" required>
                                    <option value="">Vælg Kategori</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="account">Konto</label>
                                <select id="account" required>
                                    <option value="">Vælg Konto</option>
                                </select>
                            </div>
                            
                            <div class="form-group" id="toAccountGroup" style="display: none;">
                                <label for="toAccount">Til Konto</label>
                                <select id="toAccount">
                                    <option value="">Vælg Konto</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="date">Dato</label>
                                <input type="date" id="date" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="description">Beskrivelse</label>
                                <input type="text" id="description" placeholder="Hvad var dette til?">
                            </div>
                            
                            <div class="form-group">
                                <label for="notes">Noter (Valgfrit)</label>
                                <textarea id="notes" placeholder="Yderligere detaljer..."></textarea>
                            </div>
                            
                            <button type="submit" class="btn">Tilføj Transaktion</button>
                        </form>
                    </div>
                    
                    <!-- Recent Transactions -->
                    <div class="recent-transactions">
                        <h2>Seneste Transaktioner</h2>
                        <ul class="transaction-list" id="transactionList">
                            <li class="empty-state">
                                <div class="empty-state-icon">📊</div>
                                <div class="empty-state-text">Ingen transaktioner endnu</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
  }

  // Attach event listeners
  attachEventListeners() {
    // Transaction form submission
    document
      .getElementById("transactionForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.addTransaction();
      });

    // Tab switching
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        this.switchTransactionType(e.target.dataset.type);
      });
    });
  }

  // Switch transaction type
  switchTransactionType(type) {
    this.currentTransactionType = type;

    // Update active tab
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.remove("active");
      if (tab.dataset.type === type) {
        tab.classList.add("active");
      }
    });

    // Show/hide transfer fields
    const toAccountGroup = document.getElementById("toAccountGroup");
    if (type === "transfer") {
      toAccountGroup.style.display = "block";
    } else {
      toAccountGroup.style.display = "none";
    }

    // Update categories based on type
    this.updateCategoryOptions(type);
  }

  // Load initial data
  async loadInitialData() {
    try {
      // Load mock data for now - replace with API calls
      await this.loadAccounts();
      await this.loadCategories();
      await this.loadTransactions();
      await this.updateDashboard();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  // Load accounts
  async loadAccounts() {
    console.log('Loading accounts for userId:', this.currentUser.userId);
    try {
      const url = `${this.apiUrl}/accounts?userId=${this.currentUser.userId}`;
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      if (response.ok) {
        this.accounts = await response.json();
        console.log('Loaded accounts:', this.accounts);
      } else {
        console.error("Failed to load accounts, status:", response.status);
        // Fallback to mock data
        this.accounts = [
          {
            accountId: 1,
            accountName: "Checkkonto",
            currentBalance: 5000,
          },
          {
            accountId: 2,
            accountName: "Opsparingskonto",
            currentBalance: 10000,
          },
          { accountId: 3, accountName: "Kreditkort", currentBalance: -500 },
        ];
      }
    } catch (error) {
      console.error("Error loading accounts:", error);
      // Fallback to mock data
      this.accounts = [
        { accountId: 1, accountName: "Checkkonto", currentBalance: 5000 },
        { accountId: 2, accountName: "Opsparingskonto", currentBalance: 10000 },
        { accountId: 3, accountName: "Kreditkort", currentBalance: -500 },
      ];
      console.log('Using fallback accounts:', this.accounts);
    }

    // Populate account dropdowns
    const accountSelect = document.getElementById("account");
    const toAccountSelect = document.getElementById("toAccount");

    const accountOptions = this.accounts
      .map(
        (acc) => `<option value="${acc.accountId}">${acc.accountName}</option>`
      )
      .join("");

    accountSelect.innerHTML =
      '<option value="">Vælg Konto</option>' + accountOptions;
    toAccountSelect.innerHTML =
      '<option value="">Vælg Konto</option>' + accountOptions;
  }

  // Load categories
  async loadCategories() {
    try {
      const response = await fetch(
        `${this.apiUrl}/categories?userId=${this.currentUser.userId}`
      );
      if (response.ok) {
        this.categories = await response.json();
      } else {
        console.error("Failed to load categories");
        // Fallback to mock data
        this.categories = [
          {
            categoryId: 1,
            categoryName: "Mad & Spisning",
            categoryType: "expense",
          },
          {
            categoryId: 2,
            categoryName: "Transport",
            categoryType: "expense",
          },
          { categoryId: 3, categoryName: "Indkøb", categoryType: "expense" },
          {
            categoryId: 4,
            categoryName: "Underholdning",
            categoryType: "expense",
          },
          {
            categoryId: 5,
            categoryName: "Regninger & Forsyning",
            categoryType: "expense",
          },
          { categoryId: 6, categoryName: "Løn", categoryType: "income" },
          { categoryId: 7, categoryName: "Freelance", categoryType: "income" },
          {
            categoryId: 8,
            categoryName: "Investeringer",
            categoryType: "income",
          },
          { categoryId: 9, categoryName: "Overførsel", categoryType: "both" },
        ];
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      // Fallback to mock data
      this.categories = [
        {
          categoryId: 1,
          categoryName: "Mad & Spisning",
          categoryType: "expense",
        },
        {
          categoryId: 2,
          categoryName: "Transport",
          categoryType: "expense",
        },
        { categoryId: 3, categoryName: "Indkøb", categoryType: "expense" },
        {
          categoryId: 4,
          categoryName: "Underholdning",
          categoryType: "expense",
        },
        {
          categoryId: 5,
          categoryName: "Regninger & Forsyning",
          categoryType: "expense",
        },
        { categoryId: 6, categoryName: "Løn", categoryType: "income" },
        { categoryId: 7, categoryName: "Freelance", categoryType: "income" },
        {
          categoryId: 8,
          categoryName: "Investeringer",
          categoryType: "income",
        },
        { categoryId: 9, categoryName: "Overførsel", categoryType: "both" },
      ];
    }

    this.updateCategoryOptions(this.currentTransactionType);
  }

  // Update category options based on transaction type
  updateCategoryOptions(type) {
    const categorySelect = document.getElementById("category");

    const filteredCategories = this.categories.filter(
      (cat) => cat.categoryType === type || cat.categoryType === "both"
    );

    const categoryOptions = filteredCategories
      .map(
        (cat) =>
          `<option value="${cat.categoryId}">${cat.categoryName}</option>`
      )
      .join("");

    categorySelect.innerHTML =
      '<option value="">Vælg Kategori</option>' + categoryOptions;
  }

  // Load transactions
  async loadTransactions() {
    try {
      const response = await fetch(
        `${this.apiUrl}/transactions?userId=${this.currentUser.userId}`
      );
      if (response.ok) {
        const transactions = await response.json();
        // Add category names to transactions
        this.transactions = transactions.map((transaction) => {
          const category = this.categories.find(
            (c) => c.categoryId === transaction.categoryId
          );
          return {
            ...transaction,
            categoryName: category ? category.categoryName : "Unknown",
          };
        });
      } else {
        console.error("Failed to load transactions");
        this.transactions = [];
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      this.transactions = [];
    }

    this.renderTransactions();
  }

  // Render transactions
  renderTransactions() {
    const transactionList = document.getElementById("transactionList");

    if (this.transactions.length === 0) {
      transactionList.innerHTML = `
                <li class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-text">No transactions yet</div>
                </li>
            `;
      return;
    }

    const transactionsHTML = this.transactions
      .map((transaction) => {
        const amountClass =
          transaction.transactionType === "income" ? "income" : "expense";
        const amountPrefix =
          transaction.transactionType === "income" ? "+" : "-";

        return `
                <li class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-header">
                            <div class="transaction-category">${
                              transaction.categoryName
                            }</div>
                            <div class="transaction-date">${this.formatDate(
                              transaction.transactionDate
                            )}</div>
                        </div>
                        <div class="transaction-description">${
                          transaction.description
                        }</div>
                    </div>
                    <div class="transaction-right">
                        <div class="transaction-amount ${amountClass}">
                            ${amountPrefix}${transaction.amount
          .toFixed(2)
          .replace(".", ",")} kr
                        </div>
                        <button class="btn btn-danger" onclick="financeTracker.deleteTransaction(${
                          transaction.transactionId
                        })">
                            Slet
                        </button>
                    </div>
                </li>
            `;
      })
      .join("");

    transactionList.innerHTML = transactionsHTML;
  }

  // Add transaction
  async addTransaction() {
    const formData = {
      userId: this.currentUser.userId,
      amount: parseFloat(document.getElementById("amount").value),
      categoryId: parseInt(document.getElementById("category").value),
      accountId: parseInt(document.getElementById("account").value),
      transactionDate: document.getElementById("date").value,
      description: document.getElementById("description").value,
      notes: document.getElementById("notes").value,
      transactionType: this.currentTransactionType,
    };

    try {
      const response = await fetch(`${this.apiUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reload transactions to get updated data
        await this.loadTransactions();
        await this.loadAccounts(); // Reload accounts to update balances
        this.renderTransactions();
        this.updateDashboard();

        // Reset form
        document.getElementById("transactionForm").reset();
        this.setTodaysDate();

        console.log("Transaction added successfully!");
      } else {
        console.error("Failed to add transaction");
        alert("Kunne ikke tilføje transaktion. Prøv igen.");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Fejl ved tilføjelse af transaktion. Tjek din forbindelse.");
    }
  }

  // Delete transaction
  async deleteTransaction(transactionId) {
    if (confirm("Er du sikker på, at du vil slette denne transaktion?")) {
      try {
        const response = await fetch(
          `${this.apiUrl}/transactions/${transactionId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Reload transactions to get updated data
          await this.loadTransactions();
          await this.loadAccounts(); // Reload accounts to update balances
          this.renderTransactions();
          this.updateDashboard();
          console.log("Transaction deleted successfully!");
        } else {
          console.error("Failed to delete transaction");
          alert("Kunne ikke slette transaktion. Prøv igen.");
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Fejl ved sletning af transaktion. Tjek din forbindelse.");
      }
    }
  }

  // Update dashboard
  async updateDashboard() {
    try {
      // Try to get dashboard data from API
      const response = await fetch(
        `${this.apiUrl}/dashboard?userId=${this.currentUser.userId}`
      );

      if (response.ok) {
        const dashboardData = await response.json();

        // Update UI with API data
        document.getElementById(
          "totalBalance"
        ).textContent = `${dashboardData.totalBalance
          .toFixed(2)
          .replace(".", ",")} kr`;
        document.getElementById(
          "monthlyIncome"
        ).textContent = `+${dashboardData.monthlyIncome
          .toFixed(2)
          .replace(".", ",")} kr`;
        document.getElementById(
          "monthlyExpenses"
        ).textContent = `-${dashboardData.monthlyExpenses
          .toFixed(2)
          .replace(".", ",")} kr`;

        const netAmount =
          dashboardData.monthlyIncome - dashboardData.monthlyExpenses;
        document.getElementById("netAmount").textContent = `${
          netAmount >= 0 ? "+" : ""
        }${netAmount.toFixed(2).replace(".", ",")} kr`;

        // Update net amount color
        const netAmountElement = document.getElementById("netAmount");
        netAmountElement.style.color = netAmount >= 0 ? "#10b981" : "#ef4444";
      } else {
        // Fallback to client-side calculation
        this.updateDashboardClientSide();
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      // Fallback to client-side calculation
      this.updateDashboardClientSide();
    }
  }

  // Fallback dashboard calculation
  updateDashboardClientSide() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = this.transactions.filter((t) => {
      const transDate = new Date(t.transactionDate);
      return (
        transDate.getMonth() === currentMonth &&
        transDate.getFullYear() === currentYear
      );
    });

    const monthlyIncome = monthlyTransactions
      .filter((t) => t.transactionType === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.transactionType === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = this.accounts.reduce(
      (sum, acc) => sum + (acc.currentBalance || 0),
      0
    );
    const netAmount = monthlyIncome - monthlyExpenses;

    // Update UI
    document.getElementById("totalBalance").textContent = `${totalBalance
      .toFixed(2)
      .replace(".", ",")} kr`;
    document.getElementById("monthlyIncome").textContent = `+${monthlyIncome
      .toFixed(2)
      .replace(".", ",")} kr`;
    document.getElementById("monthlyExpenses").textContent = `-${monthlyExpenses
      .toFixed(2)
      .replace(".", ",")} kr`;
    document.getElementById("netAmount").textContent = `${
      netAmount >= 0 ? "+" : ""
    }${netAmount.toFixed(2).replace(".", ",")} kr`;

    // Update net amount color
    const netAmountElement = document.getElementById("netAmount");
    netAmountElement.style.color = netAmount >= 0 ? "#10b981" : "#ef4444";
  }

  // Utility functions
  setTodaysDate() {
    const dateInput = document.getElementById("date");
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("da-DK", options);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.financeTracker = new FinanceTracker();
});
