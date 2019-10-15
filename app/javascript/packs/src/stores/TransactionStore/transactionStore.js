import { observable, action } from 'mobx';

class TransactionStore {
  @observable transactions = [];

  // Sorts transactions in descending date order.
  sortTransactionsByDate = (transactions) => {
    return [...transactions].sort((a, b) => {
      // I do not think this is very performant at scale, but it will do for now.
      return new Date(b.date) - new Date(a.date);
    });
  }

  @action setTransactions = (transactions) => {
    this.transactions = transactions;
  }

  @action addTransaction = (transaction) => {
    this.transactions.push(transaction);
    this.transactions = this.sortTransactionsByDate(this.transactions);
  }

  @action removeTransaction = (id) => {
    this.transactions = this.transactions.filter(transaction => transaction.id !== id);
  }

  @action updateTransaction = (id, transactionData) => {
    const transactionIndex = this.transactions.findIndex(t => t.id === id);
    this.transactions[transactionIndex] = {...this.transactions[transactionIndex], ...transactionData};
    this.transactions = this.sortTransactionsByDate(this.transactions);
  }
}

const transactionStore = new TransactionStore();

export default transactionStore;
