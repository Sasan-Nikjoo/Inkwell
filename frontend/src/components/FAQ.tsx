"use client";
import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: "How do I start writing on Inkwell?",
            answer:
                "To start writing, create an account via the 'Sign Up' button, then navigate to the 'Stories' section to submit your first post. Our editor is user-friendly and supports rich text formatting.",
        },
        {
            question: "Is there a cost to publish on Inkwell?",
            answer:
                "Publishing on Inkwell is free for all users. We offer optional premium features for enhanced visibility, but basic publishing is always free.",
        },
        {
            question: "Can I edit or delete my posts?",
            answer:
                "Yes, you can edit or delete your posts at any time from your profile dashboard. Simply go to 'My Stories' and select the post you wish to modify.",
        },
        {
            question: "How are the most viewed stories determined?",
            answer:
                "The most viewed stories are ranked based on page views tracked by our analytics system. The list updates daily to reflect current reader engagement.",
        },
        {
            question: "How can I contact the Inkwell team?",
            answer:
                "You can reach us via the 'Contact' page or email us at support@inkwell.com. We respond to inquiries within 24-48 hours.",
        },
    ];

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq">
            <style>
                {`
          .faq {
            background: #1e3a8a;
            color: #e5e7eb;
            padding: 3rem 2rem;
            width: 100%;
            position: relative;
            z-index: 5;
          }
          .faq-container {
            max-width: 80rem;
            margin: 0 auto;
            text-align: center;
          }
          .faq h2 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 2rem;
          }
          .faq-list {
            max-width: 60rem;
            margin: 0 auto;
            list-style: none;
            padding: 0;
          }
          .faq-item {
            background: #172554;
            border-radius: 8px;
            margin-bottom: 1rem;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          .faq-question {
            padding: 1.5rem;
            font-size: 1.1rem;
            font-weight: 500;
            color: #e5e7eb;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: color 0.3s ease;
          }
          .faq-question:hover {
            color: #d4af37;
          }
          .faq-question svg {
            width: 20px;
            height: 20px;
            fill: #e5e7eb;
            transition: transform 0.3s ease, fill 0.3s ease;
          }
          .faq-question.active svg {
            transform: rotate(180deg);
            fill: #d4af37;
          }
          .faq-answer {
            max-height: 0;
            overflow: hidden;
            padding: 0 1.5rem;
            font-size: 0.95rem;
            line-height: 1.6;
            color: #e5e7eb;
            background: #1f2a44;
            transition: max-height 0.3s ease, padding 0.3s ease;
          }
          .faq-answer.active {
            max-height: 200px;
            padding: 1.5rem;
          }
          /* Responsive Styles */
          @media (max-width: 1024px) {
            .faq h2 {
              font-size: 2.2rem;
            }
            .faq-list {
              max-width: 50rem;
            }
            .faq-question {
              font-size: 1rem;
            }
          }
          @media (max-width: 768px) {
            .faq {
              padding: 2rem 1rem;
            }
            .faq h2 {
              font-size: 2rem;
            }
            .faq-list {
              max-width: 100%;
            }
            .faq-question {
              font-size: 0.95rem;
              padding: 1.2rem;
            }
            .faq-answer {
              font-size: 0.9rem;
            }
            .faq-answer.active {
              padding: 1.2rem;
            }
          }
          @media (max-width: 480px) {
            .faq {
              padding: 1.5rem 0.8rem;
            }
            .faq h2 {
              font-size: 1.8rem;
            }
            .faq-question {
              font-size: 0.9rem;
              padding: 1rem;
            }
            .faq-answer {
              font-size: 0.85rem;
            }
            .faq-answer.active {
              padding: 1rem;
              max-height: 300px;
            }
            .faq-question svg {
              width: 18px;
              height: 18px;
            }
          }
          @media (max-width: 360px) {
            .faq {
              padding: 1.2rem 0.6rem;
            }
            .faq h2 {
              font-size: 1.6rem;
            }
            .faq-question {
              font-size: 0.85rem;
              padding: 0.8rem;
            }
            .faq-answer {
              font-size: 0.8rem;
            }
            .faq-answer.active {
              padding: 0.8rem;
              max-height: 400px;
            }
            .faq-question svg {
              width: 16px;
              height: 16px;
            }
          }
        `}
            </style>
            <div className="faq-container">
                <h2>Frequently Asked Questions</h2>
                <ul className="faq-list">
                    {faqs.map((faq, index) => (
                        <li key={index} className="faq-item">
                            <div
                                className={`faq-question ${activeIndex === index ? "active" : ""}`}
                                onClick={() => toggleFAQ(index)}
                            >
                                {faq.question}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M7 10l5 5 5-5H7z" />
                                </svg>
                            </div>
                            <div className={`faq-answer ${activeIndex === index ? "active" : ""}`}>
                                {faq.answer}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default FAQ;