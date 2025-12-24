# Job Nest

Job Nest is a full-stack web application that connects **candidates** and **recruiters** on a single platform.  
Recruiters can post jobs, and candidates can browse and apply for jobs with a single click.  
The platform supports authentication, role-based access, and job application tracking.

---

## 🚀 Features Implemented

### 👤 User Authentication
- User signup & login
- Role-based registration:
  - Candidate
  - Recruiter
- Secure authentication using sessions

### 💼 Job Management (Recruiter)
- Create job postings
- View posted jobs
- Job details include:
  - Job title
  - Company name
  - Job description
  - Location
  - Salary (optional)

### 📄 Job Browsing & Application (Candidate)
- View available jobs
- Single-click job application
- Prevent duplicate applications
- View all applied jobs

### 🗂 Job Application System
Each job application stores:
- Candidate ID
- Job ID
- Application date
- Status (`applied`)

### 📊 Dashboard
- Candidate dashboard:
  - View applied jobs
- Recruiter dashboard:
  - View posted jobs

### 🎨 UI & Templating
- EJS templates
- Tailwind CSS for modern UI
- Responsive and clean design

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Frontend:** EJS, Tailwind CSS
- **Authentication:** Express Sessions
- **ORM:** Mongoose

---
⚙️ Installation & Setup
1️⃣ Clone Repo
git clone https://github.com/your-username/job-nest.git
cd job-nest

2️⃣ Install Dependencies
npm install
