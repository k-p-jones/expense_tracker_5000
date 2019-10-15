import { action, observable } from 'mobx';

class NotifierStore {
  @observable active  = false;
  @observable type    = '';
  @observable message = '';

  @action setActive = (newState) => {
    this.active = newState;
  }

  @action setType = (newType) => {
    this.type = newType;
  }

  @action setMessage = (newMessage) => {
    this.message = newMessage;
  }

  @action clear = () => {
    this.active  = false;
    this.type    = '';
    this.message = '';
  }
}

const notifierStore = new NotifierStore();

export default notifierStore;
