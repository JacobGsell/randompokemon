import { l as listen, d as bubble, p as prevent_default, f as stop_propagation, c as create_ssr_component, h as compute_rest_props, i as get_current_component, j as spread, k as escape_attribute_value, o as escape_object, q as add_attribute, r as is_void, b as subscribe, s as setContext, t as onDestroy, u as set_store_value, g as getContext, v as validate_component, w as globals, m as missing_component, x as each, y as tick, e as escape, z as is_promise, n as noop } from "../../chunks/index.js";
import { w as writable, r as readable } from "../../chunks/index2.js";
import { MDCRippleFoundation, util } from "@material/ripple";
import { events, ponyfill } from "@material/dom";
function classMap(classObj) {
  return Object.entries(classObj).filter(([name, value]) => name !== "" && value).map(([name]) => name).join(" ");
}
function dispatch(element, eventType, detail, eventInit = { bubbles: true }, duplicateEventForMDC = false) {
  if (typeof Event !== "undefined" && element) {
    const event = new CustomEvent(eventType, Object.assign(Object.assign({}, eventInit), { detail }));
    element === null || element === void 0 ? void 0 : element.dispatchEvent(event);
    if (duplicateEventForMDC && eventType.startsWith("SMUI")) {
      const duplicateEvent = new CustomEvent(eventType.replace(/^SMUI/g, () => "MDC"), Object.assign(Object.assign({}, eventInit), { detail }));
      element === null || element === void 0 ? void 0 : element.dispatchEvent(duplicateEvent);
      if (duplicateEvent.defaultPrevented) {
        event.preventDefault();
      }
    }
    return event;
  }
}
function exclude(obj, keys) {
  let names = Object.getOwnPropertyNames(obj);
  const newObj = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const cashIndex = name.indexOf("$");
    if (cashIndex !== -1 && keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
      continue;
    }
    if (keys.indexOf(name) !== -1) {
      continue;
    }
    newObj[name] = obj[name];
  }
  return newObj;
}
const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
function forwardEventsBuilder(component) {
  let $on;
  let events2 = [];
  component.$on = (fullEventType, callback) => {
    let eventType = fullEventType;
    let destructor = () => {
    };
    if ($on) {
      destructor = $on(eventType, callback);
    } else {
      events2.push([eventType, callback]);
    }
    const oldModifierMatch = eventType.match(oldModifierRegex);
    if (oldModifierMatch && console) {
      console.warn('Event modifiers in SMUI now use "$" instead of ":", so that all events can be bound with modifiers. Please update your event binding: ', eventType);
    }
    return () => {
      destructor();
    };
  };
  function forward(e) {
    bubble(component, e);
  }
  return (node) => {
    const destructors = [];
    const forwardDestructors = {};
    $on = (fullEventType, callback) => {
      let eventType = fullEventType;
      let handler = callback;
      let options = false;
      const oldModifierMatch = eventType.match(oldModifierRegex);
      const newModifierMatch = eventType.match(newModifierRegex);
      const modifierMatch = oldModifierMatch || newModifierMatch;
      if (eventType.match(/^SMUI:\w+:/)) {
        const newEventTypeParts = eventType.split(":");
        let newEventType = "";
        for (let i = 0; i < newEventTypeParts.length; i++) {
          newEventType += i === newEventTypeParts.length - 1 ? ":" + newEventTypeParts[i] : newEventTypeParts[i].split("-").map((value) => value.slice(0, 1).toUpperCase() + value.slice(1)).join("");
        }
        console.warn(`The event ${eventType.split("$")[0]} has been renamed to ${newEventType.split("$")[0]}.`);
        eventType = newEventType;
      }
      if (modifierMatch) {
        const parts = eventType.split(oldModifierMatch ? ":" : "$");
        eventType = parts[0];
        const eventOptions = parts.slice(1).reduce((obj, mod) => {
          obj[mod] = true;
          return obj;
        }, {});
        if (eventOptions.passive) {
          options = options || {};
          options.passive = true;
        }
        if (eventOptions.nonpassive) {
          options = options || {};
          options.passive = false;
        }
        if (eventOptions.capture) {
          options = options || {};
          options.capture = true;
        }
        if (eventOptions.once) {
          options = options || {};
          options.once = true;
        }
        if (eventOptions.preventDefault) {
          handler = prevent_default(handler);
        }
        if (eventOptions.stopPropagation) {
          handler = stop_propagation(handler);
        }
      }
      const off = listen(node, eventType, handler, options);
      const destructor = () => {
        off();
        const idx = destructors.indexOf(destructor);
        if (idx > -1) {
          destructors.splice(idx, 1);
        }
      };
      destructors.push(destructor);
      if (!(eventType in forwardDestructors)) {
        forwardDestructors[eventType] = listen(node, eventType, forward);
      }
      return destructor;
    };
    for (let i = 0; i < events2.length; i++) {
      $on(events2[i][0], events2[i][1]);
    }
    return {
      destroy: () => {
        for (let i = 0; i < destructors.length; i++) {
          destructors[i]();
        }
        for (let entry of Object.entries(forwardDestructors)) {
          entry[1]();
        }
      }
    };
  };
}
function prefixFilter(obj, prefix) {
  let names = Object.getOwnPropertyNames(obj);
  const newObj = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (name.substring(0, prefix.length) === prefix) {
      newObj[name.substring(prefix.length)] = obj[name];
    }
  }
  return newObj;
}
const Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "variant", "padded", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { variant = "raised" } = $$props;
  let { padded = false } = $$props;
  let element;
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.padded === void 0 && $$bindings.padded && padded !== void 0)
    $$bindings.padded(padded);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-card": true,
          "mdc-card--outlined": variant === "outlined",
          "smui-card--padded": padded
        }))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}
</div>`;
});
const SmuiElement = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selfClosing;
  let $$restProps = compute_rest_props($$props, ["use", "tag", "getElement"]);
  let { use = [] } = $$props;
  let { tag } = $$props;
  forwardEventsBuilder(get_current_component());
  let element;
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  selfClosing = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ].indexOf(tag) > -1;
  return `${selfClosing ? `${((tag$1) => {
    return tag$1 ? `<${tag}${spread([escape_object($$restProps)], {})}${add_attribute("this", element, 0)}>${is_void(tag$1) ? "" : ``}${is_void(tag$1) ? "" : `</${tag$1}>`}` : "";
  })(tag)}` : `${((tag$1) => {
    return tag$1 ? `<${tag}${spread([escape_object($$restProps)], {})}${add_attribute("this", element, 0)}>${is_void(tag$1) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag$1) ? "" : `</${tag$1}>`}` : "";
  })(tag)}`}`;
});
const ContextFragment = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $storeValue, $$unsubscribe_storeValue;
  let { key } = $$props;
  let { value } = $$props;
  const storeValue = writable(value);
  $$unsubscribe_storeValue = subscribe(storeValue, (value2) => $storeValue = value2);
  setContext(key, storeValue);
  onDestroy(() => {
    storeValue.set(void 0);
  });
  if ($$props.key === void 0 && $$bindings.key && key !== void 0)
    $$bindings.key(key);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  set_store_value(storeValue, $storeValue = value, $storeValue);
  $$unsubscribe_storeValue();
  return `${slots.default ? slots.default({}) : ``}`;
});
const { Object: Object_1$1 } = globals;
const internals = {
  component: SmuiElement,
  tag: "div",
  class: "",
  classMap: {},
  contexts: {},
  props: {}
};
const ClassAdder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "component", "tag", "getElement"]);
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let element;
  const smuiClass = internals.class;
  const smuiClassMap = {};
  const smuiClassUnsubscribes = [];
  const contexts = internals.contexts;
  const props = internals.props;
  let { component = internals.component } = $$props;
  let { tag = component === SmuiElement ? internals.tag : void 0 } = $$props;
  Object.entries(internals.classMap).forEach(([name, context]) => {
    const store = getContext(context);
    if (store && "subscribe" in store) {
      smuiClassUnsubscribes.push(store.subscribe((value) => {
        smuiClassMap[name] = value;
      }));
    }
  });
  const forwardEvents = forwardEventsBuilder(get_current_component());
  for (let context in contexts) {
    if (contexts.hasOwnProperty(context)) {
      setContext(context, contexts[context]);
    }
  }
  onDestroy(() => {
    for (const unsubscribe of smuiClassUnsubscribes) {
      unsubscribe();
    }
  });
  function getElement() {
    return element.getElement();
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(component || missing_component, "svelte:component").$$render(
      $$result,
      Object_1$1.assign(
        { tag },
        { use: [forwardEvents, ...use] },
        {
          class: classMap({
            [className]: true,
            [smuiClass]: true,
            ...smuiClassMap
          })
        },
        props,
        $$restProps,
        { this: element }
      ),
      {
        this: ($$value) => {
          element = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const defaults = Object.assign({}, internals);
function classAdderBuilder(props) {
  return new Proxy(ClassAdder, {
    construct: function(target, args) {
      Object.assign(internals, defaults, props);
      return new target(...args);
    },
    get: function(target, prop) {
      Object.assign(internals, defaults, props);
      return target[prop];
    }
  });
}
const Content = classAdderBuilder({
  class: "smui-card__content",
  tag: "div"
});
const { applyPassive } = events;
const { matches } = ponyfill;
function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve() } = {}) {
  let instance;
  let addLayoutListener = getContext("SMUI:addLayoutListener");
  let removeLayoutListener;
  let oldActive = active;
  let oldEventTarget = eventTarget;
  let oldActiveTarget = activeTarget;
  function handleProps() {
    if (surface) {
      addClass("mdc-ripple-surface");
      if (color === "primary") {
        addClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      } else if (color === "secondary") {
        removeClass("smui-ripple-surface--primary");
        addClass("smui-ripple-surface--secondary");
      } else {
        removeClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      }
    } else {
      removeClass("mdc-ripple-surface");
      removeClass("smui-ripple-surface--primary");
      removeClass("smui-ripple-surface--secondary");
    }
    if (instance && oldActive !== active) {
      oldActive = active;
      if (active) {
        instance.activate();
      } else if (active === false) {
        instance.deactivate();
      }
    }
    if (ripple && !instance) {
      instance = new MDCRippleFoundation({
        addClass,
        browserSupportsCssVars: () => util.supportsCssVariables(window),
        computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
        containsEventTarget: (target) => node.contains(target),
        deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
        deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
        deregisterResizeHandler: (handler) => window.removeEventListener("resize", handler),
        getWindowPageOffset: () => ({
          x: window.pageXOffset,
          y: window.pageYOffset
        }),
        isSurfaceActive: () => active == null ? matches(activeTarget || node, ":active") : active,
        isSurfaceDisabled: () => !!disabled,
        isUnbounded: () => !!unbounded,
        registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
        registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
        registerResizeHandler: (handler) => window.addEventListener("resize", handler),
        removeClass,
        updateCssVariable: addStyle
      });
      initPromise.then(() => {
        if (instance) {
          instance.init();
          instance.setUnbounded(unbounded);
        }
      });
    } else if (instance && !ripple) {
      initPromise.then(() => {
        if (instance) {
          instance.destroy();
          instance = void 0;
        }
      });
    }
    if (instance && (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
      oldEventTarget = eventTarget;
      oldActiveTarget = activeTarget;
      instance.destroy();
      requestAnimationFrame(() => {
        if (instance) {
          instance.init();
          instance.setUnbounded(unbounded);
        }
      });
    }
    if (!ripple && unbounded) {
      addClass("mdc-ripple-upgraded--unbounded");
    }
  }
  handleProps();
  if (addLayoutListener) {
    removeLayoutListener = addLayoutListener(layout);
  }
  function layout() {
    if (instance) {
      instance.layout();
    }
  }
  return {
    update(props) {
      ({
        ripple,
        surface,
        unbounded,
        disabled,
        color,
        active,
        rippleElement,
        eventTarget,
        activeTarget,
        addClass,
        removeClass,
        addStyle,
        initPromise
      } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: void 0, active: void 0, rippleElement: void 0, eventTarget: void 0, activeTarget: void 0, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
      handleProps();
    },
    destroy() {
      if (instance) {
        instance.destroy();
        instance = void 0;
        removeClass("mdc-ripple-surface");
        removeClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      }
      if (removeLayoutListener) {
        removeLayoutListener();
      }
    }
  };
}
const Media = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "aspectRatio", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { aspectRatio = void 0 } = $$props;
  let element;
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.aspectRatio === void 0 && $$bindings.aspectRatio && aspectRatio !== void 0)
    $$bindings.aspectRatio(aspectRatio);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-card__media": true,
          "mdc-card__media--square": aspectRatio === "square",
          "mdc-card__media--16-9": aspectRatio === "16x9"
        }))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}
</div>`;
});
const MediaContent = classAdderBuilder({
  class: "mdc-card__media-content",
  tag: "div"
});
classAdderBuilder({
  class: "mdc-card__action-buttons",
  tag: "div"
});
classAdderBuilder({
  class: "mdc-card__action-icons",
  tag: "div"
});
const { Object: Object_1 } = globals;
const Chip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "chip",
    "ripple",
    "touch",
    "shouldRemoveOnTrailingIconClick",
    "shouldFocusPrimaryActionOnClick",
    "component",
    "tag",
    "getElement"
  ]);
  let $index, $$unsubscribe_index;
  let $choice, $$unsubscribe_choice;
  let $leadingIconClassesStore, $$unsubscribe_leadingIconClassesStore;
  let $isSelectedStore, $$unsubscribe_isSelectedStore;
  let $shouldRemoveOnTrailingIconClickStore, $$unsubscribe_shouldRemoveOnTrailingIconClickStore;
  let $initialSelectedStore, $$unsubscribe_initialSelectedStore;
  let $nonInteractive, $$unsubscribe_nonInteractive;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { chip: chipId } = $$props;
  let { ripple = true } = $$props;
  let { touch = false } = $$props;
  let { shouldRemoveOnTrailingIconClick = true } = $$props;
  let { shouldFocusPrimaryActionOnClick = true } = $$props;
  let element;
  let internalClasses = {};
  let leadingIconClasses = {};
  let internalStyles = {};
  const initialSelectedStore = getContext("SMUI:chips:chip:initialSelected");
  $$unsubscribe_initialSelectedStore = subscribe(initialSelectedStore, (value) => $initialSelectedStore = value);
  let selected = $initialSelectedStore;
  const nonInteractive = getContext("SMUI:chips:nonInteractive");
  $$unsubscribe_nonInteractive = subscribe(nonInteractive, (value) => $nonInteractive = value);
  const choice = getContext("SMUI:chips:choice");
  $$unsubscribe_choice = subscribe(choice, (value) => $choice = value);
  const index = getContext("SMUI:chips:chip:index");
  $$unsubscribe_index = subscribe(index, (value) => $index = value);
  let { component = SmuiElement } = $$props;
  let { tag = component === SmuiElement ? "div" : void 0 } = $$props;
  const shouldRemoveOnTrailingIconClickStore = writable(shouldRemoveOnTrailingIconClick);
  $$unsubscribe_shouldRemoveOnTrailingIconClickStore = subscribe(shouldRemoveOnTrailingIconClickStore, (value) => $shouldRemoveOnTrailingIconClickStore = value);
  setContext("SMUI:chips:chip:shouldRemoveOnTrailingIconClick", shouldRemoveOnTrailingIconClickStore);
  const isSelectedStore = writable(selected);
  $$unsubscribe_isSelectedStore = subscribe(isSelectedStore, (value) => $isSelectedStore = value);
  setContext("SMUI:chips:chip:isSelected", isSelectedStore);
  const leadingIconClassesStore = writable(leadingIconClasses);
  $$unsubscribe_leadingIconClassesStore = subscribe(leadingIconClassesStore, (value) => $leadingIconClassesStore = value);
  setContext("SMUI:chips:chip:leadingIconClasses", leadingIconClassesStore);
  setContext("SMUI:chips:chip:focusable", $choice && selected || $index === 0);
  if (!chipId) {
    throw new Error("The chip property is required! It should be passed down from the Set to the Chip.");
  }
  function addClass(className2) {
    if (!internalClasses[className2]) {
      internalClasses[className2] = true;
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      internalClasses[className2] = false;
    }
  }
  function addStyle(name, value) {
    if (internalStyles[name] != value) {
      if (value === "" || value == null) {
        delete internalStyles[name];
        internalStyles = internalStyles;
      } else {
        internalStyles[name] = value;
      }
    }
  }
  function getElement() {
    return element.getElement();
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.chip === void 0 && $$bindings.chip && chipId !== void 0)
    $$bindings.chip(chipId);
  if ($$props.ripple === void 0 && $$bindings.ripple && ripple !== void 0)
    $$bindings.ripple(ripple);
  if ($$props.touch === void 0 && $$bindings.touch && touch !== void 0)
    $$bindings.touch(touch);
  if ($$props.shouldRemoveOnTrailingIconClick === void 0 && $$bindings.shouldRemoveOnTrailingIconClick && shouldRemoveOnTrailingIconClick !== void 0)
    $$bindings.shouldRemoveOnTrailingIconClick(shouldRemoveOnTrailingIconClick);
  if ($$props.shouldFocusPrimaryActionOnClick === void 0 && $$bindings.shouldFocusPrimaryActionOnClick && shouldFocusPrimaryActionOnClick !== void 0)
    $$bindings.shouldFocusPrimaryActionOnClick(shouldFocusPrimaryActionOnClick);
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    set_store_value(shouldRemoveOnTrailingIconClickStore, $shouldRemoveOnTrailingIconClickStore = shouldRemoveOnTrailingIconClick, $shouldRemoveOnTrailingIconClickStore);
    set_store_value(isSelectedStore, $isSelectedStore = selected, $isSelectedStore);
    set_store_value(leadingIconClassesStore, $leadingIconClassesStore = leadingIconClasses, $leadingIconClassesStore);
    $$rendered = `${validate_component(component || missing_component, "svelte:component").$$render(
      $$result,
      Object_1.assign(
        { tag },
        {
          use: [
            [
              Ripple,
              {
                ripple: ripple && !$nonInteractive,
                unbounded: false,
                addClass,
                removeClass,
                addStyle
              }
            ],
            forwardEvents,
            ...use
          ]
        },
        {
          class: classMap({
            [className]: true,
            "mdc-chip": true,
            "mdc-chip--selected": selected,
            "mdc-chip--touch": touch,
            ...internalClasses
          })
        },
        {
          style: Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" ")
        },
        { role: "row" },
        $$restProps,
        { this: element }
      ),
      {
        this: ($$value) => {
          element = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${ripple && !$nonInteractive ? `<div class="${"mdc-chip__ripple"}"></div>` : ``}
  ${slots.default ? slots.default({}) : ``}
  ${touch ? `<div class="${"mdc-chip__touch"}"></div>` : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_index();
  $$unsubscribe_choice();
  $$unsubscribe_leadingIconClassesStore();
  $$unsubscribe_isSelectedStore();
  $$unsubscribe_shouldRemoveOnTrailingIconClickStore();
  $$unsubscribe_initialSelectedStore();
  $$unsubscribe_nonInteractive();
  return $$rendered;
});
const Set_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "chips",
    "key",
    "selected",
    "nonInteractive",
    "choice",
    "filter",
    "input",
    "getElement"
  ]);
  let $filterStore, $$unsubscribe_filterStore;
  let $choiceStore, $$unsubscribe_choiceStore;
  let $nonInteractiveStore, $$unsubscribe_nonInteractiveStore;
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { chips = [] } = $$props;
  let { key = (chip) => chip } = $$props;
  let { selected = void 0 } = $$props;
  let { nonInteractive = false } = $$props;
  let { choice = false } = $$props;
  let { filter = false } = $$props;
  let { input = false } = $$props;
  let element;
  let initialSelected = chips.map((chipId) => choice && selected === chipId || filter && selected.indexOf(chipId) !== -1);
  const nonInteractiveStore = writable(nonInteractive);
  $$unsubscribe_nonInteractiveStore = subscribe(nonInteractiveStore, (value) => $nonInteractiveStore = value);
  setContext("SMUI:chips:nonInteractive", nonInteractiveStore);
  const choiceStore = writable(choice);
  $$unsubscribe_choiceStore = subscribe(choiceStore, (value) => $choiceStore = value);
  setContext("SMUI:chips:choice", choiceStore);
  const filterStore = writable(filter);
  $$unsubscribe_filterStore = subscribe(filterStore, (value) => $filterStore = value);
  setContext("SMUI:chips:filter", filterStore);
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.chips === void 0 && $$bindings.chips && chips !== void 0)
    $$bindings.chips(chips);
  if ($$props.key === void 0 && $$bindings.key && key !== void 0)
    $$bindings.key(key);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.nonInteractive === void 0 && $$bindings.nonInteractive && nonInteractive !== void 0)
    $$bindings.nonInteractive(nonInteractive);
  if ($$props.choice === void 0 && $$bindings.choice && choice !== void 0)
    $$bindings.choice(choice);
  if ($$props.filter === void 0 && $$bindings.filter && filter !== void 0)
    $$bindings.filter(filter);
  if ($$props.input === void 0 && $$bindings.input && input !== void 0)
    $$bindings.input(input);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  set_store_value(nonInteractiveStore, $nonInteractiveStore = nonInteractive, $nonInteractiveStore);
  set_store_value(choiceStore, $choiceStore = choice, $choiceStore);
  set_store_value(filterStore, $filterStore = filter, $filterStore);
  $$unsubscribe_filterStore();
  $$unsubscribe_choiceStore();
  $$unsubscribe_nonInteractiveStore();
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-chip-set": true,
          "smui-chip-set--non-interactive": nonInteractive,
          "mdc-chip-set--choice": choice,
          "mdc-chip-set--filter": filter,
          "mdc-chip-set--input": input
        }))
      },
      { role: "grid" },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${each(chips, (chip, i) => {
    return `${validate_component(ContextFragment, "ContextFragment").$$render($$result, { key: "SMUI:chips:chip:index", value: i }, {}, {
      default: () => {
        return `${validate_component(ContextFragment, "ContextFragment").$$render(
          $$result,
          {
            key: "SMUI:chips:chip:initialSelected",
            value: initialSelected[i]
          },
          {},
          {
            default: () => {
              return `${slots.default ? slots.default({ chip }) : ``}
      `;
            }
          }
        )}
    `;
      }
    })}`;
  })}
</div>`;
});
const Checkmark = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "getElement"]);
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let element;
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<span${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-chip__checkmark": true
        }))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}><svg class="${"mdc-chip__checkmark-svg"}" viewBox="${"-2 -3 30 30"}"><path class="${"mdc-chip__checkmark-path"}" fill="${"none"}" stroke="${"black"}" d="${"M1.73,12.91 8.1,19.28 22.79,4.59"}"></path></svg>
</span>`;
});
const Text = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "tabindex", "focus", "getInput", "getElement"]);
  let $filter, $$unsubscribe_filter;
  let $nonInteractive, $$unsubscribe_nonInteractive;
  let $choice, $$unsubscribe_choice;
  let $isSelected, $$unsubscribe_isSelected;
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { tabindex = getContext("SMUI:chips:chip:focusable") ? 0 : -1 } = $$props;
  let element;
  let input = void 0;
  let primaryAction = void 0;
  let internalAttrs = {};
  const nonInteractive = getContext("SMUI:chips:nonInteractive");
  $$unsubscribe_nonInteractive = subscribe(nonInteractive, (value) => $nonInteractive = value);
  const choice = getContext("SMUI:chips:choice");
  $$unsubscribe_choice = subscribe(choice, (value) => $choice = value);
  const filter = getContext("SMUI:chips:filter");
  $$unsubscribe_filter = subscribe(filter, (value) => $filter = value);
  const isSelected = getContext("SMUI:chips:chip:isSelected");
  $$unsubscribe_isSelected = subscribe(isSelected, (value) => $isSelected = value);
  function waitForTabindex(fn) {
    if (internalAttrs["tabindex"] !== element.getAttribute("tabindex")) {
      tick().then(fn);
    } else {
      fn();
    }
  }
  function focus() {
    waitForTabindex(() => {
    });
  }
  function getInput() {
    return input && input.getElement();
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.tabindex === void 0 && $$bindings.tabindex && tabindex !== void 0)
    $$bindings.tabindex(tabindex);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.getInput === void 0 && $$bindings.getInput && getInput !== void 0)
    $$bindings.getInput(getInput);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${$filter ? `${validate_component(Checkmark, "Checkmark").$$render(
      $$result,
      { this: input },
      {
        this: ($$value) => {
          input = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : ``}
<span role="${"gridcell"}"${add_attribute("this", element, 0)}>${$nonInteractive ? `<span class="${"mdc-chip__text"}">${slots.default ? slots.default({}) : ``}</span>` : `<span${spread(
      [
        {
          class: escape_attribute_value(classMap({
            [className]: true,
            "mdc-chip__primary-action": true
          }))
        },
        {
          role: escape_attribute_value($filter ? "checkbox" : $choice ? "radio" : "button")
        },
        escape_object($filter || $choice ? {
          "aria-selected": $isSelected ? "true" : "false"
        } : {}),
        {
          tabindex: escape_attribute_value(tabindex)
        },
        escape_object(internalAttrs),
        escape_object($$restProps)
      ],
      {}
    )}${add_attribute("this", primaryAction, 0)}><span class="${"mdc-chip__text"}">${slots.default ? slots.default({}) : ``}</span></span>`}
</span>`;
  } while (!$$settled);
  $$unsubscribe_filter();
  $$unsubscribe_nonInteractive();
  $$unsubscribe_choice();
  $$unsubscribe_isSelected();
  return $$rendered;
});
const CircularProgress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "indeterminate", "closed", "progress", "fourColor", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { indeterminate = false } = $$props;
  let { closed = false } = $$props;
  let { progress = 0 } = $$props;
  let { fourColor = false } = $$props;
  let element;
  let internalClasses = {};
  let internalAttrs = {};
  let determinateCircleAttrs = {};
  let determinateCircle;
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.indeterminate === void 0 && $$bindings.indeterminate && indeterminate !== void 0)
    $$bindings.indeterminate(indeterminate);
  if ($$props.closed === void 0 && $$bindings.closed && closed !== void 0)
    $$bindings.closed(closed);
  if ($$props.progress === void 0 && $$bindings.progress && progress !== void 0)
    $$bindings.progress(progress);
  if ($$props.fourColor === void 0 && $$bindings.fourColor && fourColor !== void 0)
    $$bindings.fourColor(fourColor);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-circular-progress": true,
          "mdc-circular-progress--indeterminate": indeterminate,
          "mdc-circular-progress--closed": closed,
          ...internalClasses
        }))
      },
      { role: "progressbar" },
      {
        "aria-valuemin": escape_attribute_value(0)
      },
      {
        "aria-valuemax": escape_attribute_value(1)
      },
      {
        "aria-valuenow": escape_attribute_value(indeterminate ? void 0 : progress)
      },
      escape_object(internalAttrs),
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}><div class="${"mdc-circular-progress__determinate-container"}"><svg class="${"mdc-circular-progress__determinate-circle-graphic"}" viewBox="${"0 0 48 48"}" xmlns="${"http://www.w3.org/2000/svg"}"><circle class="${"mdc-circular-progress__determinate-track"}" cx="${"24"}" cy="${"24"}" r="${"18"}" stroke-width="${"4"}"></circle><circle${spread(
    [
      {
        class: "mdc-circular-progress__determinate-circle"
      },
      { cx: "24" },
      { cy: "24" },
      { r: "18" },
      { "stroke-dasharray": "113.097" },
      { "stroke-dashoffset": "113.097" },
      { "stroke-width": "4" },
      escape_object(determinateCircleAttrs)
    ],
    {}
  )}${add_attribute("this", determinateCircle, 0)}></circle></svg></div>
  <div class="${"mdc-circular-progress__indeterminate-container"}">${each(fourColor ? [1, 2, 3, 4] : [1], (color) => {
    return `<div${add_attribute(
      "class",
      classMap({
        [className]: true,
        "mdc-circular-progress__spinner-layer": true,
        ["mdc-circular-progress__color-" + color]: fourColor
      }),
      0
    )}><div class="${"mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left"}"><svg class="${"mdc-circular-progress__indeterminate-circle-graphic"}" viewBox="${"0 0 48 48"}" xmlns="${"http://www.w3.org/2000/svg"}"><circle cx="${"24"}" cy="${"24"}" r="${"18"}" stroke-dasharray="${"113.097"}" stroke-dashoffset="${"56.549"}" stroke-width="${"4"}"></circle></svg></div>
        <div class="${"mdc-circular-progress__gap-patch"}"><svg class="${"mdc-circular-progress__indeterminate-circle-graphic"}" viewBox="${"0 0 48 48"}" xmlns="${"http://www.w3.org/2000/svg"}"><circle cx="${"24"}" cy="${"24"}" r="${"18"}" stroke-dasharray="${"113.097"}" stroke-dashoffset="${"56.549"}" stroke-width="${"3.2"}"></circle></svg></div>
        <div class="${"mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right"}"><svg class="${"mdc-circular-progress__indeterminate-circle-graphic"}" viewBox="${"0 0 48 48"}" xmlns="${"http://www.w3.org/2000/svg"}"><circle cx="${"24"}" cy="${"24"}" r="${"18"}" stroke-dasharray="${"113.097"}" stroke-dashoffset="${"56.549"}" stroke-width="${"4"}"></circle></svg></div>
      </div>`;
  })}</div>
</div>`;
});
function getColorByType$1(type) {
  switch (type) {
    case "fire":
      return "#ff8e8e";
    case "normal":
      return "#e0e0e0";
    case "fighting":
      return "#ffa48e";
    case "flying":
      return "#8ec2ff";
    case "poison":
      return "#ce8eff";
    case "ground":
      return "#ba8773";
    case "rock":
      return "#929292";
    case "bug":
      return "#e0e99f";
    case "ghost":
      return "#99ff88";
    case "steel":
      return "#a8b8cf";
    case "water":
      return "#8e96ff";
    case "grass":
      return "#a6f4a5";
    case "electric":
      return "#fdffa0";
    case "psychic":
      return "#e58bff";
    case "ice":
      return "#e074e9";
    case "dragon":
      return "#fd6b6b";
    case "dark":
      return "#b9b6dc";
    case "fairy":
      return "#ffd2f0";
  }
}
const PokeCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name = "" } = $$props;
  let { id = 0 } = $$props;
  let { flavor_text = "" } = $$props;
  let { url = "ul" } = $$props;
  let { types = [""] } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.flavor_text === void 0 && $$bindings.flavor_text && flavor_text !== void 0)
    $$bindings.flavor_text(flavor_text);
  if ($$props.url === void 0 && $$bindings.url && url !== void 0)
    $$bindings.url(url);
  if ($$props.types === void 0 && $$bindings.types && types !== void 0)
    $$bindings.types(types);
  return `<div class="${"card-container md:h-full md:w-96"}">${validate_component(Card, "Card").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="${"bg-stone-800"}" style="${"padding: 1rem;"}"><h2 class="${"mdc-typography--headline6 uppercase text-white"}" style="${"margin: 0;"}">${escape(name)}</h2>
			<h3 class="${"mdc-typography--subtitle2"}" style="${"margin: 0; color: #888;"}">${escape(id)}</h3></div>
		${validate_component(Media, "Media").$$render(
        $$result,
        {
          class: "card-media-16x9",
          aspectRatio: "16x9"
        },
        {},
        {
          default: () => {
            return `${validate_component(MediaContent, "MediaContent").$$render(
              $$result,
              {
                class: " flex justify-center bg-gradient-to-r from-fuchsia-900 to-stone-400"
              },
              {},
              {
                default: () => {
                  return `${url === "" ? `${validate_component(CircularProgress, "CircularProgress").$$render($$result, { class: "w-20", indeterminate: true }, {}, {})}` : `<img${add_attribute("src", url, 0)} alt="${"pokemon"}">`}`;
                }
              }
            )}`;
          }
        }
      )}
		${validate_component(Content, "Content").$$render($$result, { class: "bg-stone-800" }, {}, {
        default: () => {
          return `${validate_component(Set_1, "Set").$$render(
            $$result,
            {
              class: "p-0",
              chips: types,
              nonInteractive: true
            },
            {},
            {
              default: ({ chip }) => {
                return `${validate_component(Chip, "Chip").$$render(
                  $$result,
                  {
                    style: "background-color: " + getColorByType$1(chip),
                    class: "type-chip",
                    chip
                  },
                  {},
                  {
                    default: () => {
                      return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
                        default: () => {
                          return `${escape(chip)}`;
                        }
                      })}`;
                    }
                  }
                )}`;
              }
            }
          )}
			<h4 class="${"text-white"}">${escape(flavor_text)}</h4>`;
        }
      })}`;
    }
  })}</div>`;
});
const MAX_POKEMON_ID = 906;
const MIN_POKEMON_ID = 1;
function getColorByType(type) {
  switch (type) {
    case "fire":
      return "#ff8e8e";
    case "normal":
      return "#e0e0e0";
    case "fighting":
      return "#ffa48e";
    case "flying":
      return "#8ec2ff";
    case "poison":
      return "#ce8eff";
    case "ground":
      return "#ba8773";
    case "rock":
      return "#929292";
    case "bug":
      return "#e0e99f";
    case "ghost":
      return "#d9c6dc";
    case "steel":
      return "#a8b8cf";
    case "water":
      return "#8e96ff";
    case "grass":
      return "#a6f4a5";
    case "electric":
      return "#fdffa0";
    case "psychic":
      return "#e58bff";
    case "ice":
      return "#e074e9";
    case "dragon":
      return "#fd6b6b";
    case "dark":
      return "#b9b6dc";
    case "fairy":
      return "#ffd2f0";
  }
}
async function getRandomPokemonId() {
  const randomNumber = Math.floor(Math.random() * MAX_POKEMON_ID) + MIN_POKEMON_ID;
  const res = await getDataFor(randomNumber);
  return res;
}
async function getAdvantageRelations(json) {
  let damage_relations = {
    all: {
      high_damage_from: [],
      high_damage_to: [],
      low_damage_from: [],
      low_damage_to: [],
      no_damage_from: []
    },
    by_type: []
  };
  for (const type of json.types) {
    const res_advantage = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
    const text_advantage = await res_advantage.text();
    const json_advantage = JSON.parse(text_advantage);
    let high_damage_from = json_advantage.damage_relations.double_damage_from.map((d) => d.name);
    let high_damage_to = json_advantage.damage_relations.double_damage_to.map((d) => d.name);
    let low_damage_from = json_advantage.damage_relations.half_damage_from.map((d) => d.name);
    let low_damage_to = json_advantage.damage_relations.half_damage_to.map((d) => d.name);
    let no_damage_from = json_advantage.damage_relations.no_damage_from.map((d) => d.name);
    const damage_relation = {
      high_damage_from,
      high_damage_to,
      low_damage_from,
      low_damage_to,
      now_damage_from: no_damage_from
    };
    damage_relations.all.high_damage_from.push(high_damage_from);
    damage_relations.all.high_damage_to.push(high_damage_to);
    damage_relations.all.low_damage_from.push(low_damage_from);
    damage_relations.all.low_damage_to.push(low_damage_to);
    damage_relations.all.no_damage_from.push(no_damage_from);
    damage_relations.by_type[type] = damage_relation;
  }
  damage_relations.all.high_damage_from = mergeArrays(damage_relations.all.high_damage_from);
  damage_relations.all.high_damage_to = mergeArrays(damage_relations.all.high_damage_to);
  damage_relations.all.low_damage_from = mergeArrays(damage_relations.all.low_damage_from);
  damage_relations.all.low_damage_to = mergeArrays(damage_relations.all.low_damage_to);
  damage_relations.all.no_damage_from = mergeArrays(damage_relations.all.no_damage_from);
  let evil_list_from = damage_relations.all.high_damage_from.filter((type) => damage_relations.all.low_damage_from.indexOf(type) !== -1);
  damage_relations.all.high_damage_from = damage_relations.all.high_damage_from.filter((type) => evil_list_from.indexOf(type) === -1);
  damage_relations.all.low_damage_from = damage_relations.all.low_damage_from.filter((type) => evil_list_from.indexOf(type) === -1);
  return damage_relations;
}
function mergeArrays(parentArray) {
  if (parentArray.length <= 1)
    return parentArray;
  let array1 = parentArray[0];
  let array2 = parentArray[1];
  let array3 = array1.concat(array2);
  array3 = array3.filter((item, index) => {
    return array3.indexOf(item) === index;
  });
  return array3;
}
async function getDataFor(id) {
  const res_flavor_text = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const text_flavor_text = await res_flavor_text.text();
  const json_flavor_text = JSON.parse(text_flavor_text);
  const flavor_text = json_flavor_text.flavor_text_entries.filter((entry) => entry.language.name === "en")[0].flavor_text;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const text = await res.text();
  let json = JSON.parse(text);
  json.flavor_text = flavor_text.replace(/\\[a-z]/i, "");
  json._types = json.types;
  json.types = json.types.map((entry) => entry.type.name);
  json.url = json.sprites.other["official-artwork"].front_default;
  json.damage_relations = await getAdvantageRelations(json);
  if (res.ok) {
    return json;
  } else {
    throw new Error(text);
  }
}
const InfoPanel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  let { chipsInfo } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.chipsInfo === void 0 && $$bindings.chipsInfo && chipsInfo !== void 0)
    $$bindings.chipsInfo(chipsInfo);
  return `<div class="${"w-full h-fit bg-stone-800 flex flex-col justify-between"}"><h2 class="${"text-center text-white"}">${escape(title)}</h2>

	<div id="${"content"}" class="${"grow mt-2"}"><div class="${"divide-y divide-solid divide-stone-700"}">${validate_component(Set_1, "Set").$$render(
    $$result,
    {
      class: "flex justify-center",
      chips: Array.isArray(chipsInfo[0]) ? chipsInfo[0] : chipsInfo,
      nonInteractive: true
    },
    {},
    {
      default: ({ chip }) => {
        return `${validate_component(Chip, "Chip").$$render(
          $$result,
          {
            style: "background-color: " + getColorByType(chip),
            class: "type-chip",
            chip
          },
          {},
          {
            default: () => {
              return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
                default: () => {
                  return `${escape(chip)}`;
                }
              })}`;
            }
          }
        )}`;
      }
    }
  )}</div></div></div>`;
});
const Switch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "disabled",
    "focusRing",
    "color",
    "group",
    "checked",
    "value",
    "processing",
    "icons",
    "icons$use",
    "icons$class",
    "getId",
    "getElement"
  ]);
  var _a;
  forwardEventsBuilder(get_current_component());
  let uninitializedValue = () => {
  };
  function isUninitializedValue(value2) {
    return value2 === uninitializedValue;
  }
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { disabled = false } = $$props;
  let { focusRing = false } = $$props;
  let { color = "primary" } = $$props;
  let { group = uninitializedValue } = $$props;
  let { checked = uninitializedValue } = $$props;
  let { value = null } = $$props;
  let { processing = false } = $$props;
  let { icons = true } = $$props;
  let { icons$use = [] } = $$props;
  let { icons$class = "" } = $$props;
  let element;
  let internalClasses = {};
  let rippleElement;
  let inputProps = (_a = getContext("SMUI:generic:input:props")) !== null && _a !== void 0 ? _a : {};
  let selected = isUninitializedValue(group) ? isUninitializedValue(checked) ? false : checked : group.indexOf(value) !== -1;
  let state = {
    get disabled() {
      return disabled;
    },
    set disabled(value2) {
      disabled = value2;
    },
    get processing() {
      return processing;
    },
    set processing(value2) {
      processing = value2;
    },
    get selected() {
      return selected;
    },
    set selected(value2) {
      selected = value2;
    }
  };
  let previousChecked = checked;
  let previousGroup = isUninitializedValue(group) ? [] : [...group];
  let previousSelected = selected;
  function getId() {
    return inputProps && inputProps.id;
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.focusRing === void 0 && $$bindings.focusRing && focusRing !== void 0)
    $$bindings.focusRing(focusRing);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.processing === void 0 && $$bindings.processing && processing !== void 0)
    $$bindings.processing(processing);
  if ($$props.icons === void 0 && $$bindings.icons && icons !== void 0)
    $$bindings.icons(icons);
  if ($$props.icons$use === void 0 && $$bindings.icons$use && icons$use !== void 0)
    $$bindings.icons$use(icons$use);
  if ($$props.icons$class === void 0 && $$bindings.icons$class && icons$class !== void 0)
    $$bindings.icons$class(icons$class);
  if ($$props.getId === void 0 && $$bindings.getId && getId !== void 0)
    $$bindings.getId(getId);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  {
    {
      let notifyChange = false;
      if (!isUninitializedValue(group)) {
        if (previousSelected !== selected) {
          const idx = group.indexOf(value);
          if (selected && idx === -1) {
            group.push(value);
            group = group;
          } else if (!selected && idx !== -1) {
            group.splice(idx, 1);
            group = group;
          }
          notifyChange = true;
        } else {
          const idxPrev = previousGroup.indexOf(value);
          const idx = group.indexOf(value);
          if (idxPrev > -1 && idx === -1) {
            state.selected = false;
          } else if (idx > -1 && idxPrev === -1) {
            state.selected = true;
          }
        }
      }
      if (isUninitializedValue(checked)) {
        if (previousSelected !== selected) {
          notifyChange = true;
        }
      } else if (checked !== selected) {
        if (checked === previousChecked) {
          checked = selected;
          notifyChange = true;
        } else {
          state.selected = checked;
        }
      }
      previousChecked = checked;
      previousGroup = isUninitializedValue(group) ? [] : [...group];
      previousSelected = selected;
      if (notifyChange && element) {
        dispatch(element, "SMUISwitch:change", { selected, value });
      }
    }
  }
  return `<button${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-switch": true,
          "mdc-switch--unselected": !selected,
          "mdc-switch--selected": selected,
          "mdc-switch--processing": processing,
          "smui-switch--color-secondary": color === "secondary",
          ...internalClasses
        }))
      },
      { type: "button" },
      { role: "switch" },
      {
        "aria-checked": escape_attribute_value(selected ? "true" : "false")
      },
      { disabled: disabled || null },
      escape_object(inputProps),
      escape_object(exclude($$restProps, ["icons$"]))
    ],
    {}
  )}${add_attribute("this", element, 0)}><div class="${"mdc-switch__track"}"></div>
  <div class="${"mdc-switch__handle-track"}"><div class="${"mdc-switch__handle"}"><div class="${"mdc-switch__shadow"}"><div class="${"mdc-elevation-overlay"}"></div></div>
      <div class="${"mdc-switch__ripple"}"${add_attribute("this", rippleElement, 0)}></div>
      ${icons ? `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [icons$class]: true,
          "mdc-switch__icons": true
        }))
      },
      escape_object(prefixFilter($$restProps, "icons$"))
    ],
    {}
  )}><svg class="${"mdc-switch__icon mdc-switch__icon--on"}" viewBox="${"0 0 24 24"}"><path d="${"M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"}"></path></svg>
          <svg class="${"mdc-switch__icon mdc-switch__icon--off"}" viewBox="${"0 0 24 24"}"><path d="${"M20 13H4v-2h16v2z"}"></path></svg></div>` : ``}</div></div>
  ${focusRing ? `<div class="${"mdc-switch__focus-ring-wrapper"}"><div class="${"mdc-switch__focus-ring"}"></div></div>` : ``}
</button>`;
});
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { typeRelationsChecked: typeRelationsChecked2 = true } = $$props;
  if ($$props.typeRelationsChecked === void 0 && $$bindings.typeRelationsChecked && typeRelationsChecked2 !== void 0)
    $$bindings.typeRelationsChecked(typeRelationsChecked2);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<header class="${"w-full h-auto, flex justify-center flex-wrap"}"><h1 class="${"animate-bounce text-xl text-white mt-2"}">Random Pokemon <!-- HTML_TAG_START -->${":)"}<!-- HTML_TAG_END --></h1>
	<div class="${"w-full flex justify-center"}"><div class="${"inline-block align-text-bottom"}">${validate_component(Switch, "Switch").$$render(
      $$result,
      { checked: typeRelationsChecked2 },
      {
        checked: ($$value) => {
          typeRelationsChecked2 = $$value;
          $$settled = false;
        }
      },
      {}
    )}
			<span class="${"h-fit text-white"}">Display type relations</span></div></div></header>`;
  } while (!$$settled);
  return $$rendered;
});
const BottomAppBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "style", "color", "variant", "getPropStore", "getElement"]);
  let $colorStore, $$unsubscribe_colorStore;
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { color = "primary" } = $$props;
  let { variant = "standard" } = $$props;
  let element;
  let internalStyles = {};
  const colorStore = writable(color);
  $$unsubscribe_colorStore = subscribe(colorStore, (value) => $colorStore = value);
  let withFab = false;
  let adjustOffset = 0;
  setContext("SMUI:bottom-app-bar:color", colorStore);
  let propStoreSet;
  let propStore = readable({ withFab, adjustOffset, variant }, (set) => {
    propStoreSet = set;
  });
  function getPropStore() {
    return propStore;
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.getPropStore === void 0 && $$bindings.getPropStore && getPropStore !== void 0)
    $$bindings.getPropStore(getPropStore);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  set_store_value(colorStore, $colorStore = color, $colorStore);
  {
    if (propStoreSet) {
      propStoreSet({ withFab, adjustOffset, variant });
    }
  }
  $$unsubscribe_colorStore();
  return `

<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "smui-bottom-app-bar": true,
          "smui-bottom-app-bar--standard": variant === "standard",
          "smui-bottom-app-bar--fixed": variant === "fixed"
        }))
      },
      {
        style: escape_attribute_value(Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" "))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}
</div>`;
});
const Paper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "variant", "square", "color", "elevation", "transition", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { variant = "raised" } = $$props;
  let { square = false } = $$props;
  let { color = "default" } = $$props;
  let { elevation = 1 } = $$props;
  let { transition = false } = $$props;
  let element;
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.square === void 0 && $$bindings.square && square !== void 0)
    $$bindings.square(square);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.elevation === void 0 && $$bindings.elevation && elevation !== void 0)
    $$bindings.elevation(elevation);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "smui-paper": true,
          "smui-paper--raised": variant === "raised",
          "smui-paper--unelevated": variant === "unelevated",
          "smui-paper--outlined": variant === "outlined",
          ["smui-paper--elevation-z" + elevation]: elevation !== 0 && variant === "raised",
          "smui-paper--rounded": !square,
          ["smui-paper--color-" + color]: color !== "default",
          "smui-paper-transition": transition
        }))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}
</div>`;
});
classAdderBuilder({
  class: "smui-paper__content",
  tag: "div"
});
classAdderBuilder({
  class: "smui-paper__title",
  tag: "h5"
});
classAdderBuilder({
  class: "smui-paper__subtitle",
  tag: "h6"
});
const Section = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let usePass;
  let $$restProps = compute_rest_props($$props, ["use", "class", "fabInset", "getElement"]);
  let $color, $$unsubscribe_color;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { fabInset = false } = $$props;
  let element;
  const color = getContext("SMUI:bottom-app-bar:color");
  $$unsubscribe_color = subscribe(color, (value) => $color = value);
  function getElement() {
    return element.getElement();
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.fabInset === void 0 && $$bindings.fabInset && fabInset !== void 0)
    $$bindings.fabInset(fabInset);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    usePass = [forwardEvents, ...use];
    $$rendered = `${validate_component(Paper, "Paper").$$render(
      $$result,
      Object.assign(
        { use: usePass },
        {
          class: classMap({
            [className]: true,
            "smui-bottom-app-bar__section": true,
            "smui-bottom-app-bar__section--fab-inset": fabInset
          })
        },
        { color: $color },
        { variant: "unelevated" },
        { square: true },
        $$restProps,
        { this: element }
      ),
      {
        this: ($$value) => {
          element = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_color();
  return $$rendered;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let bottomAppBar;
  let { handleClick = () => {
  } } = $$props;
  if ($$props.handleClick === void 0 && $$bindings.handleClick && handleClick !== void 0)
    $$bindings.handleClick(handleClick);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<footer>${validate_component(BottomAppBar, "BottomAppBar").$$render(
      $$result,
      {
        class: "cursor-pointer flex justify-center",
        this: bottomAppBar
      },
      {
        this: ($$value) => {
          bottomAppBar = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Section, "Section").$$render(
            $$result,
            {
              style: "display:flex; justify-content:center;"
            },
            {},
            {
              default: () => {
                return `<h3 class="${"hidden md:flex text-lg capitalize"}">[Spacebar] Reload</h3>
			<h3 class="${"md:hidden text-lg capitalize"}">Reload</h3>`;
              }
            }
          )}`;
        }
      }
    )}</footer>`;
  } while (!$$settled);
  return $$rendered;
});
let typeRelationsChecked = true;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let typeRelationsChecked_ref;
  let promise = getRandomPokemonId();
  function handleGetPokemon() {
    promise = getRandomPokemonId();
  }
  typeRelationsChecked_ref = typeRelationsChecked;
  return `<div class="${"h-screen w-full bg-stone-900 flex flex-col justify-between"}">${validate_component(Header, "Header").$$render($$result, { typeRelationsChecked }, {}, {})}

	<main class="${"md:w-full h-auto flex mb-10 min-w-fit flex-col md:flex-row justify-center gap-4"}">${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
			${validate_component(PokeCard, "PokeCard").$$render(
        $$result,
        {
          name: "...",
          id: 0,
          flavor_text: "...",
          url: "",
          types: ["normal"]
        },
        {},
        {}
      )}
		`;
    }
    return function(pokemon) {
      return `
			${validate_component(PokeCard, "PokeCard").$$render($$result, Object.assign(pokemon), {}, {})}
		`;
    }(__value);
  }(promise)}

		${typeRelationsChecked_ref ? `<div id="${"typesInfoContainer"}" class="${"flex flex-col md:row-span-2 md:flex-row bg-stone-900 justify-evenly align-middle gap-4 flex-wrap"}">${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
					${validate_component(InfoPanel, "InfoPanel").$$render($$result, { title: "High damage from", chipsInfo: [] }, {}, {})}
					${validate_component(InfoPanel, "InfoPanel").$$render($$result, { title: "Low damage from", chipsInfo: [] }, {}, {})}
					${validate_component(InfoPanel, "InfoPanel").$$render($$result, { title: "High damage to", chipsInfo: [] }, {}, {})}
					${validate_component(InfoPanel, "InfoPanel").$$render($$result, { title: "Low damage to", chipsInfo: [] }, {}, {})}
					${validate_component(InfoPanel, "InfoPanel").$$render($$result, { title: "No damage from", chipsInfo: [] }, {}, {})}
				`;
    }
    return function(pokemon) {
      return `
					${validate_component(InfoPanel, "InfoPanel").$$render(
        $$result,
        {
          title: "High damage from",
          chipsInfo: pokemon.damage_relations.all.high_damage_from
        },
        {},
        {}
      )}
					${validate_component(InfoPanel, "InfoPanel").$$render(
        $$result,
        {
          title: "Low damage from",
          chipsInfo: pokemon.damage_relations.all.low_damage_from
        },
        {},
        {}
      )}
					${validate_component(InfoPanel, "InfoPanel").$$render(
        $$result,
        {
          title: "High damage to",
          chipsInfo: pokemon.damage_relations.all.high_damage_to
        },
        {},
        {}
      )}
					${validate_component(InfoPanel, "InfoPanel").$$render(
        $$result,
        {
          title: "Low damage to",
          chipsInfo: pokemon.damage_relations.all.low_damage_to
        },
        {},
        {}
      )}
					${validate_component(InfoPanel, "InfoPanel").$$render(
        $$result,
        {
          title: "No damage from",
          chipsInfo: pokemon.damage_relations.all.no_damage_from
        },
        {},
        {}
      )}
				`;
    }(__value);
  }(promise)}</div>` : ``}</main>

	${validate_component(Footer, "Footer").$$render($$result, { handleClick: handleGetPokemon }, {}, {})}</div>`;
});
export {
  Page as default
};
