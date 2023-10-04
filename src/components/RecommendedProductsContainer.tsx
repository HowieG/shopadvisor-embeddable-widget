import RecommendedProduct from "./RecommendedProduct";

export default function RecommendedProductsContainer({
  recommendedProducts,
}: {
  recommendedProducts: RecommendedProduct[];
}) {
  return (
    <div className="flex flex-col gap-1 mr-5">
      {recommendedProducts.map((recommendedProduct, index) => (
        <div key={index}>
          <RecommendedProduct recommendedProduct={recommendedProduct} />
        </div>
      ))}
    </div>
  );
}
