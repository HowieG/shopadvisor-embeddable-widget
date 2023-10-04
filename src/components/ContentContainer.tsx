import { useEffect, useRef, useState } from "preact/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import RecommendedProductsContainer from "./RecommendedProductsContainer";
import useStore from "@/store/store";

export default function ContentContainer() {
  const { chatResponses } = useStore((state) => ({
    chatResponses: state.chatResponses,
  }));

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null); // logic for automatically scrolling to bottom

  // TODO: Investigate why scrollTo: top: scrollHeight doesn't work

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatResponses]);

  return (
    <ScrollArea className="flex-grow p-2 text-xs bg-gradient-to-b from-rose-100 to-teal-100">
      <div className="flex flex-col">
        {chatResponses?.map((chatResponse, index) => (
          <div key={index} className="my-1">
            {chatResponse.type === "chat_message" ? (
              <ChatMessage chatMessage={chatResponse.data as ChatMessage} />
            ) : chatResponse.type === "recommended_products" ? (
              <RecommendedProductsContainer
                recommendedProducts={chatResponse.data as RecommendedProduct[]}
              />
            ) : null}
          </div>
        ))}
      </div>
      {chatResponses?.length > 0 &&
      chatResponses[chatResponses.length - 1].type === "chat_message" &&
      (chatResponses[chatResponses.length - 1].data as ChatMessage).type ===
        "user" ? (
        <ChatMessage
          chatMessage={{ type: "response", text: "" }}
          fetchingResponseAnimation={true}
        ></ChatMessage>
      ) : null}
      <div ref={endOfMessagesRef}></div>
    </ScrollArea>
  );
}
