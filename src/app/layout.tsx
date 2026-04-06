import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AutoProxy - Bảng Điều Khiển",
  description: "Dịch vụ proxy xoay IP tự động chất lượng cao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css" />
        <link rel="stylesheet" href="/assets/css/Animation-Cards-_app.css" />
        <link rel="stylesheet" href="/assets/css/Animation-Cards.css" />
        <link rel="stylesheet" href="/assets/css/Billing-Table-with-Add-Row--Fixed-Header-Feature.css" />
        <link rel="stylesheet" href="/assets/css/Bold-BS4-Pricing-Table-Style-68-price_table_68.css" />
        <link rel="stylesheet" href="/assets/css/Bold-BS4-Pricing-Table-Style-68.css" />
        <link rel="stylesheet" href="/assets/css/Bold-BS4-Responsive-Pricing-Table-Snippet.css" />
        <link rel="stylesheet" href="/assets/css/Google-Style-Text-Input.css" />
        <link rel="stylesheet" href="/assets/css/Ludens---1-Dark-mode-Index-Table-with-Search-Filters.css" />
        <link rel="stylesheet" href="/assets/css/Pricing-Table-with-Icon-Buy-Button.css" />
        <link rel="stylesheet" href="/assets/css/Table-With-Search.css" />
      </head>
      <body id="page-top">
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* Global Scripts */}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
        <Script src="https://code.jquery.com/jquery-3.5.1.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/theme.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
