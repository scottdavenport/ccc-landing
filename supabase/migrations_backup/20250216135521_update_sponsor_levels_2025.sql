-- Remove any existing sponsor levels we're about to recreate
DELETE FROM sponsor_levels;

-- Add all sponsor levels with correct amounts
INSERT INTO sponsor_levels (name, amount) VALUES
    ('Champion', 5000),
    ('Eagle', 2500),
    ('Golf Gift', 2500),
    ('Celebration Lunch', 2500),
    ('Bloody Mary', 1000),
    ('Golf Cart', 1000),
    ('Celebration Wall', 700),
    ('Thursday Night', 700),
    ('Chick-Fil-A AM', 500),
    ('Bojangles PM', 500);

--- Down ---
DELETE FROM sponsor_levels;

-- Restore original sponsor levels
INSERT INTO sponsor_levels (name, amount) VALUES
    ('Champion', 10000),
    ('Eagle', 7500),
    ('Platinum', 5000),
    ('Gold', 2500),
    ('Silver', 1000),
    ('Bronze', 500);