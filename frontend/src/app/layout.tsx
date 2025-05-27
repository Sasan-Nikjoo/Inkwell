import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Inkwell - Inspire Your Story",
    description: "Discover a world of creativity with Inkwell. Share and explore stories with our vibrant community.",
    keywords: "blog, stories, writing, creativity, community",
    openGraph: {
        title: "Inkwell - Inspire Your Story",
        description: "Discover a world of creativity with Inkwell. Share and explore stories with our vibrant community.",
        url: "https://www.inkwell.com",
        images: ["/og-image.jpg"],
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.variable}`}>
        {children}
        </body>
        </html>
    );
}