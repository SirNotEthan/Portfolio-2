import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import LandingPage from "./pages/LandingPage";

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
]);

createRoot(document.getElementById('root')).render(
  <div className="antialiased">
    <RouterProvider router={router} />
  </div>
);