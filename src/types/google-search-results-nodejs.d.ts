declare module 'google-search-results-nodejs' {
  class GoogleSearch {
    constructor(apiKey: string);
    json(params: any, callback: (result: any) => void): void;
  }
  
  export default class SerpApi {
    static GoogleSearch: typeof GoogleSearch;
  }
} 