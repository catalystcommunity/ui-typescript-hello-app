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

const tableControlTemplate = document.createElement('template');
tableControlTemplate.innerHTML = `
<div>
  <div class='table-control'>
    <label>Rows: <input id='rows' type='text'></input></label>
    <label>Fields: <input id='fields' type='text'></input></label>
    <label>Strings: <input id='strings' type='text'></input></label>
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
  <div class='hello-table'>
    Hinton wanted this here.
    <table id='hello-table'>
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
    console.log('Setting ' + property + ' to new value: ' + newValue);
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
    console.log('Setting ' + property + ' to new value: ' + newValue);
    this.render()
  }
  connectedCallback() {
    this.render()
  }
  render() {
    this.shadow.innerHTML = '\n' 
    for (let i: number = 0; i < this.cells; i++){
      this.shadow.innerHTML += `<hello-cell>a cell ${ i+1 }</hello-cell>\n`
    }
  }
}
const tablePageTemplate = document.createElement('template');
tablePageTemplate.innerHTML = `
<table-control></table-control>
<test-header>Something Inner</test-header>
<table-control></table-control>
<test-header>Both controls work, because reasons</test-header>
<hello-table id='mainTable' rows='20' fields='7' strings='5'></hello-table>
`;

class TablePage extends HTMLElement {
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
    this.shadow.append(tablePageTemplate.content.cloneNode(true));
  }
}

export { TablePage }

customElements.define( 'hello-table', HelloTable );
customElements.define( 'hello-row', HelloRow);
customElements.define( 'table-control', TableControl);
