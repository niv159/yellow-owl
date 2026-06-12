import "./globals.css";

export const metadata = {
  title: "Yellow Owl",
  description: "A weekly thinking adventure for curious kids.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
