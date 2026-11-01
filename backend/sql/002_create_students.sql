/* Tworzenie tabeli studentów */
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE
        REFERENCES users(id) 
        ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    student_number VARCHAR(6) NOT NULL UNIQUE
        CHECK (student_number ~ '^[0-9]{6}$')
);