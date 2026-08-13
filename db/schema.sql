CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    bubbles TEXT[],
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2) NOT NULL,
    off TEXT,
    img TEXT NOT NULL,
    feature BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role TEXT,
    pic TEXT,
    bio TEXT,
    experties TEXT[],
    experience TEXT,
    students_count TEXT,
    rating NUMERIC(2,1),
    linkedln TEXT,
    github TEXT,
    twitter TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);


ALTER TABLE courses 
ADD COLUMN instructor_id INTEGER REFERENCES instructors(id);


CREATE TABLE students (
     id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
)


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(255) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT NOW()
)