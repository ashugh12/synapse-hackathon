declare module 'google-search-results-nodejs' {
  class GoogleSearch {
    constructor(apiKey: string);
    json(params: unknown, callback: (result: unknown) => void): void;
  }
  
  export default class SerpApi {
    static GoogleSearch: typeof GoogleSearch;
  }
} 