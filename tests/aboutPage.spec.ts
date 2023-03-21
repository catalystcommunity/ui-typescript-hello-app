// tests/aboutPage.spec.ts

import {describe, expect, test, beforeEach, it} from '@jest/globals';
import { AboutPage } from "../src/aboutPage";
import { GetCaller } from '../src/helloPage';
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../static/index.html'), 'utf8');

jest.dontMock('fs');

describe("AboutPage", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("should initialize correctly", () => {
    const about = new AboutPage();
    expect(about).toBeInstanceOf(AboutPage);
  });

  it("should have an about-name", () => {
    const about = new AboutPage();
    const nameSpan = about.shadow!.getElementById("about-name");
    expect(nameSpan).not.toBeNull();
  });

  it("should have the right caller info", () => {
    const about = new AboutPage();
    const nameSpan = about.shadow!.getElementById("about-name");
    expect(nameSpan?.innerText).toEqual(GetCaller());
  });
});

