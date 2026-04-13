import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Empathic Memory Bench",
    template: "%s | Empathic Memory Bench",
  },
  description:
    "Open benchmark evaluating 14 memory systems for AI companions. 12 judges from 7 companies. Garden leads at 24.61/30.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-background text-foreground antialiased flex flex-col overflow-x-hidden">
        {/* Ambient gradient orbs */}
        <div
          className="gradient-orb"
          style={{
            width: 600,
            height: 600,
            top: -200,
            right: -200,
            background:
              "radial-gradient(circle, rgba(249,168,142,0.5), transparent 70%)",
            animation: "orb-drift-1 20s ease-in-out infinite",
          }}
        />
        <div
          className="gradient-orb"
          style={{
            width: 500,
            height: 500,
            top: 400,
            left: -150,
            background:
              "radial-gradient(circle, rgba(184,93,171,0.3), transparent 70%)",
            animation: "orb-drift-2 25s ease-in-out infinite",
          }}
        />
        <div
          className="gradient-orb"
          style={{
            width: 400,
            height: 400,
            bottom: 100,
            right: 100,
            background:
              "radial-gradient(circle, rgba(249,168,142,0.35), transparent 70%)",
            animation: "orb-drift-3 22s ease-in-out infinite",
          }}
        />
        <div
          className="gradient-orb"
          style={{
            width: 350,
            height: 350,
            top: 800,
            left: "40%",
            background:
              "radial-gradient(circle, rgba(224,112,88,0.2), transparent 70%)",
            animation: "orb-drift-1 28s ease-in-out infinite",
          }}
        />

        <div className="relative z-10 flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
