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
  
const HelloPageTemplate = document.createElement('template')
HelloPageTemplate.innerHTML = `
<hello-item caller='Caldo'></hello-item>
`

class HelloPage extends HTMLElement {
  shadow: any;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render()
  }
  render() {
    this.innerHTML = '';
    this.shadow.append(HelloPageTemplate.content.cloneNode(true));
  }
}

export { HelloPage }

customElements.define( 'hello-page', HelloPage );
customElements.define( 'hello-item', HelloItem );
