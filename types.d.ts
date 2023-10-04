type Product = {
  product_url: string
  image_url: string
  pending?: boolean
  productName?: string
  features?: Feature[]
} & Partial<ProductFeatures>

// TODO: This type might not even be needed if we get product_name elsewhere
type ProductFeatures = {
  features: Feature[]
  product_name: string
}

type Feature = {
  feature: string
  score: number
  explanation: string
}

type ProductUrl = string

// Received from backend
type ApiChatResponse = ApiChatMessageResponse | ApiRecommendedProductsResponse

type ApiChatMessageResponse = {
  type: "chat_message"
  data: ApiChatMessage
}

type ApiChatMessage = {
  text: string
}

type ApiRecommendedProductsResponse = {
  type: "recommended_products"
  data: {
    text: string
    recommended_products: ApiRecommendedProduct[]
  }
}

type ApiRecommendedProduct = {
  product_url: string
  image_url: string
  price: string
  product_name: string
  rating?: number
  num_reviews?: number
}

// Used by frontend
type ChatResponse = ChatMessageResponse | RecommendedProductsResponse

type ChatMessageResponse = {
  type: "chat_message"
  data: ChatMessage
}

type ChatMessage = {
  type: "response" | "user"
  text: string
}

type RecommendedProductsResponse = {
  type: "recommended_products"
  data: RecommendedProduct[]
}

type RecommendedProduct = {
  product_url: string
  image_url: string
  price: string
  product_name: string
  rating?: number
  num_reviews?: number
}
