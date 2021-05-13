export interface MetaData {
  name: string
  content: string
}

export interface HeadData {
  title: string
  metaList: MetaData[]
}

export interface LocationExtraNote {
  title: string
  content: string
}

export interface Section1 {
  title: string
  subTitle: string
  locationExtraNote: LocationExtraNote
  displayMap: boolean
}

export interface Section2Category {
  img: string
  title: string
  order: number
  isVisible: boolean
}

export interface Section2 {
  title: string
  content: string
  categories: Section2Category[]
  isVisible: boolean
  imgVisible: boolean
}

export interface Section3 {
  title: string
  content: string
  isVisible: boolean
  imgLink: string
  imgVisible: boolean
}

export interface Section4Card {
  img: string
  title: string
  subtitle: string
  price: string
  order: number
  isVisible: boolean
}

export interface Section4 {
  title: string
  content: string
  isVisible: boolean
  cards: Section4Card[]
  imgVisible: boolean
}

export interface Review {
  order: number
  score: number
  day: string
  content: string
  reviewer: string
  isVisible: boolean
}

export interface Section5 {
  title: string
  reviews: Review[]
}

export interface CommingSoon {
  title: string
  subtitle: string
  flag: boolean
}

export interface SpecificConfigParams {
  headData: HeadData
  section1: Section1
  section2: Section2
  section3: Section3
  section4: Section4
  section5: Section5
  commingsoon: CommingSoon
}

export interface SlugParam {
  id: number
  slug: string
}

export interface ProductsParams {
  name: string
  img: string
}

export interface SpecificConfigArray {
  id: number
  config: SpecificConfigParams
}
