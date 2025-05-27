"use client";
import Link from "next/link";

const MostView: React.FC = () => {
    // Sample data for the 10 most viewed blogs
    const blogs = [
        { id: 1, title: "The Art of Storytelling", views: 12500, slug: "art-of-storytelling" },
        { id: 2, title: "Writing Through Adversity", views: 9800, slug: "writing-through-adversity" },
        { id: 3, title: "Crafting Memorable Characters", views: 8700, slug: "crafting-memorable-characters" },
        { id: 4, title: "The Power of Short Stories", views: 7600, slug: "power-of-short-stories" },
        { id: 5, title: "Finding Your Voice", views: 6500, slug: "finding-your-voice" },
        { id: 6, title: "Poetry in Everyday Life", views: 5400, slug: "poetry-in-everyday-life" },
        { id: 7, title: "Writing for Impact", views: 4300, slug: "writing-for-impact" },
        { id: 8, title: "The Journey of a Writer", views: 3200, slug: "journey-of-a-writer" },
        { id: 9, title: "Inspiration from Nature", views: 2100, slug: "inspiration-from-nature" },
        { id: 10, title: "Breaking Writer's Block", views: 1900, slug: "breaking-writers-block" },
    ];

    return (
        <section className="most-view">
            <style>
                {`
          .most-view {
            background: #1e3a8a;
            color: #e5e7eb;
            padding: 3rem 2rem;
            width: 100%;
            position: relative;
            z-index: 5;
          }
          .most-view-container {
            max-width: 80rem;
            margin: 0 auto;
            text-align: center;
          }
          .most-view h2 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 2rem;
          }
          .blog-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            padding: 0;
            list-style: none;
          }
          .blog-item {
            background: #172554;
            border-radius: 8px;
            padding: 1.5rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .blog-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(212, 175, 55, 0.2);
          }
          .blog-item a {
            text-decoration: none;
            color: #e5e7eb;
            font-size: 1.1rem;
            font-weight: 500;
            display: block;
            margin-bottom: 0.5rem;
            transition: color 0.3s ease;
          }
          .blog-item a:hover {
            color: #d4af37;
          }
          .blog-item span {
            font-size: 0.9rem;
            color: #94a3b8;
          }
          /* Responsive Styles */
          @media (max-width: 1024px) {
            .most-view h2 {
              font-size: 2.2rem;
            }
            .blog-list {
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            }
          }
          @media (max-width: 768px) {
            .most-view {
              padding: 2rem 1rem;
            }
            .most-view h2 {
              font-size: 2rem;
            }
            .blog-list {
              grid-template-columns: 1fr;
            }
            .blog-item {
              padding: 1.2rem;
            }
            .blog-item a {
              font-size: 1rem;
            }
            .blog-item span {
              font-size: 0.85rem;
            }
          }
          @media (max-width: 480px) {
            .most-view {
              padding: 1.5rem 0.8rem;
            }
            .most-view h2 {
              font-size: 1.8rem;
            }
            .blog-item {
              padding: 1rem;
            }
            .blog-item a {
              font-size: 0.95rem;
            }
            .blog-item span {
              font-size: 0.8rem;
            }
          }
          @media (max-width: 360px) {
            .most-view {
              padding: 1.2rem 0.6rem;
            }
            .most-view h2 {
              font-size: 1.6rem;
            }
            .blog-item {
              padding: 0.8rem;
            }
            .blog-item a {
              font-size: 0.9rem;
            }
            .blog-item span {
              font-size: 0.75rem;
            }
          }
        `}
            </style>
            <div className="most-view-container">
                <h2>Most Viewed Stories</h2>
                <ul className="blog-list">
                    {blogs.map((blog) => (
                        <li key={blog.id} className="blog-item">
                            <Link href={`/stories/${blog.slug}`}>
                                {blog.title}
                            </Link>
                            <span>{blog.views.toLocaleString()} views</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default MostView;