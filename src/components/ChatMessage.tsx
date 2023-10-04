export default function ChatMessage({
  chatMessage,
  fetchingResponseAnimation = false,
}: {
  chatMessage: ChatMessage;
  fetchingResponseAnimation?: boolean;
}) {
  return (
    <div
      className={`flex ${
        chatMessage.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-4 py-2 rounded-lg border border-gray-300 whitespace-pre-wrap ${
          chatMessage.type === "user"
            ? "bg-[rgb(237,231,236)] text-black ml-5"
            : "bg-[#E6F0FC] text-black mr-5"
        } ${fetchingResponseAnimation ? "animate-ellipsis w-12 font-lg" : ""}`}
      >
        {chatMessage.text}
      </div>
    </div>
  );
}
