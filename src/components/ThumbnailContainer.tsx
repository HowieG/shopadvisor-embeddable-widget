import { useEffect, useRef, useState } from "preact/hooks";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "@/components/ui/label";
import Thumbnail from "./Thumbnail";
import useStore from "@/store/store";

export default function ThumbnailContainer() {
  const { products, selectedProducts } = useStore((state) => ({
    products: state.products,
    selectedProducts: state.selectedProducts,
  }));

  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null); // logic for automatically scrolling to beg/end of thumbnails

  useEffect(() => {
    if (thumbnailContainerRef.current) {
      if (products?.[0]?.pending) {
        thumbnailContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        thumbnailContainerRef.current.scrollTo({
          left: thumbnailContainerRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }
  }, [products]);

  return (
    <div
      ref={thumbnailContainerRef}
      className="h-fit min-h-[144px] flex overflow-x-auto gap-2 px-2 p-3 mx-0 my-1 rounded-md bg-opacity-50 shadow-sm"
    >
      {products?.length ? (
        products.map((product: Product, index) => (
          <Thumbnail
            key={product.product_url}
            product={product}
            selected={selectedProducts?.includes(product.product_url)}
            index={index}
          />
        ))
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex flex-row gap-2 mb-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center justify-center w-24 h-24 p-1 bg-white rounded-md shadow-md">
                  <FontAwesomeIcon
                    icon={faImage}
                    className="h-16 text-gray-300"
                  />
                </div>
                <Label className="text-xs text-center text-gray-400">
                  Add item
                </Label>
              </div>
            ))}
          </div>
          <Label className="text-xs text-center">
            Hover over a product and click + to add it here
          </Label>
        </div>
      )}
    </div>
  );
}
