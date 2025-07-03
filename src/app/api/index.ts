import { searchLinkedInProfiles } from "@/agent/search";
import { scoreCandidate } from "@/agent/score";
import { generateOutreach } from "@/agent/outreach";

export async function POST(req: Request) {
  const { job_description } = await req.json();

  if (!job_description) {
    return new Response(
      JSON.stringify({ error: "Job description is required" }),
      { status: 400 }
    );
  }

  // 🔍 1. Search Candidates
  const candidates = await searchLinkedInProfiles(job_description);

  // 📊 2. Score all candidates
  const scored = await Promise.all(
    candidates.map((candidate) => scoreCandidate(candidate))
  );

  // 🤖 3. Generate outreach messages for ALL candidates (not just top 5)
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

  // 🏆 4. (Optional) Sort by fit_score and return top 10
  const topCandidates = enrichedCandidates
    .sort((a, b) => (b.fit_score ?? 0) - (a.fit_score ?? 0))
    .slice(0, 10);

  return new Response(
    JSON.stringify({
      job_id: job_description.toLowerCase().replace(/\s/g, "-"),
      candidates_found: candidates.length,
      top_candidates: topCandidates,
    }),
    { status: 200 }
  );
}
