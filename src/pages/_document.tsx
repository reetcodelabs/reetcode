import { getSandpackCssText } from "@codesandbox/sandpack-react";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-full">
      <Head>
        <style
          id="sandpack"
          key="sandpack-css"
          dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
        />
        {/* <link
          rel="stylesheet"
          href="https://rsms.me/inter/inter.css?feat-cv11=1&feat-cv02=1&feat-cv03=1&feat-cv04=1&feat-ss01=1"
        /> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="h-full bg-slate-900 font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
