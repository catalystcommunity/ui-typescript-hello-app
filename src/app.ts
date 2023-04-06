import { RegisterRoute, RenderRoute, PushURL, UnregisterRoute } from './router.js';
import { SubscribeEvent, UnsubscribeEvent, FireEvent} from './eventBroker.js';
import { BaseComponent, OpenShadowComponent } from './componentBase.js';
// Other components to include
import './homePage.js';
import './aboutPage.js';


// The core HelloApp is just there so app changes stay in code-land, not HTML document land
// This addresses the refresh loop nicely and lets the heavier html/css changes be a separate concern
const helloAppTemplate = document.createElement('template')
helloAppTemplate.innerHTML = `
<custom-menu items='Home,About,Tables,Something Else' routes='home-page,about-page,table-experiments,something-else'></custom-menu>
<page-container page='home-page'></page-container>
`
class HelloApp extends BaseComponent {
  constructor() {
      super()
      this.append(helloAppTemplate.content.cloneNode(true));
  }
}

// Custom menu element
class CustomMenu extends OpenShadowComponent {
  menuItems: string[];
  menuRoutes: string[];
  menu: Map<string, string>;

  constructor() {
    super();
    this.changeAttributes = ['items'];
    this.styleTemplate = document.getElementById('custom-menu-styles')?.innerHTML || '';
  }

  handleClick(route: string) {
    // You don't need to use the router, this does a direct event the page-container handles
    // FireEvent('page-changed', {newPage: route})
    PushURL('/'+route)
  }
  postAttributeChange(): void {
    this.setupCore();
  }
  connectedCallback() {
    this.setupCore()
  }
  setupCore() {
    this.menuItems = (this.getAttribute('items') || '').split(',');
    this.menuRoutes = (this.getAttribute('routes') || '').split(',');
    this.menu = new Map<string, string>();
    this.menuRoutes.reduce((acc, k, i) => {acc.set(k, this.menuItems[i]); return acc}, this.menu)
    // The object version required different setting
    // this.menuRoutes.reduce((acc, k, i) => {acc[k] = this.menuItems[i]; return acc}, this.menu)
    this.render();
  }

  render() {
    let list = document.createElement('ul');

    // The for .. in syntax doesn't work on maps in all browsers yet
    this.menu.forEach((item, route) => {
      const listItem = document.createElement('li');
      listItem.innerHTML =  `<span class='menu-item'>${item.trim()}</span>`;
      listItem.addEventListener('click', () => this.handleClick(route.trim()));
      list.appendChild(listItem);
    });

    // This has to be first, because we're seting it as a string in its entirety
    this.shadow.innerHTML = this.styleTemplate || '';
    this.shadow.appendChild(list);
  }
}

class PageContainer extends OpenShadowComponent {
  page: string = 'home-page';

  constructor() {
    super();
    this.changeAttributes = ['page'];
    this.styleTemplate = document.getElementById('page-container-styles')?.innerHTML || '';
    // If you don't bind the handler, it doesn't have the correct 'this' context to update stuff
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
    SubscribeEvent('page-changed', 'page-container', this.handlePageChange)
    SubscribeEvent('url-changed', 'page-container', this.handleRouteChange)
    RegisterRoute('/', this.renderWith, ['/home-page', '/home'], true)
    RegisterRoute('/about-page', this.renderWith)
    RegisterRoute('/table-experiments', this.renderWith)
    RegisterRoute('/something-else', this.renderWith)
  }

  handlePageChange(eventName: string, data: any) {
    if (eventName !== 'page-changed') {
      throw new Error("This page change is not defined");
    }
    this.renderWith(data.path)
  }

  handleRouteChange(eventName: string, data: any) {
    if (eventName !== 'url-changed') {
      throw new Error("This route change is not defined");
    }
    this.renderWith(data.path)
  }
  renderWith(page = '/') {
    let currentPage = this.getAttribute('page')
    let newPage = page.split('/')[1]
    if (newPage === '') {
      newPage = 'home-page'
    }
    if (currentPage !== newPage) {
      this.setAttribute('page', newPage)
      this.render()
    }
  }

  render() {
    let page = this.getAttribute('page')
    console.log(`Rendering page to : ${page}`);
    this.shadow.innerHTML = this.styleTemplate || '';
    this.shadow.innerHTML += `<${page}></${page}>`;
  }
}

customElements.define('page-container', PageContainer);
customElements.define('custom-menu', CustomMenu);

customElements.define( 'hello-app', HelloApp );
