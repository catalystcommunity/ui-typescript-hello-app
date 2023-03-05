
function postMe(name, data, callback, onError) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState != 4 || request.status != 200) { return; }
        var body = JSON.parse(request.responseText);
        if (body.error) {
            onError(body.error);
        }
        else {
            callback(body);
        }
    };
    request.open('POST', '/api/' + name, true);
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(data));
}

class HelloItem extends HTMLElement {
  constructor() {
    super();
    this.name = 'World'
  }
  static get observedAttributes() {
    return ['name'];
  }
  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }
  connectedCallback() {
    
    const shadow = this.attachShadow({ mode: 'closed' });

    shadow.innerHTML = `<h1>Hello ${ this.name }!</h1>`;
  }
}

class HelloApp extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.innerHTML = '<hello-item name="Caldo"></hello-item>';
  }
}

customElements.define( 'hello-app', HelloApp );
customElements.define( 'hello-item', HelloItem );

