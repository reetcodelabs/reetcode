import { getSandpackCssText } from "@codesandbox/sandpack-react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-full">
      <Head>
        <style
          dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
          id="sandpack"
          key="sandpack-css"
        />
        <link
          rel="stylesheet"
          href="https://rsms.me/inter/inter.css?feat-cv11=1&feat-cv02=1&feat-cv03=1&feat-cv04=1&feat-ss01=1"
        />
      </Head>
      <body className="h-full bg-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
