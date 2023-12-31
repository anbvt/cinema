"use client";
import { SessionProvider } from "next-auth/react";
import "../globals.css";
// const inter = Inter({ subsets: ['latin'] })
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ConfigProvider } from "antd";
import { theme } from "./theme";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Zuhot Cinema</title>
        <link
          rel="icon"
          href="/_next/image?url=%2Fassert%2Fimg%2Flogo.png&w=256&q=75"
          type="image/x-icon"
          sizes="any"
        ></link>
      </head>
      <body>
        <div className="container-fluid bg-dark">
          <Suspense fallback={<Loading />}>
            <ConfigProvider theme={theme}>
              <SessionProvider>
                <Navbar />
                <div className="absolute max-sm:top-20 top-[90px] w-full">
                  {children}
                  <Footer />
                </div>
              </SessionProvider>
            </ConfigProvider>
          </Suspense>
        </div>
      </body>
    </html>
  );
}
