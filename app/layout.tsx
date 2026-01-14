import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Using Playfair Display for Serif
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Client Growth Ecosystem",
  description: "Build Brands. Craft Stories. Engineer Growth.",
  icons: {
    icon: "/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white text-black`}>
        {/* Global Logo */}
        <div className="fixed top-6 left-6 md:top-12 md:left-12 z-50 pointer-events-auto w-12 h-12 md:w-16 md:h-16 mix-blend-difference text-white">
          {/* Assuming logo is black, invert to white for difference blending to work (White - White = Black, White - Black = White) */}
          <img src="/logo/logo.png" alt="W&W Logo" className="w-full h-full object-contain invert" />
        </div>

        {/* Global Support Character */}
        <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-40 pointer-events-none w-16 md:w-24 opacity-80 mix-blend-difference text-white">
          <img src="/logo/support.png" alt="Support" className="w-full h-auto object-contain invert drop-shadow-2xl" />
        </div>

        {children}
      </body>
    </html >
  );
}
