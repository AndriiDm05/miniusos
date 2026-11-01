/* 
    Skrypt SQL do wypełnienia tabeli student_registry i lecturer_registry przykładowymi danymi.
    Wstawia przykładowych studentów i wykładowców do bazy danych.
*/
INSERT INTO student_registry (
    first_name, 
    last_name, 
    student_number
)
VALUES
    ('Jan', 'Kowalski', '123456'),
    ('Anna', 'Nowak', '234567'),
    ('Piotr', 'Zieliński', '345678'),
    ('Maria', 'Wiśniewska', '456789'),
    ('Adam', 'Wójcik', '567890');

INSERT INTO lecturer_registry (
    first_name,
    last_name,
    employee_number
)
VALUES
    ('Tomasz', 'Kowalczyk', '100001'),
    ('Katarzyna', 'Kamińska', '100002'),
    ('Michał', 'Lewandowski', '100003');