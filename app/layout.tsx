import "./globals.css";

export const metadata = {
  title: "Varnz AI Builder",
  description: "AI Website Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
