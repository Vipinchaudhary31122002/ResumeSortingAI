# ResumeSortingAI

ResumeSortingAI is an AI-powered resume sorting application designed to streamline the hiring process by automatically analyzing, scoring, and ranking candidates’ resumes. It leverages natural language processing and machine learning to extract key information from resumes (such as contact details, skills, education, and experience) and match them against job descriptions. For example, the backend AI service (implemented in Python with FastAPI) loads a sentence-transformer model to compute semantic similarity between job descriptions and resumes. The system also uses spaCy and regular expressions to parse resume content – extracting fields like Name and Skills from the text. Overall, the application provides a web-based interface (built in Next.js/React) where users can upload resumes and job descriptions and receive an “ATS score” and sorted list of candidates, based on 60% embedding similarity and 40% keyword matching.

## Features

* **AI-driven Resume Parsing:** Automatically extract candidate details (name, email, phone, skills, education, experience) from uploaded resumes using NLP techniques.
* **Semantic Matching:** Compute a similarity score between each resume and the job description using a pre-trained sentence-transformer (all-MiniLM-L6-v2) model.
* **Keyword Matching:** Identify required skills from the job description and calculate a keyword match percentage with each resume’s skills.
* **ATS Scoring:** Combine semantic and keyword matches into a unified ATS score (60% weight to embedding similarity and 40% to keyword overlap).
* **Batch Upload & Processing:** Upload multiple resumes (e.g. in a ZIP) and create a “job batch” for processing. The system stores resumes in object storage (using Supabase) and processes them in bulk.
* **User Authentication:** Secure user login and signup functionality (e.g. via email or Google OAuth), enabling each user to manage their own job batches.
* **Dashboard Interface:** A React/Next.js frontend provides pages for the landing page, login/signup, user dashboard, and resume analysis results.
* **CSV Export:** Export sorted resume data and scores as CSV for reporting.
* **Containerized Deployment:** Docker and docker-compose files are provided for easy setup of the frontend, backend, and AI services.

## Installation Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Vipinchaudhary31122002/ResumeSortingAI.git
   cd ResumeSortingAI
   ```

2. **Prerequisites:**

   * Install [Node.js](https://nodejs.org/) (for frontend and backend) and [Python 3](https://www.python.org/) (for AI service).
   * Set up a PostgreSQL database (or provide a connection string).
   * Create a [Supabase](https://supabase.com/) project or equivalent for object storage (the code uses Supabase storage for resumes).
   * (Optional) Install [Docker](https://docs.docker.com/) if running via containers.

3. **Backend setup (Node.js):**

   ```bash
   cd backend
   npm install            # Install Node dependencies
   cp .env.example .env   # Create a .env file with your configuration (database URL, JWT secret, Supabase keys, etc.)
   npm run dev            # Start the Express.js backend server in development (uses nodemon):contentReference[oaicite:6]{index=6}.
   ```

4. **Frontend setup (Next.js):**

   ```bash
   cd ../frontend
   npm install            # Install frontend dependencies
   cp .env.local.example .env.local  # Set any API endpoint URLs
   npm run dev            # Launch the Next.js development server (typically at http://localhost:3000)
   ```

5. **AI Service setup (Python/FastAPI):**

   ```bash
   cd ../ai
   pip install -r requirements.txt  # Install Python dependencies (spaCy, fastapi, sentence-transformers, etc.)
   python -m spacy download en_core_web_sm  # Download the spaCy English model
   uvicorn main:app --reload     # Start the FastAPI server (e.g. at http://localhost:8000):contentReference[oaicite:7]{index=7}:contentReference[oaicite:8]{index=8}.
   ```

6. **Docker (optional):** Alternatively, you can use Docker Compose for a full setup. The repository includes `docker-compose.dev.yml` and `docker-compose.prod.yml` for development and production. Simply run `docker-compose up --build` to launch all services in containers.

## Usage

* Navigate to the web app (by default at [http://localhost:3000](http://localhost:3000)) to register/login.
* Create a new **Job Batch** by providing a job title and description.
* Upload one or more resume files (PDF or text) through the batch interface. The system will store them in the object store and process each resume via the AI service.
* View the dashboard to see uploaded batches. Click on a batch to see analysis results, including the ATS scores, matched keywords, and extracted candidate info.
* You can export the results to CSV for further review.
* In development, you can test the AI service directly by sending a POST request to `/generate-report` with JSON `{ job_description: "...", resume_url: "https://..." }`. The response contains detailed resume fields and scoring.

## Folder Structure

```
ResumeSortingAI/
├── ai/              # Python AI service (FastAPI)
│   ├── helpers/     # NLP helpers (resume parsing, job parsing, scoring)
│   ├── main.py      # FastAPI application for processing resumes:contentReference[oaicite:11]{index=11}:contentReference[oaicite:12]{index=12}
│   ├── models/      # Model loading (sentence-transformer):contentReference[oaicite:13]{index=13}
│   └── requirements.txt
├── backend/         # Node.js (Express) API server
│   ├── src/
│   │   ├── controllers/  # Controllers (AuthController, JobBatchController, ResumeController, etc.)
│   │   ├── routes/       # API routes
│   │   └── db/           # Database connection and schemas (using Drizzle ORM for PostgreSQL)
│   ├── package.json      # Node dependencies (Express, Drizzle-ORM, Multer, etc.):contentReference[oaicite:14]{index=14}
│   └── .env.example
├── frontend/        # Next.js (React) web application
│   ├── public/      # Static assets (images, icons)
│   ├── src/
│   │   ├── app/          # Next.js pages (dashboard, login, signup, etc.):contentReference[oaicite:15]{index=15}
│   │   └── components/   # Reusable React components (forms, navbar)
│   ├── package.json      # Frontend dependencies (Next.js, React, axios):contentReference[oaicite:16]{index=16}
│   └── .env.local.example
├── docker-compose.dev.yml   # Docker Compose for development
├── docker-compose.prod.yml  # Docker Compose for production
└── README.md        # (This file)
```

## Technologies Used

* **Languages:** The code is primarily in JavaScript/TypeScript (Node.js backend and React/Next.js frontend) and Python for the AI service.
* **Frontend:** Next.js (React) for UI, axios for HTTP requests, and CSS for styling.
* **Backend:** Node.js with Express framework, Drizzle ORM for PostgreSQL, JWT for auth, Multer for file uploads, and Supabase for cloud storage.
* **AI/NLP:** FastAPI and Pydantic (Python) for the resume processing API, spaCy (en\_core\_web\_sm) for text parsing, and the Hugging Face “all-MiniLM-L6-v2” SentenceTransformer for semantic similarity. PyMuPDF (fitz) and regex are used to extract text, emails, and phone numbers from PDFs.
* **Database:** PostgreSQL (accessed via Drizzle ORM) to store users, job batches, and resume data.
* **Storage:** Supabase storage (S3-compatible) is used to save resume files.
* **Containerization:** Docker and Docker Compose scripts for easy deployment and environment setup.
* **Others:** Eslint, Prettier, and VSCode devcontainer configs for development.

## Contributing

Contributions are welcome! If you find bugs, want to add features, or improve documentation, please fork the repository and open a pull request. Make sure to follow the existing code style and include tests where applicable. For significant changes, please open an issue first to discuss your ideas.

*No screenshots or demo link are currently available.* This section can be updated once a live demo or example images are provided.

**References:** The above information is based on the repository’s source code and commit history, which demonstrate the core functionalities and architecture of the project.
