interface subscriptionCallback {
  (eventName: string, data: object | string | Array<any>): void;
}

let events = {}
function SubscribeEvent(eventName: string, subscriber: string, callback:subscriptionCallback) {
  let handler = (e: any) => {
    callback(eventName, e.detail)
  }
  if (events[eventName] === undefined || events[eventName] === null) {
    events[eventName] = {}
  }
  events[eventName][subscriber] = handler
  document.addEventListener(eventName, handler)
}

function UnsubscribeEvent(eventName: string, subscriber: string) :boolean {
  let callback = events[eventName]?.[subscriber];
  if (callback) {
    document.removeEventListener(eventName, callback)
    delete events[eventName][subscriber]
    return true
  }
  return false
}

function FireEvent(eventName: string, data: object) {
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
    SubscribeEvent('amazingEvent', 'i:'+i, listener)
  }
}

function removeListeners(num: number){
  for(let i = 1; i < num; i++){
    UnsubscribeEvent('amazingEvent', 'i:'+i)
  }
  // Unsubscribe the same (first) event 4 times, it should be fine
  UnsubscribeEvent('amazingEvent', 'i:'+0)
  UnsubscribeEvent('amazingEvent', 'i:'+0)
  UnsubscribeEvent('amazingEvent', 'i:'+0)
  let result = UnsubscribeEvent('amazingEvent', 'i:'+0)
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

  return mm + '/' + dd + '/' + yyyy + ' @ ' + today.getHours() + ':' + today.getSeconds() + ':' + today.getMilliseconds();
}

function testEvents() {
  console.log('adding listeners', nowString())
  addListeners(40000);
  console.log('firing event', nowString())
  FireEvent('amazingEvent',{foo: 'bar'}) 
  console.log('removing listeners', nowString())
  removeListeners(3);
  console.log('firing event', nowString())
  FireEvent('amazingEvent',{foo: 'bar'}) 
  console.log('finished event', nowString())
}
// testEvents()

export {SubscribeEvent, FireEvent, UnsubscribeEvent }
