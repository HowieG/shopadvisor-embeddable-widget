import { v4 as uuidv4 } from "uuid";

type StorageValue = string | number | boolean | object | null;

const NAMESPACE = "ShopAdvisor";

const localStorageInstance = {
  set: function (key: string, value: StorageValue) {
    const namespacedKey = `${NAMESPACE}.${key}`;
    localStorage.setItem(namespacedKey, JSON.stringify(value));
  },
  get: async function <T extends StorageValue>(key: string): Promise<T | null> {
    const namespacedKey = `${NAMESPACE}.${key}`;
    const item = localStorage.getItem(namespacedKey);
    return item ? (JSON.parse(item) as T) : null;
  },
  log: function (key: string) {
    const namespacedKey = `${NAMESPACE}.${key}`;
    const value = localStorage.getItem(namespacedKey);
    console.log(`Value for ${namespacedKey}:`, value);
  },
};

export async function resetSession() {
  localStorageInstance.set("products", []);
  localStorageInstance.set("selected_products", []);
  localStorageInstance.set("chat_history", []);
  localStorageInstance.set("user_message_count", 0);
  localStorageInstance.set("has_interacted_with_thumbnail", false);
  localStorageInstance.set("session_id", uuidv4());
  initChatHistory();
}

export async function initChatHistory() {
  let chatResponses: ChatResponse[] | null =
    await localStorageInstance.get("chat_history");
  if (!chatResponses || chatResponses.length === 0) {
    let chatMessage: ChatMessage = {
      type: "response",
      text: "Hi, I'm ShopAdvisor! 😊 How can I help?",
    };

    let chatResponse: ChatMessageResponse = {
      type: "chat_message",
      data: chatMessage,
    };

    await addChatResponsesToStorage(chatResponse);

    let testResponse: ApiRecommendedProductsResponse = {
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

    let a = mapApiResponseToTypes(testResponse);
    a.map(async (a) => {
      await addChatResponsesToStorage(a);
    });
  }
}

export async function getProductsFromStorage(): Promise<Product[]> {
  const aProduct: Product[] | null = await localStorageInstance.get("products");
  return aProduct || [];
}

export async function getProductFromStorage(
  productUrl: ProductUrl
): Promise<Product> {
  const aoProduct: Product[] | null =
    await localStorageInstance.get("products");
  const matchingProduct = aoProduct.find((p) => p.product_url === productUrl);
  return matchingProduct;
}

export async function getSelectedProductsFromStorage(): Promise<ProductUrl[]> {
  const aSelectedProduct: ProductUrl[] =
    (await localStorageInstance.get("selected_products")) || [];
  return aSelectedProduct;
}

export async function addSelectedProductToStorage(
  productUrl: ProductUrl
): Promise<void> {
  let aSelectedProduct: ProductUrl[] = await getSelectedProductsFromStorage();
  aSelectedProduct.push(productUrl);

  await localStorageInstance.set("selected_products", aSelectedProduct);
  localStorageInstance.set("has_interacted_with_thumbnail", false);
  //   console.log(
  //     "Added selected product ",
  //     productUrl,
  //     "to storage. New selected_products: ",
  //     aSelectedProduct
  //   )
}

export async function removeSelectedProductFromStorage(
  productUrl: ProductUrl
): Promise<void> {
  let aSelectedProduct: ProductUrl[] = await getSelectedProductsFromStorage();

  const index = aSelectedProduct.indexOf(productUrl);
  if (index > -1) {
    aSelectedProduct.splice(index, 1);
  }

  await localStorageInstance.set("selected_products", aSelectedProduct);
  //   console.log(
  //     "Removed selected product ",
  //     productUrl,
  //     "from storage. New selected_products: ",
  //     aSelectedProduct
  //   )
}

export async function addProductToStorage(oProduct: Product, pending = false) {
  let aoProduct: Product[] = (await getProductsFromStorage()) || [];

  if (!aoProduct.some((p) => p.product_url === oProduct.product_url)) {
    if (pending) {
      // Add to beginning of products array so that it appears as first thumbnail
      aoProduct.unshift(oProduct);
    } else {
      aoProduct.push(oProduct);
      const hasInteractedWithThumbnail =
        await localStorageInstance.get<boolean>(
          "has_interacted_with_thumbnail"
        );
      if (hasInteractedWithThumbnail === true) {
        // If the user has interacted (e.g. chatted) about the thumbnail and they add another thumbnail,
        // we can assume they're moving on and only want to focus on the new thumbnail so leave only this product in the array
        await localStorageInstance.set("selected_products", [
          oProduct.product_url,
        ]);
      } else {
        // If the user has not yet had any interaction with the thumbnail, we can assume they want to take an action that involves
        // a string of thumbnails (e.g. a comparison), so append this product to the array
        await addSelectedProductToStorage(oProduct.product_url);
      }
    }
    await localStorageInstance.set("products", aoProduct);
    // console.log(
    //   "Added product ",
    //   oProduct,
    //   "to storage. New products: ",
    //   aoProduct
    // )
  }
}

export async function removeProductFromStorage(productUrl: ProductUrl) {
  let aoProduct: Product[] = (await getProductsFromStorage()) || [];
  aoProduct = aoProduct.filter((p) => p.product_url !== productUrl);
  await localStorageInstance.set("products", aoProduct);
  //   console.log(
  //     "Removed product ",
  //     productUrl,
  //     "from storage. New products: ",
  //     aoProduct
  //   )

  // Also remove from selected products
  removeSelectedProductFromStorage(productUrl);
}

export async function updateProductInStorage(oUpdatedProduct) {
  let aoProduct: Product[] = (await getProductsFromStorage()) || [];

  let productIndex = aoProduct.findIndex(
    (p) => p.product_url === oUpdatedProduct.product_url
  );
  if (productIndex === -1) {
    console.error(
      `Product with product_url ${oUpdatedProduct.product_url} not found in storage.`
    );
    return;
  }

  // Replace the old product with the updated one
  aoProduct[productIndex] = oUpdatedProduct;

  // Save the updated products array back to Chrome storage
  await localStorageInstance.set("products", aoProduct);
}

export async function incrementUserMessageCount() {
  const userMessageCount: number =
    (await localStorageInstance.get("user_message_count")) ?? 0;
  await localStorageInstance.set("user_message_count", userMessageCount + 1);
}

export async function sendChatRequest(chatRequest: string) {
  await localStorageInstance.set("has_interacted_with_thumbnail", true);
  //   sendToBackground({
  //     name: "fetch-chat-response",
  //     body: {
  //       query: chatRequest,
  //       website_link: await getCurrentWindowUrl(),
  //       product_links: await getSelectedProductObjectsFromStorage(),
  //       session_id: await localStorageInstance.get("session_id"),
  //     },
  //   });
}

export function getCurrentWindowUrl(): Promise<string> {
  return new Promise((resolve) => {
    resolve(window.location.href);
  });
}

// TODO: edge cases
export async function getSelectedProductObjectsFromStorage(): Promise<
  ProductUrl[]
> {
  const aSelectedProducts = await getSelectedProductsFromStorage();
  const aoProducts = await getProductsFromStorage();
  const filteredProducts = aoProducts?.filter(
    (product) => aSelectedProducts?.includes(product.product_url)
  );
  const productUrls: ProductUrl[] = filteredProducts?.map(
    (product) => product.product_url
  );
  return productUrls;
}

export async function addChatResponsesToStorage(
  chatResponse: ChatResponse | ChatResponse[]
) {
  const chatResponses: ChatResponse[] =
    (await localStorageInstance.get("chat_history")) ?? [];
  const newChatResponses = Array.isArray(chatResponse)
    ? chatResponse
    : [chatResponse];
  const updatedChatResponses = [...chatResponses, ...newChatResponses];
  await localStorageInstance.set("chat_history", updatedChatResponses);
}

export const getImageUrl = (anchor: Element): string => {
  let imageUrl: string | null = null;

  let imgElement: HTMLImageElement | null = null;

  if (anchor instanceof HTMLImageElement) {
    // Check if anchor itself is an img
    imgElement = anchor;
  } else {
    imgElement = anchor.querySelector("img");
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
