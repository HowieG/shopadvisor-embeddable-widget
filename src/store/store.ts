import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

type State = {
  chatResponses: ChatResponse[];
  products: Product[];
  selectedProducts: ProductUrl[];
  userMessageCount: number;
  hasInteractedWithThumbnail: boolean;
  sessionId: string;
  addChatResponses: (chatResponses: ChatResponse | ChatResponse[]) => void;
  addSelectedProduct: (productUrl: ProductUrl) => void;
  removeSelectedProduct: (productUrl: ProductUrl) => void;
  addProduct: (product: Product, pending: boolean) => void;
  removeProduct: (productUrl: ProductUrl) => void;
  updateProduct: (updatedProduct: Product) => void;
  setHasInteractedWithThumbnail: (value: boolean) => void;
  incrementUserMessageCount: () => void;
  getSelectedProductUrls: () => ProductUrl[];
  getProducts: () => Product[];
  resetSession: () => void;
};

const store = (set) => ({
  chatResponses: [],
  products: [],
  selectedProducts: [],
  userMessageCount: 0,
  hasInteractedWithThumbnail: false,
  sessionId: uuidv4(),
  addChatResponses: (chatResponses: ChatResponse | ChatResponse[]) => {
    set((state) => {
      const newChatResponses = Array.isArray(chatResponses)
        ? chatResponses
        : [chatResponses];
      return { chatResponses: [...state.chatResponses, ...newChatResponses] };
    });
  },
  addSelectedProduct: (productUrl: ProductUrl) =>
    set((state) => ({
      selectedProducts: [...state.selectedProducts, productUrl],
    })),
  removeSelectedProduct: (productUrl: ProductUrl) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.filter(
        (url) => url !== productUrl
      ),
    })),
  addProduct: (product: Product, pending = false) => {
    set((state) => {
      const updatedProducts = pending
        ? [product, ...state.products]
        : [...state.products, product];
      return {
        products: updatedProducts,
        selectedProducts: state.hasInteractedWithThumbnail
          ? [product.product_url]
          : [...state.selectedProducts, product.product_url],
      };
    });
  },
  removeProduct: (productUrl: ProductUrl) =>
    set((state) => ({
      products: state.products.filter(
        (product) => product.product_url !== productUrl
      ),
    })),
  updateProduct: (updatedProduct: Product) =>
    set((state) => {
      const updatedProducts = state.products.map((product) =>
        product.product_url === updatedProduct.product_url
          ? updatedProduct
          : product
      );
      return { products: updatedProducts };
    }),
  setHasInteractedWithThumbnail: (value: boolean) =>
    set({ hasInteractedWithThumbnail: value }),
  incrementUserMessageCount: () =>
    set((state) => ({ userMessageCount: state.userMessageCount + 1 })),
  getSelectedProductUrls: () => set((state) => state.selectedProducts),
  getProducts: () => set((state) => state.products),
  resetSession: () => {
    set({
      products: [],
      selectedProducts: [],
      chatResponses: [],
      userMessageCount: 0,
      hasInteractedWithThumbnail: false,
      sessionId: uuidv4(),
    });
  },
});

const useStore = create<State>()(
  devtools(
    persist(store, {
      name: "ShopAdvisor",
    })
  )
);

export default useStore;
