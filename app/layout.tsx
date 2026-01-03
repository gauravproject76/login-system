import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Medapp - A platform to provide appointment software",
  description: "It is a software that help to make appointment service better any hospital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
