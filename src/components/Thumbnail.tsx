import { Label } from "@/components/ui/label";
import {
  addSelectedProductToStorage,
  removeProductFromStorage,
  removeSelectedProductFromStorage,
  updateProductInStorage,
} from "@/lib/helpers";

function Thumbnail({
  product,
  selected,
  index,
}: {
  product: Product;
  selected: boolean;
  index: number;
}) {
  const toggleSelected = () => {
    if (selected) {
      removeSelectedProductFromStorage(product.product_url);
    } else {
      if (product.pending) {
        product.pending = false;
        updateProductInStorage(product);
      }
      addSelectedProductToStorage(product.product_url);
    }
  };

  return (
    <div className="relative flex flex-col gap-1">
      <div
        className={`w-24 h-24 p-1 bg-white flex items-center justify-center cursor-pointer rounded-md shadow-md ${
          selected ? "border-2 border-teal-500" : "border-transparent"
        } ${product.pending ? "opacity-50" : ""}`}
        data-product-url={product.product_url}
        onClick={() => toggleSelected()}
      >
        <img
          src={product.image_url}
          alt="Product Image" // TODO
          className="inline-block object-contain w-full max-h-full"
        />
      </div>
      {/* TODO: update to text-balance once its in tailwind */}
      {/* TODO: need a backend call in order to get productName */}
      <Label className="text-center text-md [text-wrap:balance]">
        {product.productName}
      </Label>
      <Label className="text-xs text-center">
        {product.pending ? "Click to add" : "Item " + (index + 1)}
      </Label>
      <button
        className="absolute top-[-4px] right-[-4px] bg-[#EDE7EC] rounded-full w-5 h-5 flex items-center justify-center z-100 border border-gray-300"
        onClick={(e) => {
          removeProductFromStorage(product.product_url);
          e.stopPropagation();
        }}
      >
        <span className="text-xs font-semibold text-slate-500">X</span>
      </button>
    </div>
  );
}

export default Thumbnail;
