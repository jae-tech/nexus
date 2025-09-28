"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
require("./i18n");
var client_1 = require("react-dom/client");
var ui_1 = require("@nexus/ui");
require("./index.css");
var App_tsx_1 = require("./App.tsx");
(0, client_1.createRoot)(document.getElementById('root')).render(<react_1.StrictMode>
    <ui_1.ThemeProvider defaultTheme="system" storageKey="beauty-manager-theme">
      <App_tsx_1.default />
    </ui_1.ThemeProvider>
  </react_1.StrictMode>);
