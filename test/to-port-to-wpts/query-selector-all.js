"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM } = require("../..");
const load = require("../util.js").load(__dirname);

// Tests for ParentNode's querySelectorAll
// Spec: https://dom.spec.whatwg.org/#dom-parentnode-queryselectorall

describe("query-selector-all", () => {
  test("querySelectorAll exists on document fragments", () => {
    const doc = (new JSDOM()).window.document;
    const docFrag = doc.createDocumentFragment();

    const div = doc.createElement("div");
    div.innerHTML = "<p>Hello</p>";
    docFrag.appendChild(div);

    assert.ok(docFrag.querySelectorAll, "docFrag.querySelectorAll exists");
    assert.ok(typeof docFrag.querySelectorAll === "function", "docFrag.querySelectorAll is a function");
    assert.equal(docFrag.querySelectorAll("div").length, 1, "document.querySelectorAll can find a <div> element");
    assert.equal(docFrag.querySelectorAll("p").length, 1, "document.querySelectorAll can find a <p> element");
  });

  test(
    "querySelectorAll converts its argument to a string before processing",
    () => {
      const doc = load("test");

      const elements = doc.querySelectorAll(["strong", "em"]);
      assert.ok(elements.length === 3, "document.querySelectorAll returns all instances of <strong> and <em> elements");

      const stringifiableObj = {
        toString() {
          return "p";
        }
      };
      const expectedP = doc.querySelectorAll(stringifiableObj);
      assert.ok(expectedP.length === 1, "document.querySelectorAll calls toString on any given object");
    }
  );
});
