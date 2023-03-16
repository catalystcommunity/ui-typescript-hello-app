import { RegisterRoute, RenderRoute, PushURL } from './router';
import { SubscribeEvent, UnsubscribeEvent, FireEvent} from './eventBroker'


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


const helloAppTemplate = document.createElement('template')
helloAppTemplate.innerHTML = `
<custom-menu items='Home,About,Services,Contact'></custom-menu>
<page-container page='home'></page-container>
`
class HelloApp extends HTMLElement {
  shadow: any;
  constructor() {
      super()
      this.append(helloAppTemplate.content.cloneNode(true));
  }
}


// Custom menu element
class CustomMenu extends HTMLElement {
  private styleTemplate: string;
  private menuItems: string[];

  constructor() {
    super();
    this.styleTemplate = this.getAttribute('style-template') || 'custom-menu-styles';
    this.menuItems = (this.getAttribute('items') || '').split(',');
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  private handleClick(item: string) {
    console.log(`Clicked on menu item: ${item}`);
    FireEvent('page-changed', {newPage: item})
  }

  private render() {
    const template = document.getElementById(this.styleTemplate) as HTMLTemplateElement;
    const styles = template.content.cloneNode(true);
    const list = document.createElement('ul');

    this.menuItems.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.textContent = item.trim();
      listItem.addEventListener('click', () => this.handleClick(item.trim()));
      list.appendChild(listItem);
    });

    this.shadowRoot!.appendChild(styles);
    this.shadowRoot!.appendChild(list);
  }
}

class PageContainer extends HTMLElement {
  private templateName: string;

  constructor() {
    super();
    this.templateName = this.getAttribute('template-name') || 'page-container-styles';
    this.attachShadow({ mode: 'open' });
    this.render();
    this.handlePageChange = this.handlePageChange.bind(this);
    SubscribeEvent('page-changed', 'page-container', this.handlePageChange)
  }

  private handlePageChange(eventName: string, data: any) {
    if (eventName !== 'page-changed') {
      throw new Error("This page is not defined");
    }
    let newPage = data.newPage;
    this.innerHTML = `<div>${newPage}</div><${newPage}></${newPage}>`
  }

  private render() {
    const template = document.getElementById(this.templateName) as HTMLTemplateElement;
    const styles = template.content.cloneNode(true);
    const content = document.createElement('div');
    content.innerHTML = this.innerHTML;
    this.innerHTML = '';

    this.shadowRoot!.appendChild(styles);
    this.shadowRoot!.appendChild(content);
  }
}

customElements.define('page-container', PageContainer);
customElements.define('custom-menu', CustomMenu);

customElements.define( 'hello-app', HelloApp );
