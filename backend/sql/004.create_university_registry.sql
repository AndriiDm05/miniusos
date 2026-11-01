/* Tworzenie tabeli rejestru studentów */
CREATE TABLE student_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    student_number VARCHAR(6) NOT NULL UNIQUE
        CHECK (student_number ~ '^[0-9]{6}$')
);

/* Tworzenie tabeli rejestru wykładowców */
CREATE TABLE lecturer_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    employee_number VARCHAR(6) NOT NULL UNIQUE
        CHECK (employee_number ~ '^[0-9]{6}$')
);