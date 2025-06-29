# 🤖 LinkedIn Sourcing Agent

A smart sourcing agent that uses LLMs (Gemini), web scraping, and scoring algorithms to find top candidates on LinkedIn based on a job description.

Built for the [Synapse AI Internship Challenge](https://app.synapserecruiternetwork.com/job-page/1750452159644x262203891027542000).

---

## 📌 Features

✅ Takes a job description as input  
✅ Searches LinkedIn profiles via Google Search (SerpAPI)  
✅ Scores candidates using a custom fit rubric  
✅ Generates personalized outreach messages using Gemini  
✅ Returns top candidates with fit score, breakdown, outreach message, and confidence  
✅ Modern web interface with real-time results  
✅ Implements caching, multi-source enrichment, and JSON API

---

## 🚀 Live Demo

Visit the application at `http://localhost:3000` after running `npm run dev`

### Features:
- **Modern UI**: Clean, responsive interface with real-time search
- **Interactive Results**: View candidate scores, breakdowns, and outreach messages
- **Direct Links**: Click to visit LinkedIn and GitHub profiles
- **Confidence Scoring**: See AI confidence levels for each outreach message
- **Statistics Dashboard**: Overview of search results and metrics

---

## ⚙️ Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/linkedin-sourcing-agent.git
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
curl -X POST http://localhost:3001/api \
  -H "Content-Type: application/json" \
  -d '{ "job_description": "Software Engineer, ML Research at Windsurf" }'
```

---

## 💡 How It Works

```text
Input Job → Search SerpAPI (LinkedIn) → Extract Profile URLs → Score Fit → Generate Outreach
     ↓                             ↓                        ↓              ↓
    Web UI                    SerpAPI + Cache          Score Rubric     Gemini 2.0 API
```

### 1. 🔍 LinkedIn Search

* Uses SerpAPI to search Google for `site:linkedin.com/in` queries
* Extracts name, headline, URL, and GitHub guess
* Memoizes results to avoid re-fetching
* Tracks search statistics (total results vs LinkedIn matches)

### 2. 📊 Fit Score Logic

Scoring breakdown based on Synapse rubric:

| Factor            | Weight |
| ----------------- | ------ |
| Education         | 20%    |
| Career Trajectory | 20%    |
| Company Relevance | 15%    |
| Skills Match      | 25%    |
| Location Match    | 10%    |
| Tenure            | 10%    |

```ts
const totalScore =
  0.2 * education + 0.2 * trajectory + 0.15 * company +
  0.25 * skills + 0.1 * location + 0.1 * tenure;
```

### 3. 🤖 Outreach Message

* Uses Google Gemini 2.0 API (via fetch)
* Generates JSON output with retry logic for rate limiting
* Uses regex to safely parse JSON from LLM response
* Includes confidence scoring for message quality

---

## 🎁 Bonus Features

| Bonus Feature           | Status | Notes                                       |
| ----------------------- | ------ | ------------------------------------------- |
| Modern Web Interface    | ✅      | React + Tailwind CSS with real-time updates |
| Multi-Source Enrichment | ✅      | Adds mock GitHub URL using LinkedIn handle  |
| Smart Caching           | ✅      | Uses in-memory cache based on job hash      |
| Confidence Scoring      | ✅      | Gemini estimates confidence in message JSON |
| Rate Limiting Handling  | ✅      | Retry logic with exponential backoff        |
| Search Statistics       | ✅      | Tracks total results vs LinkedIn matches    |
| Batch Processing (mock) | ⚠️     | Loop multiple jobs via queue (to be added)  |
| Hugging Face API        | ❌      | Not yet hosted on FastAPI                   |

---

## 📦 API Response Format

```json
{
  "job_id": "software-engineer,-ml-research-at-windsurf",
  "candidates_found": 15,
  "top_candidates": [
    {
      "name": "Jane Doe",
      "headline": "AI Engineer at OpenAI",
      "linkedin_url": "https://linkedin.com/in/janedoe",
      "github_url": "https://github.com/janedoe",
      "fit_score": 8.6,
      "score_breakdown": {
        "education": 9.0,
        "trajectory": 8.0,
        "company": 8.5,
        "skills": 9.0,
        "location": 7.0,
        "tenure": 7.0
      },
      "outreach_message": "Hi Jane, I noticed your 5 years at OpenAI...",
      "confidence": 8.7
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
- **Direct Links**: One-click access to LinkedIn and GitHub profiles
- **Outreach Preview**: View AI-generated outreach messages with confidence scores

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
* ⚠️  Bonus Hugging Face API: not deployed (currently local)

---

## ✍️ Write-up

### My Approach

I wanted to build a realistic agent that mimics how a recruiter works:

* Using SerpAPI instead of LinkedIn's API for reliable search results
* Judging candidate relevance with a real rubric
* Writing outreach like a human with AI assistance
* Providing a modern web interface for easy interaction

### Challenges

* Gemini sometimes outputs non-parseable JSON (solved via RegEx parsing)
* API rate limiting (solved with retry logic and exponential backoff)
* Linking GitHub with LinkedIn (mocked via URL username guessing)
* Creating an intuitive UI for complex data (solved with card-based layout)

### Scaling Plan

To scale to 100s of jobs:

* Add job queue (e.g. Bull or Temporal)
* Store LinkedIn profiles in Redis with expiry
* Use FastAPI on Hugging Face (or Vercel Edge functions)
* Add GitHub scraping via Octokit or user-site fallback
* Implement user authentication and job history

---

## 🙌 Thanks

This was built for the [Synapse AI Internship](https://synapse.to), with love from Ashutosh 💛
Built using TypeScript, Next.js, Gemini, SerpAPI, and a bunch of late nights ☕.
