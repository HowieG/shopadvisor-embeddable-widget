import StarRatings from "react-star-ratings";
import { addProductToStorage } from "@/lib/helpers";

export default function RecommendedProduct({
  recommendedProduct,
}: {
  recommendedProduct: RecommendedProduct;
}) {
  return (
    <div className="relative">
      <a href={recommendedProduct.product_url} target="_blank">
        <div className="flex flex-row gap-3 p-1 bg-white border border-gray-300 rounded-lg hover:opacity-70">
          <img
            src={recommendedProduct.image_url}
            alt={recommendedProduct.product_name}
            className="w-16 h-auto"
          />
          <div className="flex flex-col py-2">
            <div className="font-bold">{recommendedProduct.product_name}</div>
            <div className="text-gray-400">{recommendedProduct.price}</div>
            <div className="flex flex-row gap-1">
              <StarRatings
                rating={recommendedProduct.rating ?? 0}
                starRatedColor="goldenRod"
                numberOfStars={5}
                name="rating"
                starDimension="12px"
                starSpacing="0px"
              />
              <div className="text-gray-400">
                ({recommendedProduct.num_reviews})
              </div>
            </div>
          </div>
        </div>
      </a>
      <div
        className="absolute flex items-center justify-center w-6 h-6 bg-[#E6F0FC] cursor-pointer hover:bg-[#D0DCEC] text-slate-600 hover:text-slate-500 text-lg rounded-full top-[-4] right-[-6] border border-gray-300"
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
          addProductToStorage({
            product_url: recommendedProduct.product_url,
            image_url: recommendedProduct.image_url,
          });
        }}
      >
        +
      </div>
    </div>
  );
}
