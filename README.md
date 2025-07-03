# 🤖 LinkedIn Sourcing Agent

A smart sourcing agent that uses LLMs (Gemini), web scraping, and **dynamic scoring algorithms** to find top candidates on LinkedIn based on a job description. Features **AI-powered personalized outreach message generation** with confidence scoring.

Built for the [Synapse AI Internship Challenge](https://app.synapserecruiternetwork.com/job-page/1750452159644x262203891027542000).

---

## 📌 Features

✅ **Smart Job Description Input** - Takes detailed job descriptions as input  
✅ **LinkedIn Profile Search** - Searches LinkedIn profiles via Google Search (SerpAPI)  
✅ **Dynamic Candidate Scoring** - **NEW**: Analyzes profiles using AI-powered scoring algorithms  
✅ **Personalized Outreach Generation** - **NEW**: Creates tailored messages using Gemini AI  
✅ **Confidence Scoring** - Provides confidence levels for each outreach message  
✅ **Modern Web Interface** - Real-time results with interactive candidate cards  
✅ **Smart Caching** - Implements caching to avoid redundant API calls  
✅ **RESTful API** - JSON API with GET/POST endpoints  

---

## 🚀 Live Demo

Visit the application at `http://localhost:3000` after running `npm run dev`

### Features:
- **Modern UI**: Clean, responsive interface with real-time search
- **Interactive Results**: View candidate scores, breakdowns, and outreach messages
- **Direct Links**: Click to visit LinkedIn profiles
- **Confidence Scoring**: See AI confidence levels for each outreach message
- **Statistics Dashboard**: Overview of search results and metrics
- **Dynamic Scoring**: **NEW**: Real-time analysis of candidate profiles
- **Personalized Outreach**: **NEW**: AI-generated messages tailored to each candidate

---

## ⚙️ Setup

```bash
# 1. Clone the repo
git clone https://github.com/ashugh12/synapse-hackathon.git
cd linkedin-sourcing-agent

# 2. Install dependencies
npm install

# 3. Add your API keys
echo 'GEMINI_API_KEY=your_gemini_api_key_here' > .env.local
echo 'SERPAPI_KEY=your_serpapi_key_here' >> .env.local

# 4. Run the app (Next.js dev mode)
npm run dev

# 5. Open http://localhost:3000 in your browser
```

---

## 🧪 Test with cURL

```bash
# POST request with job description
curl -X POST http://localhost:3000/api \
  -H "Content-Type: application/json" \
  -d '{ "job_description": "Software Engineer with 5+ years experience in React, Node.js, and AWS for a fintech startup in San Francisco" }'

# GET request with query parameter
curl "http://localhost:3000/api?jobDescription=Senior%20Data%20Scientist%20Python%20Machine%20Learning"
```

---

## 💡 How It Works

```text
Input Job → Search SerpAPI (LinkedIn) → Dynamic Scoring → Personalized Outreach → Results
     ↓                             ↓                        ↓              ↓
    Web UI                    SerpAPI + Cache          AI Analysis     Gemini 2.0 API
```

### 1. 🔍 LinkedIn Search

* Uses SerpAPI to search Google for `site:linkedin.com/in` queries
* Extracts name, headline, and URL
* Memoizes results to avoid re-fetching
* Tracks search statistics (total results vs LinkedIn matches)

### 2. 📊 Dynamic Fit Score Logic

**NEW**: Intelligent scoring system that analyzes actual candidate profiles:

| Factor            | Weight | Analysis Method |
| ----------------- | ------ | --------------- |
| Education         | 15%    | Detects PhD, Master's, Bachelor's degrees |
| Career Trajectory | 20%    | Identifies CTO, VP, Senior, Lead, Manager roles |
| Company Relevance | 15%    | Recognizes top-tier companies (Google, Microsoft, etc.) |
| Skills Match      | 25%    | Counts relevant tech keywords (React, Python, AWS, etc.) |
| Location Match    | 10%    | Identifies major tech hubs and remote work |
| Tenure            | 15%    | Analyzes experience indicators (5+, 10+, etc.) |

**Scoring Examples:**
- Senior React Developer at Google → High scores (8.5+)
- Junior Developer → Lower but realistic scores (6.0-7.0)
- CTO with 10+ years → Very high scores (9.0+)

### 3. 🤖 Personalized Outreach Messages

**NEW**: AI-generated messages tailored to each candidate:

* **High Scorers (8.5+)**: Enthusiastic tone, immediate opportunity
* **Good Scorers (7.0-8.4)**: Positive tone, highlight relevant experience
* **Moderate Scorers (6.0-6.9)**: Professional tone, explore interest
* **Lower Scorers (5.5-5.9)**: Exploratory tone, discuss potential fit

**Features:**
- References specific strengths from candidate profile
- Adapts tone based on fit score
- Includes clear call-to-action
- Calculates confidence based on profile completeness

---

## 🎁 Enhanced Features

| Feature                    | Status | Description                                    |
| -------------------------- | ------ | ---------------------------------------------- |
| Modern Web Interface       | ✅      | React + Tailwind CSS with real-time updates   |
| Dynamic Scoring System     | ✅      | **NEW**: AI-powered analysis of candidate profiles |
| Personalized Outreach      | ✅      | **NEW**: Tailored messages based on fit scores |
| Confidence Scoring         | ✅      | Calculated based on fit score + profile quality |
| Smart Caching              | ✅      | In-memory cache based on job description hash  |
| Multi-Source Enrichment    | ✅      | Enhanced candidate data from LinkedIn profiles          |
| Rate Limiting Handling     | ✅      | Retry logic with exponential backoff           |
| Search Statistics          | ✅      | Tracks total results vs LinkedIn matches       |
| RESTful API                | ✅      | GET/POST endpoints with proper error handling  |
| Responsive Design          | ✅      | Mobile-friendly interface                       |

---

## 📦 API Response Format

```json
{
  "job_id": "software-engineer-with-5-years-experience-in-react-nodejs-and-aws",
  "candidates_found": 15,
  "top_candidates": [
    {
      "name": "Jane Doe",
      "headline": "Senior Software Engineer at Google | React, Node.js, AWS",
      "linkedin_url": "https://linkedin.com/in/janedoe",
      "fit_score": 8.6,
      "score_breakdown": {
        "education": 8.5,
        "trajectory": 8.5,
        "company": 9.0,
        "skills": 9.0,
        "location": 8.5,
        "tenure": 8.0
      },
      "outreach_message": "Hi Jane! I was impressed by your Senior Software Engineer role at Google and believe you'd be an excellent fit for our team. Your strong skills (9.0/10) and experience with React, Node.js, and AWS align perfectly with what we're looking for. Would you be interested in discussing this opportunity?",
      "confidence": 8.6
    }
  ]
}
```

---

## 🎨 Frontend Features

### Interactive Dashboard
- **Real-time Search**: Enter job descriptions and see results instantly
- **Candidate Cards**: Each candidate shows comprehensive information
- **Score Visualization**: Color-coded scores (green/yellow/red) for easy scanning
- **Direct Links**: One-click access to LinkedIn profiles
- **Outreach Preview**: View AI-generated outreach messages with confidence scores
- **Score Breakdown**: **NEW**: Detailed analysis of each scoring category

### Statistics Overview
- **Total Candidates Found**: Number of LinkedIn profiles discovered
- **Top Candidates**: Number of high-scoring candidates returned
- **Average Confidence**: Overall confidence in outreach message quality

### Responsive Design
- **Mobile-friendly**: Works seamlessly on all device sizes
- **Modern UI**: Clean, professional interface with smooth animations
- **Loading States**: Clear feedback during API calls
- **Error Handling**: User-friendly error messages

---

## 📝 Submission Requirements

* ✅ GitHub Repo: [github.com/your-username/linkedin-sourcing-agent](https://github.com/your-username/linkedin-sourcing-agent)
* ✅ README: ✔️ This file
* ✅ Demo Video: `./demo.mp4` (3-minute walk-through)
* ✅ Write-up: See below
* ✅ Web Interface: Modern React frontend with real-time results
* ✅ RESTful API: Proper GET/POST endpoints with error handling

---

## ✍️ Write-up

### My Approach

I built a realistic sourcing agent that mimics how a professional recruiter works:

* **Intelligent Search**: Using SerpAPI for reliable LinkedIn profile discovery
* **Dynamic Scoring**: **NEW**: AI-powered analysis of candidate profiles instead of static scores
* **Personalized Outreach**: **NEW**: Tailored messages based on candidate strengths and fit scores
* **Modern Interface**: Professional web UI for easy interaction and results visualization

### Key Improvements

* **Dynamic Scoring System**: Replaced static scores with intelligent analysis of candidate profiles
* **Personalized Outreach**: Messages now adapt to candidate fit scores and strengths
* **Confidence Calculation**: Realistic confidence levels based on profile completeness
* **Proper API Routing**: Fixed Next.js API route structure with GET/POST handlers
* **Enhanced Error Handling**: Better error messages and fallback mechanisms

### Technical Challenges Solved

* **JSON Parsing**: Robust parsing of Gemini API responses with fallback mechanisms
* **Dynamic Scoring**: Created algorithms to analyze candidate headlines and extract relevant information
* **API Rate Limiting**: Implemented retry logic and exponential backoff
* **TypeScript Integration**: Full type safety across the application
* **Responsive Design**: Mobile-friendly interface with modern UI components

### Scaling Plan

To scale to 100s of jobs:

* **Job Queue**: Add Bull or Temporal for batch processing
* **Database Storage**: Store LinkedIn profiles in Redis with expiry
* **Cloud Deployment**: Deploy on Vercel or Hugging Face Spaces
* **GitHub Integration**: Add real GitHub profile scraping via Octokit
* **User Authentication**: Implement user accounts and job history
* **Advanced Analytics**: Add detailed reporting and performance metrics

---

## 🙌 Thanks

This was built for the [Synapse AI Internship](https://synapse.to), with love from Ashutosh 💛

Built using TypeScript, Next.js, Gemini AI, SerpAPI, and a bunch of late nights ☕.

---
