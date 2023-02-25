import { Home } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { UserContext, UserContextType } from "./Store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useContext(UserContext) as UserContextType;

  const loggedIn = user?.primaryMembershipId ? true : false;

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("tokenData");
    localStorage.removeItem("expiresAt");

    router.reload();
  };

  // TODO improve styling
  return (
    <>
      <nav>
        <div id="nav-inner">
          <div>
            <Link href="/">
              <Home />
            </Link>
          </div>
          <div>
            {loggedIn ? (
              <p onClick={handleLogout}>Log Out</p>
            ) : (
              <a
                href={
                  "https://www.bungie.net/en/oauth/authorize?client_id=38608&response_type=code"
                }
                target="_blank"
                rel="noreferrer">
                Log In
              </a>
            )}
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
