
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Customers from "../pages/customers/page";
import CustomerDetail from "../pages/customers/detail/page";
import Reservations from "../pages/reservations/page";
import Staff from "../pages/staff/page";
import Services from "../pages/services/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/customers",
    element: <Customers />,
  },
  {
    path: "/customers/:id",
    element: <CustomerDetail />,
  },
  {
    path: "/reservations",
    element: <Reservations />,
  },
  {
    path: "/staff",
    element: <Staff />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
