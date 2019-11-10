import { observable, action } from 'mobx';
import axios from 'axios';

class TransactionStore {
  @observable transactions = [];

  // Sorts transactions in descending date order.
  sortTransactionsByDate = (transactions) => {
    return [...transactions].sort((a, b) => {
      // I do not think this is very performant at scale, but it will do for now.
      return new Date(b.date) - new Date(a.date);
    });
  }

  @action setTransactions = () => {
    return new Promise((resolve, reject) => {
      axios.get('/transactions')
      .then((response) => {
        this.transactions = response.data;
        resolve({});
      })
      .catch(errors => reject(errors));
    });
  }

  @action addTransaction = (transactionData) => {
    return new Promise((resolve, reject) => {
      axios.post('/transactions', transactionData)
      .then((response) => {
        this.transactions.push(response.data);
        this.transactions = this.sortTransactionsByDate(this.transactions);
        resolve(response.data);
      })
      .catch(errors => reject(errors));
    });
  }

  @action removeTransaction = (id) => {
    return new Promise((resolve, reject) => {
      axios.delete(`/transactions/${id}`)
      .then(() => {
        this.transactions = this.transactions.filter(transaction => transaction.id !== id);
        resolve({});
      })
      .catch(errors => reject(errors));
    })
  }

  @action updateTransaction = (id, transactionData) => {
    return new Promise((resolve, reject) => {
      axios.patch(`/transactions/${id}`, transactionData)
      .then((response) => {
        const transactionIndex = this.transactions.findIndex(t => t.id === id);
        this.transactions[transactionIndex] = {...this.transactions[transactionIndex], ...transactionData};
        this.transactions = this.sortTransactionsByDate(this.transactions);
        resolve(response);
      })
      .catch((errors) => reject(errors));
    });
  }
}

const transactionStore = new TransactionStore();

export default transactionStore;
