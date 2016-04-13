import Firebase from 'firebase';

import ObjectStore from '../stores/object';
import SessionStore from '../stores/session';

export default class {
  constructor() {
    this.sessionKey = SessionStore.sessionKey || '';
    this.firebase = new Firebase('https://blink-ct.firebaseio.com/classes/');
    this.classRef = null;
    this.sessionRef = null;
    this.messagesRef = null;

    this.classId = null;
    this.name = null;
    this.message = null;
    this.light = null;
    this.music = null;

    this.messageTimeout = null;
    this.messageRef = null;

    this.unsubscribeObjectStore = ObjectStore.listen(this.onObjectUpdate.bind(this));
    window.addEventListener('unload', this.disconnectClass.bind(this));
  }

  connectClass() {
    // Initialise all firebase references
    this.classRef = this.firebase.child(this.classId);
    this.sessionRef = this.classRef.child('display/sessions/' + this.sessionKey);
    this.messagesRef = this.classRef.child('display/messages');

    // Whipe local cache so we recreate all state on a new classroom
    this.name = this.message = this.light = this.music = null;
  }

  disconnectClass() {
    if(!this.classRef) {
      return;
    }

    // Destroy active session
    this.sessionRef.remove();

    // Remove message we were typing
    if(this.messageRef) {
      this.messageRef.remove();
      clearTimeout(this.messageTimeout);
    }

    // Unset old references
    this.classRef = this.sessionRef = this.messagesRef = this.messageRef = null;
  }

  onObjectUpdate(data) {
    if(!data || !data.objects) {
      return;
    }

    const { bericht, digibord, lamp, muziek, naam } = data.objects;

    this.updateClassConnection(digibord);

    if(!this.classRef) {
      // No class connection, no use continuing
      return;
    }

    this.updateName(naam);
    this.postMessage(bericht);
    this.updateMusic(muziek);
    this.updateLight(lamp);
  }

  updateClassConnection(classId) {
    if(!classId || this.classId === classId.state) {
      return;
    }

    this.classId = classId.state;

    this.disconnectClass();

    if(!this.classId || this.classId.length !== 6) {
      return;
    }

    this.connectClass();
  }

  updateName(name) {
    if(!name || this.name === name.state) {
      return;
    }

    this.name = name.state;

    this.sessionRef.update({ name: this.name });
  }

  postMessage(message) {
    if(!message || this.message === message.state) {
      return;
    }

    this.message = message.state;

    if(!this.message && !this.messageRef) {
      // Empty message, and nothing to update, get out.
      return;
    }

    clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => this.messageRef = null, 4242);

    if(this.messageRef) {
      this.messageRef.update({ message: message.state });
    } else {
      this.messageRef = this.messagesRef.push({
        message: message.state,
        sessionKey: this.sessionKey
      });
    }
  }

  updateMusic() {
  }

  updateLight(light) {
    if(!light || this.light === light.state) {
      return;
    }

    this.light = light.state;

    this.sessionRef.update({ light: this.light });
  }
}
