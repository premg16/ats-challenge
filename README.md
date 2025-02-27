# AI-Powered Candidate Ranking System for Blue-Collar & Sales Roles

## Objective

Develop a Next.js web application that:

- **Allows multiple CV uploads** (supporting formats like PDF, DOCX, and plain text).
- **Parses each CV using AI APIs** (the user may choose which AI API to integrate) to extract key candidate information.
- **Matches and ranks candidates** against a set of predefined, detailed job roles focused on blue-collar and sales positions.
- **Provides a comprehensive match score and breakdown** for each candidate based on the intricate requirements of each role.
- **Displays the project on Vercel** with integrated AI functions, without the need for a dedicated backend.

## Provided Job Roles

A set of five detailed job roles will be provided in a JSON file. These roles include all necessary details such as:

- **Job Title and Company**
- **Location (based in Australia)**
- **Detailed Job Descriptions:**
    - Responsibilities
    - Technical and Practical Requirements
    - Soft Skills and Behavioral Traits
    - Experience and Education Requirements
    - Additional Criteria (e.g., hourly rate, shift timings)

_Example:_ A role like "Sales Representative" at "Retail Solutions Australia" will include details such as required POS system knowledge, customer engagement skills, and flexible shift timings.

## CV Generation for Testing

**Important:** Candidates must generate their own sample CVs to simulate various testing scenarios. These CVs should cover a range of candidate profiles, including variations in:

- **Skills:** Both technical (e.g., familiarity with retail software, machinery operation) and soft skills (e.g., customer service, teamwork).
- **Work Experience:** Different levels of experience in blue-collar or sales roles.
- **Educational Background:** Variations in formal education and certifications.

Generating diverse CV samples will help demonstrate:

- How well the AI parsing extracts key information.
- The accuracy of the matching algorithm across different candidate profiles.
- The robustness of the ranking system when handling multiple and varied CV inputs.

## Core Features

### 1. Multi-CV Upload and Parsing

- **CV Upload Interface:**
    - Supports drag-and-drop or file selection for uploading multiple CVs.
    - Accepts PDF, DOCX, and plain text formats.
- **Parsing Mechanism:**
    - Utilizes AI APIs (e.g., OpenAI API or another chosen AI service) to extract key information such as:
        - **Personal Details:** Name (or anonymized identifier).
        - **Skills:** Relevant to blue-collar and sales roles.
        - **Work Experience:** Job titles, companies, duration, and key responsibilities.
        - **Education & Certifications:** Degrees and industry-relevant certifications.
- **User Choice:** The application should allow the user to choose which AI API to integrate. The rationale behind this choice must be documented in the final project documentation.

### 2. Predefined Detailed Job Roles

- **Focus:** Blue-collar and sales roles.
- **Job Role Details:** Each role includes:
    - **Basic Identifiers:** Job title, company, and location.
    - **Detailed Job Description:**
        - **Responsibilities:** Clear explanation of daily tasks.
        - **Technical & Practical Requirements:** Specific skills, tools, or operational knowledge.
        - **Soft Skills:** Desired interpersonal and behavioral traits.
        - **Experience & Educational Requirements:** Years of experience, education level, and certifications.
        - **Additional Criteria:** Hourly rate, shift timings, and other relevant factors.

### 3. Matching Process and Scoring

- **Data Extraction & Comparison:**
    - Compare candidate information extracted from the CVs with the detailed job role descriptions.
- **Matching Criteria:**
    - **Skills Overlap:** Matching candidate skills with job requirements.
    - **Experience Alignment:** Evaluation of work experience and responsibilities.
    - **Educational Fit:** Assessment of educational background and certifications.
    - **Soft Skills Compatibility:** Analysis based on mentions of interpersonal skills.
- **Scoring Algorithm:**
    - **Weighted Factors Example:**
        - 40% Skills Match
        - 30% Experience & Responsibilities
        - 20% Education & Certifications
        - 10% Soft Skills
    - **Output:** An overall match score (percentage or numerical value) with a detailed breakdown of contributing factors.

### 4. Candidate Ranking and Display

- **Dashboard Overview:**
    - Displays a ranked list of candidates for each job role based on their match scores.
- **Detailed Candidate View:**
    - **Overview:** Shows candidate name (or anonymized ID), overall match score, and key matching highlights.
    - **Breakdown:** Provides an in-depth explanation of how the candidate’s skills, experience, and education align with the role.

## Technical Approach

### Frontend & AI Integration

- **Framework:** Next.js will be used to build the application, ensuring a fast, responsive UI.
- **Hosting:** The project will be deployed on Vercel, leveraging its serverless functions if needed.
- **AI Functions:**
    - All AI-powered parsing and matching functions will be integrated directly into the Next.js project.
    - Developers can use client-side or serverless functions (API routes) to call the selected AI APIs.

### Data Storage & Job Roles

- **Job Roles:** Stored as a JSON file within the project, containing the predefined detailed job roles.
- **CV Data:** Uploaded CVs will be processed directly in the application; no persistent backend storage is required.

## Testing & Documentation

- **Unit Tests:**
    - Validate the accuracy of CV parsing functions.
    - Test the matching algorithm for correct score calculations.
    - Verify the functionality of key UI components (upload interface, dashboard, detailed views).
- **Documentation:**
    - Provide a comprehensive README with setup instructions and environment configurations (including API keys).
    - **Final Document:** Include a detailed explanation of the chosen AI API/library, along with the overall design rationale and any considerations for future enhancements.

## Final Workflow

1. **Upload:** Recruiters upload multiple CVs through the web interface.
2. **Parsing:** AI functions process each CV using the selected AI API to extract candidate data.
3. **Job Matching:** The system compares the extracted candidate data against the provided detailed job roles.
4. **Scoring:** Each candidate receives a match score with a detailed breakdown of strengths and weaknesses.
5. **Display:** Candidates are ranked on a dashboard with detailed views for each candidate.
6. **Final Documentation:** A final document must explain the chosen AI API/library and justify all design decisions.

---

_Note: While the job roles are provided as dummy data (see the accompanying JSON file), candidates must create and test with their own CV samples to fully demonstrate the functionality and robustness of the matching system._
