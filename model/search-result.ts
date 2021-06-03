export interface SearchResult {
  took: number
  timed_out: boolean
  _shards: Record<string, any>
  hits: SearchHitData
}

export interface SearchHitData {
  total: SearchHitTotal
  max_score: number
  hits: SearchHit[]
}

export interface SearchHitTotal {
  value: number
  relation: string
}

export interface SearchHit {
  _index: string
  _type: string
  _id: string
  _score: number
  _source: Record<string, any>
}
