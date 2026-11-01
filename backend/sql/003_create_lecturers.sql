/* Tworzenie tabeli wykładowców */
CREATE TABLE lecturers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE
        REFERENCES users(id) 
        ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    employee_number VARCHAR(6) NOT NULL UNIQUE
        CHECK (employee_number ~ '^[0-9]{6}$')
);