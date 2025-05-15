import bcrypt from 'bcrypt';
import pool from './db';

function seedDatabase(callback: (error?: Error) => void) {
    // Start transaction
    pool.query('BEGIN', (error) => {
        if (error) {
            console.error('Failed to start transaction:', error);
            return callback(error);
        }

        // Truncate all tables with CASCADE
        pool.query(
            `
      TRUNCATE users, categories, posts, post_categories, comments, likes RESTART IDENTITY CASCADE
    `,
            (error) => {
                if (error) {
                    pool.query('ROLLBACK');
                    console.error('Failed to truncate tables:', error);
                    return callback(error);
                }

                // Seed users
                bcrypt.hash('password', 10, (error, hashedPassword) => {
                    if (error) {
                        pool.query('ROLLBACK');
                        console.error('Failed to hash password:', error);
                        return callback(error);
                    }

                    pool.query(
                        `
          INSERT INTO users (email, username, password, role)
          VALUES 
            ('test@example.com', 'testuser', $1, 'user'),
            ('admin@example.com', 'adminuser', $1, 'admin')
          RETURNING *
        `,
                        [hashedPassword],
                        (error, userResult) => {
                            if (error) {
                                pool.query('ROLLBACK');
                                console.error('Failed to seed users:', error);
                                return callback(error);
                            }
                            const users = userResult.rows;
                            const testUserId = users.find((u) => u.username === 'testuser')?.id;

                            // Seed categories
                            pool.query(
                                `
                  INSERT INTO categories (name)
                  VALUES 
                    ('Technology'),
                    ('Lifestyle'),
                    ('Education')
                  RETURNING *
                `,
                                (error, categoryResult) => {
                                    if (error) {
                                        pool.query('ROLLBACK');
                                        console.error('Failed to seed categories:', error);
                                        return callback(error);
                                    }
                                    const categories = categoryResult.rows;
                                    const techCategoryId = categories.find((c) => c.name === 'Technology')?.id;
                                    const lifestyleCategoryId = categories.find((c) => c.name === 'Lifestyle')?.id;

                                    // Seed posts
                                    pool.query(
                                        `
                      INSERT INTO posts (title, content, author_id)
                      VALUES 
                        ('Tech Trends 2025', 'Exploring new tech innovations.', $1),
                        ('Healthy Living Tips', 'Guide to a balanced lifestyle.', $1),
                        ('Learning Strategies', 'Effective study techniques.', $1)
                      RETURNING *
                    `,
                                        [testUserId],
                                        (error, postResult) => {
                                            if (error) {
                                                pool.query('ROLLBACK');
                                                console.error('Failed to seed posts:', error);
                                                return callback(error);
                                            }
                                            const posts = postResult.rows;
                                            const techPostId = posts.find((p) => p.title === 'Tech Trends 2025')?.id;

                                            // Seed post_categories
                                            pool.query(
                                                `
                          INSERT INTO post_categories (post_id, category_id)
                          VALUES 
                            ($1, $2),
                            ($1, $3),
                            ($4, $3)
                        `,
                                                [techPostId, techCategoryId, lifestyleCategoryId, posts[1].id],
                                                (error) => {
                                                    if (error) {
                                                        pool.query('ROLLBACK');
                                                        console.error('Failed to seed post_categories:', error);
                                                        return callback(error);
                                                    }

                                                    // Seed comments
                                                    pool.query(
                                                        `
                              INSERT INTO comments (content, author_id, post_id)
                              VALUES 
                                ('Great insights!', $1, $2),
                                ('Very informative.', $1, $2)
                              RETURNING *
                            `,
                                                        [testUserId, techPostId],
                                                        (error) => {
                                                            if (error) {
                                                                pool.query('ROLLBACK');
                                                                console.error('Failed to seed comments:', error);
                                                                return callback(error);
                                                            }

                                                            // Seed likes
                                                            pool.query(
                                                                `
                                  INSERT INTO likes (user_id, post_id)
                                  VALUES 
                                    ($1, $2)
                                  RETURNING *
                                `,
                                                                [testUserId, techPostId],
                                                                (error) => {
                                                                    if (error) {
                                                                        pool.query('ROLLBACK');
                                                                        console.error('Failed to seed likes:', error);
                                                                        return callback(error);
                                                                    }

                                                                    // Commit transaction
                                                                    pool.query('COMMIT', (error) => {
                                                                        if (error) {
                                                                            pool.query('ROLLBACK');
                                                                            console.error('Failed to commit transaction:', error);
                                                                            return callback(error);
                                                                        }
                                                                        console.log('Database seeded successfully');
                                                                        callback();
                                                                    });
                                                                }
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                });
            }
        );
    });
}

// Run the seed function
seedDatabase((error) => {
    if (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
    pool.end(() => {
        console.log('Database connection closed');
        process.exit(0);
    });
});