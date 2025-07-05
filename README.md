# 🎓 Distant Class - Online Class Management System

> A fullstack web application for managing online classes, built with **Spring Boot** and **ReactJS**.

---

## 🧹 Features

### 👨‍🏫 Admin / Teacher

* Create, update, delete courses
* Assign students to classes
* Upload teaching materials
* Track attendance & progress

### 👨‍🎓 Student

* Register for available courses
* Access materials & class schedule
* Join online sessions
* View grades and feedback

---

## 🧱 Project Structure

```
distant-class/
├── backend/         # Spring Boot (Java)
│   ├── src/
│   └── pom.xml
├── frontend/        # ReactJS (JavaScript)
│   ├── src/
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Java 17+
* Maven
* Node.js (v18+)
* Docker & Docker Compose (optional)

---

### ⚙️ Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

> App runs at `http://localhost:8080`

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

> App runs at `http://localhost:3000`

---

### 🐳 Run with Docker Compose (Fullstack)

```bash
docker-compose up --build
```

---

## 🔐 Environment Configuration

* Backend: `application-local.yml` (ignored in git)
* Frontend: `.env.local` (ignored in git)

---

## 🧪 Testing

* Backend: JUnit + Mockito
* Frontend: React Testing Library + Jest

---

## 📁 Git Structure

* `develop`: development branch
* `main`: stable release
* Feature branches follow `feature/<feature-name>` convention

---

## 📚 Tech Stack

* **Backend**: Java 17, Spring Boot, Spring Security, JPA, MySQL, JWT
* **Frontend**: ReactJS, Axios, React Router, TailwindCSS
* **DevOps**: Docker, Docker Compose

---

## 🧑‍💻 Author

* \danhthanhf
* Github: \[[your-github-url]](https://github.com/danhthanhf)

---

## 📜 License

This project is licensed under the MIT License.
