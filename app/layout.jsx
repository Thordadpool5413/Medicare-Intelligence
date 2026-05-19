import "./globals.css";

export const metadata = {
  title: "Medicare Intelligence",
  description: "Professional hospice market intelligence workspace"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
