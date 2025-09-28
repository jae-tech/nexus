"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var router_1 = require("./router");
function App() {
    return (<react_router_dom_1.BrowserRouter basename={__BASE_PATH__}>
      <router_1.AppRoutes />
    </react_router_dom_1.BrowserRouter>);
}
exports.default = App;
