import Config from "../../config/config"
import { SearchBody } from "../../model/search-body"
import { SearchParams } from "../../model/search-params"
import { SearchResult } from "../../model/search-result"
import ApiClient from "../api-client"

export default class SearchService {
  private static instance: SearchService
  private apiClient: ApiClient

  private constructor() {
    this.apiClient = ApiClient.getInstance()
  }

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService()
    }

    return SearchService.instance
  }

  generalSearch(params: SearchParams): Promise<SearchResult> {
    return this.apiClient.get<SearchResult>(
      `${Config.SEARCH_SERVICE_API_URL}combined-search/_search`,
      params
    )
  }

  complexSearch(body: SearchBody): Promise<SearchResult> {
    return this.apiClient.post<SearchResult>(
      `${Config.SEARCH_SERVICE_API_URL}combined-search/_search`,
      body
    )
  }
}
