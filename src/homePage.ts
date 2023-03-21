import { BaseComponent, OpenShadowComponent } from './componentBase';

class HomePage extends BaseComponent {
  constructor() {
    super()
    this.styleTemplate = document.getElementById('home-page-styles')?.innerHTML || '';
    this.componentTemplate = document.getElementById('home-page-template')?.innerHTML || '';
    this.innerHTML = this.styleTemplate || '';
    this.innerHTML += this.componentTemplate || '';
  }
}

customElements.define( 'home-page', HomePage );