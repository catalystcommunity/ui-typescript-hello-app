import { RegisterRoute, RenderRoute, PushURL } from "./router";

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

interface subscriptionCallback {
  (eventName: string, data: object | string | Array<any>): void;
}

let events = {}
function subscribeEvent(eventName: string, subscriber: string, callback:subscriptionCallback) {
  let handler = (e: any) => {
    callback(eventName, e.detail)
  }
  if (events[eventName] === undefined || events[eventName] === null) {
    events[eventName] = {}
  }
  events[eventName][subscriber] = handler
  document.addEventListener(eventName, handler)
}

function unsubscribeEvent(eventName: string, subscriber: string) :boolean {
  let callback = events[eventName]?.[subscriber];
  if (callback) {
    document.removeEventListener(eventName, callback)
    delete events[eventName][subscriber]
    return true
  }
  return false
}

function fireEvent(eventName: string, data: object) {
  document.dispatchEvent(new CustomEvent(eventName, {detail: data}))
}

function addListeners(num: number){
  for(let i = 0; i < num; i++){
    let listener = (eventName: string, foo: any) => {
      // If all is well, no console.log, which is good because that's slow
      if(eventName != 'amazingEvent') {
        console.log(eventName)
      }
      if (foo.foo != 'bar') {
        console.log(foo.foo)
      }
    }
    subscribeEvent('amazingEvent', 'i:'+i, listener)
  }
}

function removeListeners(num: number){
  for(let i = 1; i < num; i++){
    unsubscribeEvent('amazingEvent', 'i:'+i)
  }
  // Unsubscribe the same (first) event 4 times, it should be fine
  unsubscribeEvent('amazingEvent', 'i:'+0)
  unsubscribeEvent('amazingEvent', 'i:'+0)
  unsubscribeEvent('amazingEvent', 'i:'+0)
  let result = unsubscribeEvent('amazingEvent', 'i:'+0)
  if (result) {
    // this will never be seen
    console.log('for some reason it succeeded removing the handler again')
  }
}
function nowString(): string {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return mm + '/' + dd + '/' + yyyy + " @ " + today.getHours() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
}

function testEvents() {
  console.log('adding listeners', nowString())
  addListeners(40000);
  console.log('firing event', nowString())
  fireEvent("amazingEvent",{foo: 'bar'}) 
  console.log('removing listeners', nowString())
  removeListeners(3);
  console.log('firing event', nowString())
  fireEvent("amazingEvent",{foo: 'bar'}) 
  console.log('finished event', nowString())
}
testEvents()

function createLists(rows: number, fields: number, strings: number): Array<Array<any>> {
  let retVal: Array<Array<any>> = [];
  for(let i = 0; i < rows; i++){
    let row: Array<any> = [];
    let k = 0;
    for(let j = 0; j < fields; j++){
      if (k < strings) {
        row.push(`String ${i},${j}`);
        k++;
        continue;
      }
      row.push(i*j);
    }
    retVal.push(row)
  }
  return retVal;
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
<table-control></table-control>
<test-header>Something Inner</test-header>
<table-control></table-control>
<test-header>Both controls work, because reasons</test-header>
<hello-table id="mainTable" rows="20" fields="7" strings="5"></hello-table>
`
class HelloApp extends HTMLElement {
  shadow: any;
  constructor() {
    super()
    this.append(helloAppTemplate.content.cloneNode(true));
  }
}

const tableControlTemplate = document.createElement('template');
tableControlTemplate.innerHTML = `
<div>
  <div class="table-control">
    <label>Rows: <input id="rows" type="text"></input></label>
    <label>Fields: <input id="fields" type="text"></input></label>
    <label>Strings: <input id="strings" type="text"></input></label>
  </div>
</div>
<style>
  .table-control{
    border: 1px solid black;
  }
</style>
`;

class TableControl extends HTMLElement {
  shadow: any;
  rows: number;
  fields: number;
  strings: number;

  constructor() {
    super();
    this.rows = 10;
    this.fields = 5;
    this.strings = 2;
    // this.shadow = this.attachShadow({ mode: 'open' });
    this.handleChange = this.handleChange.bind(this);
  }
  connectedCallback() {
    this.render()
  }
  render() {
    this.innerHTML = '';
    this.append(tableControlTemplate.content.cloneNode(true));
    let rows: HTMLInputElement|null = (<HTMLInputElement>this.querySelector('#rows'));
    rows.value = String(this.rows);
    rows.addEventListener('change', this.handleChange);
    let fields: HTMLInputElement|null = (<HTMLInputElement>this.querySelector('#fields'));
    fields.value = String(this.fields);
    fields.addEventListener('change', this.handleChange);
    let strings: HTMLInputElement|null = (<HTMLInputElement>this.querySelector('#strings'));
    strings.value = String(this.strings);
    strings.addEventListener('change', this.handleChange);
  }

  handleChange() {
    this.rows = parseInt((<HTMLInputElement>this.querySelector('#rows')).value) || this.rows
    this.fields = parseInt((<HTMLInputElement>this.querySelector('#fields')).value) || this.fields
    this.strings = parseInt((<HTMLInputElement>this.querySelector('#strings')).value) || this.strings
    let table = document.querySelector('#mainTable');
    table?.setAttribute('rows', String(this.rows));
    table?.setAttribute('fields', String(this.fields));
    table?.setAttribute('strings', String(this.strings));
  }
}

const helloTableTemplate = document.createElement('template')
helloTableTemplate.innerHTML = `
<div>
  <div class="hello-table">
    Hinton wanted this here.
    <table id="hello-table">
    </table>
  </div>
</div>
<style>
  .hello-table {
    border: 1px solid black;
  }
  #hello-table{
    border: 1px solid red;
    width: 80%;
    display: block;
  }
  #hello-table tr{
    border: 1px solid blue;
    width: 100%;
  } 
  #hello-table tr td{
    border: 1px solid green;
  }
</style>
`;

class HelloTable extends HTMLElement {
  shadow: any;
  rows: number;
  fields: number;
  strings: number;

  constructor() {
    super();
    this.rows = 10;
    this.fields = 5;
    this.strings = 2;
    // this.shadow = this.attachShadow({ mode: 'open' });
  }
  static get observedAttributes() {
    return ['rows', 'fields', 'strings'];
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
    this.innerHTML = '';
    this.append(helloTableTemplate.content.cloneNode(true));
    let table: Element|null = this.querySelector('#hello-table');
    if (table != null){
      let data = createLists(this.rows, this.fields, this.strings);
      for(let row of data){
        let tr = table.appendChild(document.createElement('tr'));
        for(let field of row){
          let td = tr.appendChild(document.createElement('td'));
          td.innerText = field;
        }
      }
    }
  }
}

class HelloRow extends HTMLElement {
  cells: number;
  shadow: any;

  constructor() {
    super();
    this.cells = 3;
    this.shadow = this.attachShadow({ mode: 'open' });
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

customElements.define( 'hello-app', HelloApp );
customElements.define( 'hello-item', HelloItem );
customElements.define( 'hello-table', HelloTable );
customElements.define( 'hello-row', HelloRow);
customElements.define( 'table-control', TableControl);

