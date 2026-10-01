# ResumIQ

**AI-powered resume analysis and job targeting.**

---

ResumIQ helps you understand how well your resume fits a job and what you can improve. Upload your resume, analyze it standalone, or provide a specific job target to get AI-powered insights into your resume.

---

### Features

- 📄 Upload and parse PDF resumes
- 🤖 AI-powered analysis with Google Gemini 
- 📊 Overall and ATS scores
- 💪 Resume strengths and weaknesses
- 🛠️ Existing, missing, and recommended skills
- 💡 Personalized improvement suggestions
- 🎯 Job-specific resume analysis
- 🔐 Authentication with Better Auth
- 📚 Resume and analysis history

----

### 🧠 How It Works
**1. Upload your resume**

Upload your resume as a PDF and resumIQ extracts the relevant information from it.

**2. Choose an analysis type**

You can analyze your resume in two ways:

- **Standalone Analysis**

  Analyze your resume without targeting a specific job. This gives you a general overview of your resume, including its overall score, ATS score, strengths, weaknesses, skills, missing skills, and suggestions.

- **Job-Targeted Analysis**

  Provide a specific job target along with your resume. resumIQ analyzes the relationship between your resume and the target role, helping identify relevant skills, missing skills, strengths, weaknesses, and improvement opportunities.

**3. Get AI-powered insights**

Google Gemini processes the extracted resume information and generates structured analysis.

*You receive insights including:*
- Overall score
- ATS score
- Strengths
- Weaknesses
- Existing skills
- Missing skills
- Recommended skills
- Improvement suggestions

---

### 🛠️ Tech Stack

| Technology        | Purpose                    |
|-------------------|----------------------------|
| Next.js           | Full-stack React framework |
| TypeScript        | Type-safe development      |
| Tailwind CSS      | Styling and UI             |
| MongoDB           | Database                   |
| Better Auth       | Authentication             |
| Google Gemini     | AI-powered resume analysis |
| PDF Parser        | Resume PDF processing      |
| Recharts          | Data visualization         |
| Vercel            | Deployment                 |

---


### 🏗️ Architecture

ResumIQ follows a server-oriented architecture where authentication, resume processing, AI analysis, and database operations are handled on the server.

---

### 📁 Project Structure

A simplified structure of the application:
```
resumIQ/
├──src/
|    ├── app/
|    │   ├── auth/
|    │   │   ├── login/
|    │   │   └── signup/
|    │   └── ...
|    ├── components/
|    │   └── ...
|    ├── ui/
|    │   └── ...
|    ├── lib/
|    │   └── ...
|    ├── actions/
|    │   └── ...
|    ├── server/
|    │   ├── dbqueries/
|    │   └── ...
|    └── types/
|        └── ...
├── public/
├── ...
├── .env.local
└── package.json
```

The exact structure may vary as the project evolves.

---

### Getting Started

1. Clone the repository
``` 
  git clone https://github.com/salinatak09/resumiq.git
  cd resumiq 
```

2. Install dependencies
```
  npm install
```

3. Configure environment variables
```
Create a .env.local file:

MONGODB_URI=<Mongo-uri>
BETTER_AUTH_SECRET=<better-auth-secret-key>
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
GEMINI_API_KEY=<api-key>
```

Add the required values for your environment.

4. Run the development server
```
  npm run dev
```
Open http://localhost:3000 in your browser.

---

## 🔮 Future Improvements

Potential improvements for future versions include:

- Resume editing and optimization
- More detailed ATS analysis
- Job description parsing and matching improvements
- More granular scoring
- Resume version tracking
- Exportable analysis reports
- Additional AI models
- More advanced job-specific recommendations

---

### Project Status

ResumIQ is a personal project built to explore AI-powered resume analysis, job targeting, document processing, and modern full-stack application development.

The project is actively evolving.

---

### 👨‍💻 Author

Built as a personal project to explore the intersection of AI, career tools, and modern web development.

ResumIQ — Understand your resume. Target the right job.

---

### License

No license has been added yet.

---