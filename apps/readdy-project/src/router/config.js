"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NotFound_1 = require("../pages/NotFound");
var page_1 = require("../pages/home/page");
var page_2 = require("../pages/customers/page");
var page_3 = require("../pages/customers/detail/page");
var page_4 = require("../pages/reservations/page");
var page_5 = require("../pages/staff/page");
var page_6 = require("../pages/services/page");
var routes = [
    {
        path: "/",
        element: <page_1.default />,
    },
    {
        path: "/customers",
        element: <page_2.default />,
    },
    {
        path: "/customers/:id",
        element: <page_3.default />,
    },
    {
        path: "/reservations",
        element: <page_4.default />,
    },
    {
        path: "/staff",
        element: <page_5.default />,
    },
    {
        path: "/services",
        element: <page_6.default />,
    },
    {
        path: "*",
        element: <NotFound_1.default />,
    },
];
exports.default = routes;
