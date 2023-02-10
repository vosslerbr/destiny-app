import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "@next/font/google";

// TODO figure out a way to use Poppins for entire app instead
const roboto = Roboto({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={roboto.className}>
      <Component {...pageProps} />
    </div>
  );
}
