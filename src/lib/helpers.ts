import useStore from "@/store/store";

export const resetSession = () => {
  useStore.getState().resetSession();
  initChatHistory();
};

export const initChatHistory = async () => {
  const { chatResponses, addChatResponses } = useStore.getState();

  if (!chatResponses || chatResponses.length === 0) {
    const chatResponse: ChatMessageResponse = {
      type: "chat_message",
      data: {
        type: "response",
        text: "Hi, I'm ShopAdvisor! 😊 How can I help?",
      },
    };

    addChatResponses(chatResponse);

    const testResponse: ApiRecommendedProductsResponse = {
      type: "recommended_products",
      data: {
        text: "Here are some recommendations based on your requirements:",
        recommended_products: [
          {
            product_url:
              "https://hivebrands.com/collections/all/products/ancient-nutrition-multi-collagen-peptides-capsules",
            image_url:
              "https://hivebrands.com/cdn/shop/products/AncientNutrition_MultiCollagenProtein90ct_Front_475x594_crop_center.jpg?v=1641927270",
            price: "$45.99",
            rating: 0.0,
            num_reviews: 0,
            product_name: "Multi Collagen Peptides Capsules",
          },
          {
            product_url:
              "https://hivebrands.com/collections/all/products/ancient-nutrition-keto-fire-capsules",
            image_url:
              "https://hivebrands.com/cdn/shop/products/AncientNutrition_KetoFire180ct_Front_475x594_crop_center.jpg?v=1641925829",
            price: "$51.79",
            rating: null,
            num_reviews: 0,
            product_name: "Keto Fire Capsules",
          },
          {
            product_url:
              "https://hivebrands.com/collections/all/products/ancient-nutrition-joint-mobility-multi-collagen-peptides-capsules",
            image_url:
              "https://hivebrands.com/cdn/shop/products/AncientNutrition_MultiCollagenProteinJointMobility90ct_Front_475x594_crop_center.jpg?v=1641927728",
            price: "$45.99",
            rating: 3.0,
            num_reviews: 1,
            product_name: "Joint & Mobility Multi Collagen Peptides Capsules",
          },
        ],
      },
    };

    const a = mapApiResponseToTypes(testResponse);
    a.forEach(addChatResponses);
  }
};

export const getProductsFromStorage = async (): Promise<Product[]> => {
  const { products } = useStore.getState();
  return products || [];
};

export const getProductFromStorage = async (
  productUrl: ProductUrl
): Promise<Product> => {
  const { products } = useStore.getState();
  const matchingProduct = products.find((p) => p.product_url === productUrl);
  return matchingProduct;
};

export const getSelectedProductsFromStorage = async (): Promise<
  ProductUrl[]
> => {
  const { selectedProducts } = useStore.getState();
  return selectedProducts;
};

export const addSelectedProductToStorage = async (
  productUrl: ProductUrl
): Promise<void> => {
  const { addSelectedProduct } = useStore.getState();
  addSelectedProduct(productUrl);
};

export const removeSelectedProductFromStorage = async (
  productUrl: ProductUrl
): Promise<void> => {
  const { removeSelectedProduct } = useStore.getState();
  removeSelectedProduct(productUrl);
};

export const addProductToStorage = async (
  oProduct: Product,
  pending = false
): Promise<void> => {
  const { addProduct } = useStore.getState();
  addProduct(oProduct, pending);
};

export const removeProductFromStorage = async (
  productUrl: ProductUrl
): Promise<void> => {
  const { removeProduct } = useStore.getState();
  removeProduct(productUrl);
};

export const updateProductInStorage = async (
  oUpdatedProduct: Product
): Promise<void> => {
  const { updateProduct } = useStore.getState();
  updateProduct(oUpdatedProduct);
};

export const incrementUserMessageCount = async (): Promise<void> => {
  const { incrementUserMessageCount } = useStore.getState();
  incrementUserMessageCount();
};

export const sendChatRequest = async (chatRequest: string): Promise<void> => {
  const { setHasInteractedWithThumbnail, sessionId } = useStore.getState();
  setHasInteractedWithThumbnail(true);
  let body = {
    query: chatRequest,
    website_link: await getCurrentWindowUrl(),
    product_links: await getSelectedProductObjectsFromStorage(),
    session_id: sessionId,
  };

  const getChatEndpoint = `${
    import.meta.env.VITE_SHOPADVISOR_BACKEND_ENDPOINT
  }/chat`;

  try {
    const response = await fetch(getChatEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    let apiChatResponse: ApiChatResponse;

    if (response.ok) {
      apiChatResponse = await response.json();
    } else {
      const errorText = await response.text();
      const obj = JSON.parse(errorText);
      console.error(
        "fetchChatResponse: error. !response.ok. : ",
        errorText,
        " | ",
        obj.detail
      );

      apiChatResponse = {
        type: "chat_message",
        data: { text: obj.detail },
      };
    }

    const chatResponses: ChatResponse[] =
      mapApiResponseToTypes(apiChatResponse);
    await addChatResponsesToStorage(chatResponses);
  } catch (err) {
    console.error("fetchChatResponse err: ", err);
  }
};

export const getCurrentWindowUrl = (): Promise<string> => {
  return new Promise((resolve) => {
    resolve(window.location.href);
  });
};

export const getSelectedProductObjectsFromStorage = async (): Promise<
  Product[]
> => {
  const { getSelectedProductUrls, getProducts } = useStore.getState();
  const selectedProductUrls = getSelectedProductUrls();
  const products = getProducts();
  return products?.filter(
    (product) => selectedProductUrls?.includes(product?.product_url)
  );
};

export const addChatResponsesToStorage = async (
  chatResponse: ChatResponse | ChatResponse[]
): Promise<void> => {
  const { addChatResponses } = useStore.getState();
  addChatResponses(chatResponse);
};

export const getImageUrl = (anchor: Element): string => {
  let imageUrl: string | null = null;

  let imgElement: HTMLImageElement | null = null;

  if (anchor instanceof HTMLImageElement) {
    // Check if anchor itself is an img
    imgElement = anchor;
  } else {
    imgElement = anchor.querySelector("img");
  }

  if (!imgElement) {
    console.error("Image element is null or undefined");
    return null;
  }

  let src;

  // 1. Check 'src' attribute
  if (imgElement.src) {
    src = imgElement.src;
  }

  // 2. Check 'srcset' attribute
  else if (imgElement?.srcset) {
    src = imgElement.srcset.trim().split(",")[0].split(" ")[0];
  }

  // 3. Check 'data-src' attribute
  else if (imgElement?.getAttribute("data-src")) {
    src = imgElement.getAttribute("data-src").trim();
  }

  // 4. Check 'data-srcset' attribute
  // 4. Check 'data-srcset' attribute
  else if (imgElement?.getAttribute("data-srcset")) {
    src = imgElement
      .getAttribute("data-srcset")!
      .trim()
      .split(",")[0]
      .split(" ")[0];
  }

  // 5. Check CSS background-image
  else {
    const style = getComputedStyle(imgElement);
    if (style.backgroundImage !== "none") {
      src = style.backgroundImage.slice(5, -2).trim();
    }
  }

  console.log("src: ", src);

  // 7. Clean and format the src
  if (src) {
    console.log("src before cleaning: ", src);

    // src value is not necessarily clean, for instance it may look like this
    /*
		data-srcset="  //www.shortylove.com/cdn/shop/products/2048x2048Boxerkhaki_frontcopy_2048x.jpg?v=1685662530 2048w,
        //www.shortylove.com/cdn/shop/products/2048x2048Boxerkhaki_frontcopy_1600x.jpg?v=1685662530 1600w,
        //www.shortylove.com/cdn/shop/products/2048x2048Boxerkhaki_frontcopy_1200x.jpg?v=1685662530 1200w,
        //www.shortylove.com/cdn/shop/products/2048x2048Boxerkhaki_frontcopy_960x.jpg?v=1685662530 960w,
	*/
    // Keep trimming until the src starts with "www." or "http"
    while (!src.startsWith("www.") && !src.startsWith("http") && src.length) {
      //   console.log("src while trimming: ", src)
      src = src.slice(1);
    }

    console.log("src after cleaning: ", src);
    // If src never starts with "www." or "http", return null
    return src.startsWith("www.") || src.startsWith("http") ? src : null;
  }

  console.error("Could not find image URL for anchor element", anchor);
  return null;
};

export const getProductUrl = (anchor: Element): string | null => {
  let productUrl: string | null = null;

  // Step 1: Check if the anchor element itself is an 'a' tag with an href
  if (anchor.tagName.toLowerCase() === "a" && anchor.getAttribute("href")) {
    anchor = anchor as HTMLAnchorElement;
    productUrl = anchor.getAttribute("href");
  }

  // Step 2: If not, check its descendants for an 'a' tag with an href
  if (!productUrl) {
    const descendantAnchorTagElement = anchor.querySelector("a[href]");
    if (descendantAnchorTagElement) {
      productUrl = descendantAnchorTagElement.getAttribute("href");
    }
  }

  // Step 3: If still not found, check its ancestors for an 'a' tag with an href
  if (!productUrl) {
    let closestAnchorTagElement = anchor.parentElement;
    while (
      closestAnchorTagElement &&
      closestAnchorTagElement.tagName.toLowerCase() !== "a"
    ) {
      closestAnchorTagElement = closestAnchorTagElement.parentElement;
    }
    if (
      closestAnchorTagElement &&
      closestAnchorTagElement.getAttribute("href")
    ) {
      productUrl = closestAnchorTagElement.getAttribute("href");
    }
  }

  // Step 4: If the href is found and it is a relative URL, convert it to an absolute URL
  if (productUrl && productUrl.startsWith("/")) {
    productUrl = window.location.origin + productUrl;
  }

  return productUrl;
};

export function mapApiResponseToTypes(
  apiData: ApiChatResponse
): ChatResponse[] {
  if (apiData.type === "chat_message") {
    return [
      {
        type: "chat_message",
        data: { type: "response", text: apiData.data.text },
      },
    ];
  } else if (apiData.type === "recommended_products") {
    return [
      {
        type: "chat_message",
        data: { type: "response", text: apiData.data.text },
      },
      {
        type: "recommended_products",
        data: apiData.data.recommended_products.map((p) => ({
          product_url: p.product_url,
          image_url: p.image_url,
          price: p.price,
          product_name: p.product_name,
          rating: p.rating,
          num_reviews: p.num_reviews,
        })),
      },
    ];
  }
  throw new Error(`Unknown response type: ${apiData}`);
}
