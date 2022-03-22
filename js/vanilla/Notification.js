export default class Notification {
  constructor(copy) {
    this.copy      = copy || '';
    this.baseClass = 'notification';
  }
  
  create() {
    const $p = document.createElement('p');
    const t  = document.createTextNode(this.copy);
    $p.appendChild(t);
    $p.className = this.baseClass;
    return jQuery($p);
  }
};
