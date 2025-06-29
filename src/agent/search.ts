import SerpApi from "google-search-results-nodejs";

const cache: Record<string, any[]> = {};

export async function searchLinkedInProfiles(jobDescription: string): Promise<any[]> {
  const cacheKey = jobDescription.toLowerCase().trim();
  if (cache[cacheKey]) return cache[cacheKey];

  const client = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY!);
  const params = {
    q: `site:linkedin.com/in "${jobDescription}"`,
    engine: "google",
    num: 20
  };

  try {
    const data = await new Promise<any>((resolve, reject) => {
      client.json(params, (result: any) => {
        if (result.error) reject(result.error);
        else resolve(result);
      });
    });

    const totalResults = data.organic_results?.length || 0;
    console.log(`🔍 Total search results: ${totalResults}`);

    const linkedInResults = (data.organic_results || [])
      .filter((r: any) => r.link && r.link.includes("linkedin.com/in"));
    
    console.log(`✅ LinkedIn profiles found: ${linkedInResults.length}/${totalResults}`);

    const profiles = linkedInResults.map((r: any) => ({
      name: r.title?.split("–")[0]?.trim() || "Unknown",
      headline: r.snippet || "N/A",
      linkedin_url: r.link,
      github_url: `https://github.com/${r.link.split("/").pop()}`
    }));

    cache[cacheKey] = profiles;
    console.log(`📊 Final candidates processed: ${profiles.length}`);
    return profiles;
  } catch (e: any) {
    console.error("❌ SerpAPI search failed:", e.message);
    return [];
  }
}
