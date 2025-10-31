import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import {
  Home,
  Filters,
  BestRoute,
  AboutTheProject,
  AboutTheCompetition,
} from "./pages";
import { Footer, Header } from "./components";
import App from "./App";

function HasFooterAndHeaderRoutes() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<HasFooterAndHeaderRoutes />}>
        <Route index element={<Home />} />
        <Route path="aboutTheProject" element={<AboutTheProject />} />
        <Route path="aboutTheCompetition" element={<AboutTheCompetition />} />
        <Route path="filters" element={<Filters />} />
        <Route path="bestRoute" element={<BestRoute />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Route>
  )
);

export default function Routes() {
  return <RouterProvider router={router} />;
}
