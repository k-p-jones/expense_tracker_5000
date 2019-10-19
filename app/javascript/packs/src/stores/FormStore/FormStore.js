import { action, observable } from 'mobx';

class FormStore {
  @observable showForm = false;
  @observable description = '';
  @observable date = '';
  @observable cost = '';
  @observable editMode = false;
  @observable selectedTransactionId = undefined;

  @action toggleShow = () => {
    this.showForm = !this.showForm;
  }

  @action toggleEdit = () => {
    this.editMode = !this.editMode;
  }

  @action clear = () => {
    this.description = '';
    this.date = '';
    this.cost = '';
    this.selectedTransactionId = undefined;
  }

  @action populateEditForm = (description, cost, date, id) => {
    this.description = description;
    this.cost = cost;
    this.date = date;
    this.selectedTransactionId = id;
  }

  @action setDescription = (description) => {
    this.description = description;
  }

  @action setDate = (date) => {
    this.date = date;
  }

  @action setCost = (cost) => {
    this.cost = cost;
  }
}

const formStore = new FormStore();

export default formStore;
