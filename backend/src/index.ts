import express, { Request, Response, RequestHandler } from 'express';

// Enables frontend to make requests to the backend by setting appropriate HTTP headers.
import cors from 'cors';

import dotenv from 'dotenv';

// Used for user authentication by generating tokens during login and verifying them for protected routes.
import jwt from 'jsonwebtoken';

// Securely hashes passwords before storing them in the database and compares them during login.
import bcrypt from 'bcrypt';

import pool, { initializeDatabase } from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database schema
initializeDatabase().catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
});

// JWT middleware
const authenticateToken: RequestHandler = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user as { id: number; username: string; role: string };
        next();
    });
};

// Root endpoint
const rootHandler: RequestHandler = (req, res) => {
    res.send('InkWell Backend');
};
app.get('/', rootHandler);

// Register user
const registerHandler: RequestHandler = (req, res) => {
    const { email, username, password, role } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, username, and password are required' });
    }
    bcrypt.hash(password, 10, (error, hashedPassword) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to hash password' });
        }
        pool.query(
            `
      INSERT INTO users (email, username, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, username, role
    `,
            [email, username, hashedPassword, role || 'user'],
            (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Failed to register user' });
                }
                res.status(201).json(result.rows[0]);
            }
        );
    });
};
app.post('/api/users/register', registerHandler);

// Login user
const loginHandler: RequestHandler = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    pool.query(
        `
    SELECT * FROM users WHERE email = $1
  `,
        [email],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to login' });
            }
            if (result.rowCount === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            const user = result.rows[0];
            bcrypt.compare(password, user.password, (error, isMatch) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Failed to verify password' });
                }
                if (!isMatch) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }
                const token = jwt.sign(
                    { id: user.id, username: user.username, role: user.role },
                    process.env.JWT_SECRET as string,
                    { expiresIn: '1h' }
                );
                res.json({ token, user: { id: user.id, email: user.email, username: user.username, role: user.role } });
            });
        }
    );
};
app.post('/api/users/login', loginHandler);

// Get all categories
const getCategoriesHandler: RequestHandler = (req, res) => {
    pool.query(
        `
    SELECT * FROM categories
    ORDER BY name
  `,
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch categories' });
            }
            res.json(result.rows);
        }
    );
};
app.get('/api/categories', getCategoriesHandler);

// Create a category
const createCategoryHandler: RequestHandler = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }
    pool.query(
        `
    INSERT INTO categories (name)
    VALUES ($1)
    RETURNING *
  `,
        [name],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create category' });
            }
            res.status(201).json(result.rows[0]);
        }
    );
};
app.post('/api/categories', authenticateToken, createCategoryHandler);

// Get all posts with categories
const getPostsHandler: RequestHandler = (req, res) => {
    pool.query(
        `
    SELECT 
      posts.*,
      users.username AS author_username,
      ARRAY_AGG(categories.name) AS category_names
    FROM posts
    JOIN users ON posts.author_id = users.id
    LEFT JOIN post_categories ON posts.id = post_categories.post_id
    LEFT JOIN categories ON post_categories.category_id = categories.id
    GROUP BY posts.id, users.username
  `,
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch posts' });
            }
            res.json(result.rows);
        }
    );
};
app.get('/api/posts', getPostsHandler);

// Get a single post by ID
const getPostByIdHandler: RequestHandler = (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }
    pool.query(
        `
    SELECT 
      posts.*,
      users.username AS author_username,
      ARRAY_AGG(categories.name) AS category_names,
      (
        SELECT json_agg(json_build_object(
          'id', comments.id,
          'content', comments.content,
          'author_id', comments.author_id,
          'post_id', comments.post_id,
          'created_at', comments.created_at,
          'updated_at', comments.updated_at,
          'author_username', users_comments.username
        ))
        FROM comments
        JOIN users AS users_comments ON comments.author_id = users_comments.id
        WHERE comments.post_id = posts.id
      ) AS comments
    FROM posts
    JOIN users ON posts.author_id = users.id
    LEFT JOIN post_categories ON posts.id = post_categories.post_id
    LEFT JOIN categories ON post_categories.category_id = categories.id
    WHERE posts.id = $1
    GROUP BY posts.id, users.username
  `,
        [postId],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch post' });
            }
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json(result.rows[0]);
        }
    );
};
app.get('/api/posts/:id', getPostByIdHandler);

// Create a post with categories
const createPostHandler: RequestHandler = (req, res) => {
    const { title, content, categoryIds } = req.body;
    const authorId = req.user?.id;
    if (!authorId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    pool.query('BEGIN', (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create post' });
        }
        // Create post
        pool.query(
            `
      INSERT INTO posts (title, content, author_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
            [title, content, authorId],
            (error, postResult) => {
                if (error) {
                    pool.query('ROLLBACK');
                    console.error(error);
                    return res.status(500).json({ error: 'Failed to create post' });
                }
                const post = postResult.rows[0];

                // Add categories
                if (categoryIds && categoryIds.length > 0) {
                    const values = categoryIds
                        .map((categoryId: number) => `(${post.id}, ${categoryId})`)
                        .join(',');
                    pool.query(
                        `
            INSERT INTO post_categories (post_id, category_id)
            VALUES ${values}
          `,
                        (error) => {
                            if (error) {
                                pool.query('ROLLBACK');
                                console.error(error);
                                return res.status(500).json({ error: 'Failed to create post' });
                            }
                            commitAndFetchPost(post.id, res);
                        }
                    );
                } else {
                    commitAndFetchPost(post.id, res);
                }
            }
        );
    });

    // Helper function to commit and fetch post
    function commitAndFetchPost(postId: number, res: Response) {
        pool.query('COMMIT', (error) => {
            if (error) {
                pool.query('ROLLBACK');
                console.error(error);
                return res.status(500).json({ error: 'Failed to create post' });
            }
            pool.query(
                `
        SELECT 
          posts.*,
          users.username AS author_username,
          ARRAY_AGG(categories.name) AS category_names
        FROM posts
        JOIN users ON posts.author_id = users.id
        LEFT JOIN post_categories ON posts.id = post_categories.post_id
        LEFT JOIN categories ON post_categories.category_id = categories.id
        WHERE posts.id = $1
        GROUP BY posts.id, users.username
      `,
                [postId],
                (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: 'Failed to create post' });
                    }
                    res.status(201).json(result.rows[0]);
                }
            );
        });
    }
};
app.post('/api/posts', authenticateToken, createPostHandler);

// Update a post
const updatePostHandler: RequestHandler = (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }
    const { title, content, categoryIds } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if the user is the author or an admin
    pool.query(
        `
    SELECT author_id FROM posts WHERE id = $1
  `,
        [postId],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch post' });
            }
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }
            const post = result.rows[0];
            if (post.author_id !== userId && userRole !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized to update this post' });
            }

            // Begin transaction to update post and categories
            pool.query('BEGIN', (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Failed to update post' });
                }

                // Update post details
                pool.query(
                    `
          UPDATE posts
          SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
          WHERE id = $3
          RETURNING *
        `,
                    [title, content, postId],
                    (error, postResult) => {
                        if (error) {
                            pool.query('ROLLBACK');
                            console.error(error);
                            return res.status(500).json({ error: 'Failed to update post' });
                        }

                        // Update categories: delete existing and insert new ones
                        pool.query(
                            `
            DELETE FROM post_categories WHERE post_id = $1
          `,
                            [postId],
                            (error) => {
                                if (error) {
                                    pool.query('ROLLBACK');
                                    console.error(error);
                                    return res.status(500).json({ error: 'Failed to update post categories' });
                                }

                                if (categoryIds && categoryIds.length > 0) {
                                    const values = categoryIds
                                        .map((categoryId: number) => `(${postId}, ${categoryId})`)
                                        .join(',');
                                    pool.query(
                                        `
                INSERT INTO post_categories (post_id, category_id)
                VALUES ${values}
              `,
                                        (error) => {
                                            if (error) {
                                                pool.query('ROLLBACK');
                                                console.error(error);
                                                return res.status(500).json({ error: 'Failed to update post categories' });
                                            }
                                            commitAndFetchUpdatedPost(postId, res);
                                        }
                                    );
                                } else {
                                    commitAndFetchUpdatedPost(postId, res);
                                }
                            }
                        );
                    }
                );
            });
        }
    );

    // Helper function to commit and fetch updated post
    function commitAndFetchUpdatedPost(postId: number, res: Response) {
        pool.query('COMMIT', (error) => {
            if (error) {
                pool.query('ROLLBACK');
                console.error(error);
                return res.status(500).json({ error: 'Failed to update post' });
            }
            pool.query(
                `
        SELECT 
          posts.*,
          users.username AS author_username,
          ARRAY_AGG(categories.name) AS category_names
        FROM posts
        JOIN users ON posts.author_id = users.id
        LEFT JOIN post_categories ON posts.id = post_categories.post_id
        LEFT JOIN categories ON post_categories.category_id = categories.id
        WHERE posts.id = $1
        GROUP BY posts.id, users.username
      `,
                [postId],
                (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: 'Failed to fetch updated post' });
                    }
                    res.json(result.rows[0]);
                }
            );
        });
    }
};
app.put('/api/posts/:id', authenticateToken, updatePostHandler);

// Delete a post
const deletePostHandler: RequestHandler = (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if the user is the author or an admin
    pool.query(
        `
    SELECT author_id FROM posts WHERE id = $1
  `,
        [postId],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch post' });
            }
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }
            const post = result.rows[0];
            if (post.author_id !== userId && userRole !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized to delete this post' });
            }

            // Delete the post (cascades to post_categories, comments, likes)
            pool.query(
                `
        DELETE FROM posts WHERE id = $1
        RETURNING *
      `,
                [postId],
                (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: 'Failed to delete post' });
                    }
                    res.json({ message: 'Post deleted successfully', post: result.rows[0] });
                }
            );
        }
    );
};
app.delete('/api/posts/:id', authenticateToken, deletePostHandler);

// Get comments for a post
const getCommentsHandler: RequestHandler = (req, res) => {
    const { postId } = req.params;
    const postIdNum = parseInt(postId, 10);
    if (isNaN(postIdNum)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }
    pool.query(
        `
    SELECT 
      comments.*,
      users.username AS author_username
    FROM comments
    JOIN users ON comments.author_id = users.id
    WHERE comments.post_id = $1
    ORDER BY comments.created_at DESC
  `,
        [postIdNum],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch comments' });
            }
            res.json(result.rows);
        }
    );
};
app.get('/api/posts/:postId/comments', getCommentsHandler);

// Create a comment
const createCommentHandler: RequestHandler = (req, res) => {
    const { content, postId } = req.body;
    const authorId = req.user?.id;
    if (!content || !postId || !authorId) {
        return res.status(400).json({ error: 'Content, postId, and authentication are required' });
    }
    pool.query(
        `
    INSERT INTO comments (content, author_id, post_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
        [content, authorId, postId],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create comment' });
            }
            // Fetch comment with author username
            pool.query(
                `
        SELECT 
          comments.*,
          users.username AS author_username
        FROM comments
        JOIN users ON comments.author_id = users.id
        WHERE comments.id = $1
      `,
                [result.rows[0].id],
                (error, finalResult) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: 'Failed to fetch created comment' });
                    }
                    res.status(201).json(finalResult.rows[0]);
                }
            );
        }
    );
};
app.post('/api/comments', authenticateToken, createCommentHandler);

// Like a post or comment
const createLikeHandler: RequestHandler = (req, res) => {
    const { postId, commentId } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    pool.query(
        `
    INSERT INTO likes (user_id, post_id, comment_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
        [userId, postId || null, commentId || null],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create like' });
            }
            res.status(201).json(result.rows[0]);
        }
    );
};
app.post('/api/likes', authenticateToken, createLikeHandler);

// Unlike a post or comment
const deleteLikeHandler: RequestHandler = (req, res) => {
    const { postId, commentId } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    pool.query(
        `
    DELETE FROM likes
    WHERE user_id = $1
      AND (post_id = $2 OR $2 IS NULL)
      AND (comment_id = $3 OR $3 IS NULL)
    RETURNING *
  `,
        [userId, postId || null, commentId || null],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to delete like' });
            }
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Like not found' });
            }
            res.json(result.rows[0]);
        }
    );
};
app.delete('/api/likes', authenticateToken, deleteLikeHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: { id: number; username: string; role: string };
        }
    }
}