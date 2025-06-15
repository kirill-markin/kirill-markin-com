import type { Metadata } from "next";

// This is a root layout for route groups
// The actual HTML structure is handled by route group layouts
export const metadata: Metadata = {
  title: "Kirill Markin - Consultant and Software Architect",
  description: "Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
