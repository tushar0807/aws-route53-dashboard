import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

import "./Navbar.css"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider navigate={navigate} publishableKey={PUBLISHABLE_KEY}>
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/">
              <img src="logo.png" alt="Logo" className="logo" />
            </Link>
            <span className="navbar-title">AWS DASHBOARD</span>
          </div>
          <nav className="navbar-links">
            <SignedOut>
              <Link to="/sign-in">Sign In</Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/sign-in" />
            </SignedIn>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </ClerkProvider>
  );
}
