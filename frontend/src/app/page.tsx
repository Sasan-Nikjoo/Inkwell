"use client";
import { useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import MostView from "@/components/MostView";
import FAQ from "@/components/FAQ";

export default function Home() {
    useEffect(() => {
        const hamburgerMenu = document.querySelector(".hamburger-menu");
        const container = document.querySelector(".container");

        if (hamburgerMenu && container) {
            hamburgerMenu.addEventListener("click", () => {
                container.classList.toggle("active");
            });
        }

        return () => {
            if (hamburgerMenu) {
                hamburgerMenu.removeEventListener("click", () => {
                    container?.classList.toggle("active");
                });
            }
        };
    }, []);

    return (
        <div className="container">
            <div className="navbar">
                <div className="menu">
                    <h3 className="logo">
                        Ink<span>well</span>
                    </h3>
                    <div className="hamburger-menu">
                        <div className="bar"></div>
                    </div>
                </div>
            </div>

            <div className="main-container">
                <div className="main">
                    <header>
                        <div className="overlay">
                            <div className="inner">
                                <h2 className="title">Write Your Next Chapter</h2>
                                <p>
                                    Unleash your creativity with Inkwell. Share your stories, connect with readers, and inspire the world.
                                </p>
                                <Link href="/stories" className="btn">
                                    Start Writing
                                </Link>
                            </div>
                        </div>
                    </header>
                </div>

                <div className="shadow one"></div>
                <div className="shadow two"></div>
            </div>

            <div className="links">
                <ul>
                    <li>
                        <Link href="/" style={{ "--i": "0.05s" } as React.CSSProperties}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" style={{ "--i": "0.25s" } as React.CSSProperties}>
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/services" style={{ "--i": "0.1s" } as React.CSSProperties}>
                            Services
                        </Link>
                    </li>
                    <li>
                        <Link href="/stories" style={{ "--i": "0.15s" } as React.CSSProperties}>
                            Stories
                        </Link>
                    </li>
                    <li>
                        <Link href="/testimonials" style={{ "--i": "0.2s" } as React.CSSProperties}>
                            Testimonials
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" style={{ "--i": "0.3s" } as React.CSSProperties}>
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>

            <MostView />
            <FAQ />
            <Footer />
        </div>
    );
}