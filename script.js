const form = document.querySelector('.add');
const incomeList = document.querySelector('ul.income-list');
const expenseList = document.querySelector('ul.expense-list');

const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');

let transactions =
   localStorage.getItem('transactions') !== null
      ? JSON.parse(localStorage.getItem('transactions'))
      : [];

function generateTemplate(id, source, amount, time) {
   return `<li data-id="${id}">
   <p>
      <span>${source}</span>
      <span>${time}</span>
   </p>
   <div>
      <span>$${Math.abs(amount)}</span>
      <span class="delete">🗑️</span>
   </div>
</li>`;
}

function addTransactionDOM(id, source, amount, time) {
   amount > 0
      ? (incomeList.innerHTML += generateTemplate(id, source, amount, time))
      : (expenseList.innerHTML += generateTemplate(id, source, amount, time));
}

function addTransaction(source, amount) {
   const time = new Date();
   const transaction = {
      id: Math.floor(Math.random() * 100000),
      source: source,
      amount: amount,
      time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`,
   };
   transactions.push(transaction);
   localStorage.setItem('transactions', JSON.stringify(transactions));
   addTransactionDOM(
      transaction.id,
      transaction.source,
      transaction.amount,
      transaction.time
   );
}

form.addEventListener('submit', (event) => {
   event.preventDefault();
   if(form.source.value === '' || form.amount.value === '') return;
   addTransaction(form.source.value, form.amount.value);
   form.reset();
   updateStatistics();
});

function getTransaction() {
   transactions.forEach((transaction) => {
      transaction.amount > 0
         ? (incomeList.innerHTML += generateTemplate(
              transaction.id,
              transaction.source,
              transaction.amount,
              transaction.time
           ))
         : (expenseList.innerHTML += generateTemplate(
              transaction.id,
              transaction.source,
              transaction.amount,
              transaction.time
           ));
   });
}

getTransaction();

function deleteTransaction(id) {
   transactions = transactions.filter(
      (transaction) => transaction.id !== Number(id)
   );
   localStorage.setItem('transactions', JSON.stringify(transactions));
   // getTransaction();
}

incomeList.addEventListener('click', (event) => {
   if (event.target.classList.contains('delete')) {
      event.target.parentElement.parentElement.remove();
      deleteTransaction(event.target.parentElement.parentElement.dataset.id);
   }
   updateStatistics();
});

expenseList.addEventListener('click', (event) => {
   if (event.target.classList.contains('delete')) {
      event.target.parentElement.parentElement.remove();
      deleteTransaction(event.target.parentElement.parentElement.dataset.id);
   }
   updateStatistics();
});

function updateStatistics() {
   const updatedIncome = transactions
      .filter((transaction) => transaction.amount > 0)
      .reduce(
         (total, transaction) => (total += Math.abs(transaction.amount)),
         0
      );

   const updatedExpense = transactions
      .filter((transaction) => transaction.amount < 0)
      .reduce(
         (total, transaction) => (total += Math.abs(transaction.amount)),
         0
      );
   balance.textContent = updatedIncome - updatedExpense;
   income.textContent = updatedIncome;
   expense.textContent = updatedExpense;
}
updateStatistics();
