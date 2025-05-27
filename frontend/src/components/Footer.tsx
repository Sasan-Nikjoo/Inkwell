"use client";
import Link from "next/link";
import { useState } from "react";

const Footer: React.FC = () => {
    const [email, setEmail] = useState("");

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for newsletter signup logic
        alert(`Subscribed with: ${email}`);
        setEmail("");
    };

    return (
        <footer className="footer">
            <style>
                {`
          .footer {
            background: #172554;
            color: #e5e7eb;
            padding: 3rem 2rem;
            width: 100%;
            position: relative;
            z-index: 10;
          }
          .footer-container {
            max-width: 80rem;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 2rem;
          }
          .footer-section {
            flex: 1;
            min-width: 200px;
          }
          .footer-section h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #fff;
          }
          .footer-section ul {
            list-style: none;
            padding: 0;
          }
          .footer-section ul li {
            margin-bottom: 0.5rem;
          }
          .footer-section ul li a {
            color: #e5e7eb;
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s ease;
          }
          .footer-section ul li a:hover {
            color: #d4af37;
          }
          .newsletter-form {
            display: flex;
            gap: 0.5rem;
            max-width: 300px;
          }
          .newsletter-form input {
            flex: 1;
            padding: 0.6rem;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
            background: #fff;
            color: #1e3a8a;
            font-size: 0.9rem;
            outline: none;
          }
          .newsletter-form button {
            padding: 0.6rem 1rem;
            background: #d4af37;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background-color 0.3s ease;
          }
          .newsletter-form button:hover {
            background: #b8972e;
          }
          .social-links {
            display: flex;
            gap: 1rem;
          }
          .social-links a {
            color: #e5e7eb;
            text-decoration: none;
            font-size: 1.5rem;
            transition: color 0.3s ease;
          }
          .social-links a:hover {
            color: #d4af37;
          }
          .footer-bottom {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #374151;
            font-size: 0.85rem;
            color: #e5e7eb;
          }
          /* Responsive Styles */
          @media (max-width: 768px) {
            .footer-container {
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .footer-section {
              min-width: 100%;
            }
            .newsletter-form {
              max-width: 100%;
            }
            .social-links {
              justify-content: center;
            }
          }
          @media (max-width: 480px) {
            .footer {
              padding: 2rem 1rem;
            }
            .footer-section h3 {
              font-size: 1.1rem;
            }
            .footer-section ul li a {
              font-size: 0.85rem;
            }
            .newsletter-form input,
            .newsletter-form button {
              font-size: 0.85rem;
              padding: 0.5rem;
            }
            .footer-bottom {
              font-size: 0.8rem;
            }
          }
          @media (max-width: 360px) {
            .footer {
              padding: 1.5rem 0.8rem;
            }
            .footer-section h3 {
              font-size: 1rem;
            }
            .newsletter-form input,
            .newsletter-form button {
              font-size: 0.8rem;
              padding: 0.4rem;
            }
            .social-links a {
              font-size: 1.2rem;
            }
          }
        `}
            </style>
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Inkwell</h3>
                    <p>
                        Your space to share stories, connect with readers, and inspire creativity.
                    </p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/about">About</Link>
                        </li>
                        <li>
                            <Link href="/stories">Stories</Link>
                        </li>
                        <li>
                            <Link href="/contact">Contact</Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Newsletter</h3>
                    <p>Stay updated with our latest stories and updates.</p>
                    <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <div className="social-links">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.379 4.482A13.94 13.94 0 011.671 3.149 4.916 4.916 0 003.194 9.723a4.88 4.88 0 01-2.224-.616v.062a4.916 4.916 0 003.946 4.827 4.902 4.902 0 01-2.213.084 4.916 4.916 0 004.586 3.414A9.868 9.868 0 010 19.54a13.916 13.916 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
                            </svg>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                            </svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.425.065-2.888.362-3.952 1.426C2.036 2.563 1.74 4.026 1.674 5.451c-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.065 1.425.362 2.888 1.426 3.952 1.065 1.065 2.527 1.362 3.952 1.426 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.425-.065 2.888-.362 3.952-1.426 1.065-1.065 1.362-2.527 1.426-3.952.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.065-1.425-.362-2.888-1.426-3.952-1.065-1.065-2.527-1.362-3.952-1.426-1.28-.058-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Inkwell. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;