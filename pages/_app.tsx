import "@/styles/variables.css";
import "@/styles/globals.css";
import "@/styles/nav.css";

import type { AppProps } from "next/app";
import { Poppins } from "@next/font/google";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import Store from "@/components/Store";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightRegular: 300,
    fontWeightBold: 700,
  },
});

const poppins = Poppins({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider theme={theme}>
      <Store>
        <div className={poppins.className}>{getLayout(<Component {...pageProps} />)}</div>
      </Store>
    </ThemeProvider>
  );
}
