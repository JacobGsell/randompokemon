import { c as create_ssr_component } from "../../chunks/index.js";
const app = "";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<link rel="${"stylesheet"}" href="${"/smui.css"}">

${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
