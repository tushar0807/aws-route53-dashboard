import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import RootLayout from "./layouts/root-layout";
import DashboardLayout from "./layouts/dashboard-layout";

import IndexPage from "./routes";
import SignInPage from "./routes/sign-in";
import SignUpPage from "./routes/sign-up";
import DashboardPage from "./routes/dashboard";
import DomainPage from "./routes/DomainPage";
import { AuthProvider } from "./context/token";
import Navbar from "./components/Navbar";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          {
            path: "/dashboard",
            element: (
              <>
                <Navbar />
                <DashboardPage />
              </>
            ),
          },
          { path: ":id", element: <>
          <Navbar />
          <DomainPage />
        </> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <MantineProvider
        defaultColorScheme="dark"
        theme={{
          fontFamily: "Verdana, sans-serif",
          fontFamilyMonospace: "Monaco, Courier, monospace",
          headings: { fontFamily: "Greycliff CF, sans-serif" },
          primaryColor: "teal",
        }}
      >
        <RouterProvider router={router} />
      </MantineProvider>
    </AuthProvider>
  </React.StrictMode>
);
