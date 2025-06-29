// app/api/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchLinkedInProfiles } from "@/agent/search";
import { scoreCandidate } from "@/agent/score";
import { generateOutreach } from "@/agent/outreach";

export async function POST(req: NextRequest) {
  try {
    const { job_description } = await req.json();

    if (!job_description) {
      return NextResponse.json({ error: "Missing job_description" }, { status: 400 });
    }

    // 🔍 Search candidates from Google (LinkedIn URLs)
    const candidates = await searchLinkedInProfiles(job_description);

    // 📊 Score all candidates
    const scored = await Promise.all(
      candidates.map((candidate) => scoreCandidate(candidate))
    );

    // 🤖 Generate outreach for all candidates
    const enrichedCandidates = await Promise.all(
      scored.map(async (candidate) => {
        const { message, confidence } = await generateOutreach(candidate, job_description);
        return {
          ...candidate,
          outreach_message: message,
          confidence,
        };
      })
    );

    // 🔝 Return top 10
    const topCandidates = enrichedCandidates
      .sort((a, b) => b.fit_score - a.fit_score)
      .slice(0, 10);

    return NextResponse.json({
      job_id: job_description.toLowerCase().replace(/\s+/g, "-"),
      candidates_found: candidates.length,
      top_candidates: topCandidates,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
