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
          <div className="login-container">
            <Link href="/">
              <Home />
            </Link>
          </div>
          <div className="login-container">
            {loggedIn ? (
              <span onClick={handleLogout}>Log Out</span>
            ) : (
              <a
                href={`https://www.bungie.net/en/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_BUNGIE_APP_CLIENT_ID}&response_type=code`}
                // target="_blank"
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
