import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ChatInput from "./ChatInput";
import ContentContainer from "./ContentContainer";
import ThumbnailContainer from "./ThumbnailContainer";
import { resetSession } from "@/lib/helpers";

function IndexSidePanel() {
  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      <ThumbnailContainer />
      <Separator className="bg-slate-400" />
      <ContentContainer />
      <ChatInput />
      <Button
        className="bg-[#E6F0FC] text-slate-600 hover:text-slate-500 hover:bg-[#D0DCEC]"
        onClick={resetSession}
      >
        Click to start new session
      </Button>
    </div>
  );
}

export default IndexSidePanel;

//   storage.watch({
//     selectedProducts: (c) => {
//       console.log("selectedProducts: ", c)
//     }
//   })

//   useEffect(() => {
//     if (selectedProducts) {
//       selectedProducts.map((p, index) => {
//         console.log(
//           `IndexSidePanel selectedProduct ${index}: `,
//           JSON.stringify(p, null, 2)
//         )
//       })
//     }
//   }, [products])
