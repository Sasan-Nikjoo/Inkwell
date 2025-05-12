import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Root endpoint
app.get('/', (req, res) => {
    res.send('InkWell Backend');
});

// Get all posts with categories
app.get('/api/posts', (req, res) => {
    pool.query(`
    SELECT 
      posts.*,
      users.username AS author_username,
      ARRAY_AGG(categories.name) AS category_names
    FROM posts
    JOIN users ON posts.author_id = users.id
    LEFT JOIN post_categories ON posts.id = post_categories.post_id
    LEFT JOIN categories ON post_categories.category_id = categories.id
    GROUP BY posts.id, users.username
  `, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch posts' });
        }
        res.json(result.rows);
    });
});

// Create a post with categories
app.post('/api/posts', (req, res) => {
    const { title, content, authorId, categoryIds } = req.body;
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
    function commitAndFetchPost(postId: number, res: express.Response) {
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
});

// Like a post or comment
app.post('/api/likes', (req, res) => {
    const { userId, postId, commentId } = req.body;
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
});

// Unlike a post or comment
app.delete('/api/likes', (req, res) => {
    const { userId, postId, commentId } = req.body;
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
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));