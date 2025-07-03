import SerpApi from "google-search-results-nodejs";

export interface LinkedInProfile {
  name: string;
  headline: string;
  linkedin_url: string;
}

interface GoogleResult {
  link: string;
  title?: string;
  snippet?: string;
}

interface SerpApiResponse {
  organic_results?: GoogleResult[];
}

const cache: Record<string, LinkedInProfile[]> = {};

export async function searchLinkedInProfiles(jobDescription: string): Promise<LinkedInProfile[]> {
  const cacheKey = jobDescription.toLowerCase().trim();
  if (cache[cacheKey]) return cache[cacheKey];

  const client = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY!);
  const params = {
    q: `site:linkedin.com/in "${jobDescription}"`,
    engine: "google",
    num: 20,
  };

  try {
    const data = await new Promise<SerpApiResponse>((resolve, reject) => {
      client.json(params, (result: unknown) => {
        if (typeof result === "object" && result !== null && "error" in result) {
          reject((result as { error: string }).error);
        } else {
          resolve(result as SerpApiResponse);
        }
      });
    });

    const organicResults = data.organic_results ?? [];
    console.log(`🔍 Total search results: ${organicResults.length}`);

    const linkedInResults = organicResults.filter(
      (result): result is GoogleResult =>
        typeof result.link === "string" && result.link.includes("linkedin.com/in")
    );

    console.log(`✅ LinkedIn profiles found: ${linkedInResults.length}/${organicResults.length}`);

    const profiles: LinkedInProfile[] = linkedInResults.map((result) => ({
      name:
        typeof result.title === "string"
          ? result.title.split("–")[0]?.trim() || "Unknown"
          : "Unknown",
      headline: typeof result.snippet === "string" ? result.snippet : "N/A",
      linkedin_url: result.link,
    }));

    cache[cacheKey] = profiles;
    console.log(`📊 Final candidates processed: ${profiles.length}`);
    return profiles;
  } catch (e: unknown) {
    console.error("❌ SerpAPI search failed:", e instanceof Error ? e.message : e);
    return [];
  }
}
