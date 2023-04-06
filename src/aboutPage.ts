import { BaseComponent, OpenShadowComponent } from './componentBase.js';
import { GetCaller } from './helloPage.js'

class AboutPage extends OpenShadowComponent {
  constructor() {
    super()
    this.styleTemplate = document.getElementById('about-page-styles')?.innerHTML || '';
    this.componentTemplate = document.getElementById('about-page-template')?.innerHTML || '';
    this.shadow.innerHTML = this.styleTemplate || '';
    this.shadow.innerHTML += this.componentTemplate || '';
    this.shadow.getElementById('about-name')!.innerText = GetCaller()
  }
}

customElements.define( 'about-page', AboutPage );

export {AboutPage}
