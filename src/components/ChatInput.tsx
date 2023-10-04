import { useEffect, useState } from "preact/hooks";
import {
  addChatResponsesToStorage,
  incrementUserMessageCount,
  sendChatRequest,
} from "@/lib/helpers";
import { faPhoneVolume, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useStore from "@/store/store";

const handleKeyPress = async (e, text, setText) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      await addChatResponsesToStorage({
        type: "chat_message",
        data: {
          type: "user",
          text: trimmedText,
        },
      });
      await incrementUserMessageCount();
      await sendChatRequest(trimmedText);
    }
    setText("");
  }
};

const handleArrowKeyPress = (
  e,
  userMessageCount,
  scrollHistoryIndex,
  setScrollHistoryIndex,
  chatResponses,
  setText
) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();

    if (userMessageCount === 0) return;

    let newIndex = scrollHistoryIndex;

    if (e.key === "ArrowUp") {
      if (scrollHistoryIndex > 0) newIndex = scrollHistoryIndex - 1;
      else return;
    } else if (e.key === "ArrowDown") {
      if (scrollHistoryIndex < userMessageCount - 1)
        newIndex = scrollHistoryIndex + 1;
      else return;
    }

    const userMessages: ChatMessage[] = chatResponses
      .filter((msg) => msg.type === "chat_message" && msg.data.type === "user")
      .map((msg: ChatMessageResponse) => msg.data);

    setText(userMessages[newIndex]?.text || "");
    setScrollHistoryIndex(newIndex);
  }
};

export default function ChatInput() {
  const [text, setText] = useState("");
  const {
    chatResponses,
    userMessageCount,
    addChatResponses,
    incrementUserMessageCount,
  } = useStore((state) => ({
    chatResponses: state.chatResponses,
    userMessageCount: state.userMessageCount,
    addChatResponses: state.addChatResponses,
    incrementUserMessageCount: state.incrementUserMessageCount,
  }));
  const [scrollHistoryIndex, setScrollHistoryIndex] = useState(-1);

  useEffect(() => {
    setScrollHistoryIndex(userMessageCount);
  }, [userMessageCount]);

  return (
    <div className="flex flex-row gap-1 p-1 bg-white h-100 bg-opacity-60">
      <div className="flex flex-col w-10 h-full gap-1">
        <Button variant="outline" size="icon" disabled>
          <FontAwesomeIcon icon={faPhoneVolume} className="flex-1 p-2" />
        </Button>
        <Button variant="outline" size="icon" disabled>
          <FontAwesomeIcon icon={faVolumeUp} className="flex-1 p-2" />
        </Button>
      </div>
      <Textarea
        placeholder="Type here or click on the Call button to start a live audio call"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          handleKeyPress(e, text, setText);
          handleArrowKeyPress(
            e,
            userMessageCount,
            scrollHistoryIndex,
            setScrollHistoryIndex,
            chatResponses,
            setText
          );
        }}
      />
    </div>
  );
}
