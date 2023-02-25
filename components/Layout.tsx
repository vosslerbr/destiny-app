import { Home } from "@mui/icons-material";
import Link from "next/link";
import React from "react";
import LoginButton from "./LoginButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <div>
          <Link href="/">
            <Home />
          </Link>
        </div>
        <div>
          <a
            href={"https://www.bungie.net/en/oauth/authorize?client_id=38608&response_type=code"}
            target="_blank"
            rel="noreferrer">
            Log In
          </a>
          <LoginButton />
        </div>
      </nav>
      {children}
    </>
  );
}
