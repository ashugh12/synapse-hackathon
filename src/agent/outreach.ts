export async function generateOutreach(
    candidate: any,
    jobDescription: string
  ): Promise<{ message: string; confidence: number }> {
    const apiKey = process.env.GEMINI_API_KEY;
  
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in .env.local");
    }
  
    const prompt = `
  You are a technical recruiter.
  
  Candidate profile:
  - Name: ${candidate.name || "Unknown"}
  - Headline: ${candidate.headline || "Not provided"}
  - LinkedIn: ${candidate.linkedin_url || "Unknown"}
  
  Job:
  ${jobDescription}
  
  Tasks:
  1. Write a short professional outreach message personalized to this candidate.
  2. Estimate a confidence score (1-10) based on completeness and relevance of the candidate profile to this job.
  3. The message should be short and to the point, and should be personalized to the candidate.
  4. If not job link, don't 
  Respond ONLY in this raw JSON format (no backticks or markdown):
  {
    "message": "<Outreach message>",
    "confidence": 8.7
  }
  `;
  
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
  
      const result = await response.json();
      const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  
      console.log("🔍 Raw Gemini response:", rawText);
  
      // 🔧 Fix: Extract first JSON-looking block (ignores backticks and markdown)
      const match = rawText.match(/{[^}]+confidence[^}]+}/s);
      if (match) {
        console.log("✅ Found JSON match:", match[0]);
        const parsed = JSON.parse(match[0]);
        return {
          message: parsed.message || "Hi, I came across your profile and wanted to reach out.",
          confidence: parsed.confidence || 7.0,
        };
      }
  
      console.log("❌ No JSON match found. Trying alternative parsing...");
      
      // Try to find any JSON-like structure
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log("✅ Found alternative JSON:", parsed);
          return {
            message: parsed.message || "Hi, I came across your profile and wanted to reach out.",
            confidence: parsed.confidence || 7.0,
          };
        } catch (parseError) {
          console.log("❌ Failed to parse alternative JSON:", parseError);
        }
      }
  
      throw new Error("No valid JSON block found in Gemini response");
    } catch (error: any) {
      console.error("Gemini outreach message generation failed:", error.message);
      console.error("Full error:", error);
      return {
        message: "Hi, I came across your profile and wanted to reach out.",
        confidence: 6.5,
      };
    }
  }
  