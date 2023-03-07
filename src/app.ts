
function postMe(name:string, data:string, callback:Function, onError:Function) {
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
  caller: string;

  constructor() {
    super();
    this.caller= 'World'
    // this.shadow = this.attachShadow({ mode: 'open' });
    // console.log(typeof(this.shadow))
    this.innerHTML = `<h1>Hello ${ this.caller }!</h1>`;
  }
  static get observedAttributes() {
    return ['caller'];
  }
  attributeChangedCallback(property:string, oldValue:string, newValue:string) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }
  connectedCallback() {
    this.innerHTML = `<h1>Hello ${ this.caller }!</h1>`;
  }
}

const helloAppTemplate = document.createElement('template')
helloAppTemplate.innerHTML = `
<hello-item caller="Caldo"></hello-item>
<test-header>Something Inner</test-header>
<hello-table name="mainTable"></hello-table>
`
class HelloApp extends HTMLElement {
  shadow: any;
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.append(helloAppTemplate.content.cloneNode(true));
  }
}


const testHeaderTemplate = document.createElement('template')
testHeaderTemplate.innerHTML = `
<section>
  <h3>This is a header of 3</h3>
  <p>This is the inner bits: <slot></slot></p>
</section>
`
class TestHeader extends HTMLElement {
  startingText: string;
  shadow: any;
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.append(testHeaderTemplate.content.cloneNode(true));
  }
}

const helloTableTemplate = document.createElement('template')
helloTableTemplate.innerHTML = `
<div>
  <div class="hello-table">
    Hinton wanted this here.
    <hello-row cells="5"></hello-row>
    <hello-row cells="5"></hello-row>
    <hello-row cells="4"></hello-row>
    <hello-row cells="5"></hello-row>
  </div>
</div>
<style>
  .hello-table {
    border: 1px solid black;
  }
  hello-row {
    border: 1px solid red;
    width: 50%;
    display: block;
  }
</style>
`;

class HelloTable extends HTMLElement {
  shadow: any;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.append(helloTableTemplate.content.cloneNode(true));
  }
  attributeChangedCallback(property:string, oldValue:string, newValue:string) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }
  connectedCallback() {
  }
}

class HelloRow extends HTMLElement {
  cells: number;
  shadow: any;

  constructor() {
    super();
    this.cells = 3
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render()
  }
  static get observedAttributes() {
    return ['cells'];
  }
  attributeChangedCallback(property:string, oldValue:string, newValue:string) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
    console.log("Setting " + property + " to new value: " + newValue);
    this.render()
  }
  connectedCallback() {
    this.render()
  }
  render() {
    this.shadow.innerHTML = "\n" 
    for (let i: number = 0; i < this.cells; i++){
      this.shadow.innerHTML += `<hello-cell>a cell ${ i+1 }</hello-cell>\n`
    }
  }
}

class HelloCell extends HTMLElement {
  startingText: string;
  shadow: any;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' })
    this.render()
  }
  attributeChangedCallback(property:string, oldValue:string, newValue:string) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
    console.log("Setting " + property + " to new value: " + newValue);
  }
  connectedCallback() {
    this.render()
  }
  render() {
    this.shadow.innerHTML = `<div><slot></slot></div>`
  }
}

customElements.define( 'hello-app', HelloApp );
customElements.define( 'hello-item', HelloItem );
customElements.define( 'hello-table', HelloTable );
customElements.define( 'hello-row', HelloRow);
customElements.define( 'hello-cell', HelloCell);
customElements.define( 'test-header', TestHeader);

