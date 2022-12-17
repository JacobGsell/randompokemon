import { c as create_ssr_component } from "../../chunks/index.js";
const app = "";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<link rel="${"stylesheet"}" href="${"node_modules/svelte-material-ui/bare.css"}">

  ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
