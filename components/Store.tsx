/**
 * @description this is a wrapper component that will be used to store the user data and provide it to the rest of the app
 */

import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export type UserContextType = {
  user: {
    destinyMemberships: any[];
    primaryMembershipId: string;
    bungieNetUser: any;
    responseMintedTimestamp: string;
    secondaryComponentsMintedTimestamp: string;
    characters: any;
  };
};

export const UserContext = createContext<UserContextType | null>(null);

type Props = {
  children: JSX.Element;
};

export default function Store({ children }: Props) {
  const [user, setUser] = useState<any>({});

  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      const code = router.query.code;

      // fetches a user's Membership data from Bungie
      const getMemberships = async (access_token: string) => {
        const data = JSON.stringify({
          access_token,
        });

        const config = {
          method: "post",
          url: "/api/user/getMemberships",
          headers: {
            "Content-Type": "application/json",
          },
          data,
        };

        const res = await axios(config);

        const { data: response } = res;

        setUser(response);
      };

      // If no code, this isn't from the login flow
      if (!code) {
        const tokenData = localStorage.getItem("tokenData");

        // if no token, do nothing
        if (!tokenData) {
          return;
        }

        const parsedTokenData = JSON.parse(tokenData);

        // if token, check if it's expired
        const expiresAt = parseInt(localStorage.getItem("expiresAt") || "0");
        const now = new Date().getTime();

        const isExpired = now > expiresAt;

        if (!isExpired) {
          // not expired, fetch user data

          if (!user.primaryMembershipId) {
            getMemberships(parsedTokenData.access_token);
          }

          return;
        }

        // if expired send a request to refresh the token
        const response = await axios.post("/api/auth/refresh-token", {
          refresh_token: parsedTokenData.refresh_token,
        });

        const { data } = response;

        localStorage.setItem("tokenData", JSON.stringify(data));

        // calculate when the public key expires and store it in localStorage
        const newExpiresAt = JSON.stringify(data.expires_in * 1000 + new Date().getTime());

        localStorage.setItem("expiresAt", newExpiresAt);

        if (!user.primaryMembershipId) {
          getMemberships(data.access_token);
        }

        return;
      }

      const response = await axios.post("/api/auth/get-token", {
        headers: {
          "Content-Type": "application/json",
        },
        code,
      });

      const { data } = response;

      localStorage.setItem("tokenData", JSON.stringify(data));

      // calculate when the public key expires and store it in localStorage
      const expiresAt = JSON.stringify(data.expires_in * 1000 + new Date().getTime());

      localStorage.setItem("expiresAt", expiresAt);

      if (!user.primaryMembershipId) {
        getMemberships(data.access_token);
      }

      router.push("/");
    };

    getToken();
  }, [router.query.code]);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}
