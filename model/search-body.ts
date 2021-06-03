export interface SearchBody {
  query: SearchBodyQuery
}

export interface SearchBodyQuery {
  term: Record<string, any>
}
