CREATE TABLE IF NOT EXISTS post_notations(
    id SERIAL PRIMARY KEY, 
    post_id INTEGER NOT NULL,
    notation INTEGER NOT NULL
);

index post_notations_post_id_idx on post_notations(post_id);