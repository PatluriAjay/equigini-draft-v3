import "./globals.css";
import Layout from "../components/Layout";

export const metadata = {
  title: "Equigini | Digital Investment Banker",
  description: "Digital Investment Banker - Discover exclusive investment opportunities",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  manifest: "/site.webmanifest"
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body
        className={`antialiased pt-[72px] `}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
