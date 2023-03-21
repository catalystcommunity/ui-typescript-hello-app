import { BaseComponent } from './componentBase';

let globalCaller = 'World'

const GetCaller = () => {
  // Note that we could have a closure for encapsulating if we wanted, rather than having this be a global var
  // but we aren't, for a host of reasons including laziness, but it doesn't add to the demo when you already know you can
  return globalCaller;
};

class HelloItem extends BaseComponent {
  caller: string;
  shadow: ShadowRoot;

  constructor() {
    super();
    this.caller = globalCaller
    this.shadow = this.attachShadow({ mode: 'open' });
    this.changeAttributes = ['caller']
    this.render()
  }
  connectedCallback() {
    this.render()
  }
  render() {
    if (this.getAttribute('caller') !== '' && this.getAttribute('caller') !== globalCaller) {
      globalCaller = this.getAttribute('caller') || 'NewWorld'
    }
    this.shadow.innerHTML = `<h1>Hello ${ this.caller }!</h1>`;
  }
}
  
const HelloPageTemplate = document.createElement('template')
HelloPageTemplate.innerHTML = `
<hello-item caller='Caldo'></hello-item>
`

class HelloPage extends BaseComponent {
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

export { HelloPage, GetCaller }

customElements.define( 'hello-page', HelloPage );
customElements.define( 'hello-item', HelloItem );
