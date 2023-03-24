// tests/eventBroker.spec.ts

import {describe, expect, beforeEach, it} from '@jest/globals';
import { SubscribeEvent, UnsubscribeEvent, FireEvent } from "../src/eventBroker";

describe("AboutPage", () => {
  beforeEach(() => {
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should dispatch the right event data when fired", () => {
    let eventCopy: object = {};
    const dispatch = jest.spyOn(document, 'dispatchEvent').mockImplementation((event) => {eventCopy = event; return true;})
    let thisData = {myKey: 4};
    let thisEventName = 'testFireEventA';
    FireEvent(thisEventName, thisData)

    expect(dispatch).toHaveBeenCalled();
    expect((eventCopy as CustomEvent).detail).toEqual(thisData)
    expect((eventCopy as CustomEvent).type).toEqual(thisEventName)
  });

  it("should register an event and call the right function when fired", () => {
    let myData;
    let myEventName;
    let myCallback = jest.fn().mockImplementation((eventName, thisData) => {myEventName = eventName; myData = thisData})
    let thisEventName = 'testFireEventB';
    SubscribeEvent(thisEventName, 'myCallback', myCallback)
    let newData = {myKey: 4};
    FireEvent(thisEventName, newData)

    expect(myCallback).toHaveBeenCalled();
    expect(myData).toEqual(newData)
    expect(thisEventName).toEqual(myEventName)
  });

  it("should deregister an event", () => {
    let myData = 'foo';
    let myEventName = 'bar';
    let myCallback = jest.fn().mockImplementation((eventName, thisData) => {myEventName = eventName; myData = thisData})
    let thisEventName = 'testFireEventC';
    SubscribeEvent(thisEventName, 'myCallback', myCallback)
    UnsubscribeEvent(thisEventName, 'myCallback')
    let newData = {myKey: 4};
    FireEvent(thisEventName, newData)

    expect(myCallback).not.toHaveBeenCalled();
    expect(myData).toEqual('foo')
    expect(myEventName).toEqual('bar')
  });
});

