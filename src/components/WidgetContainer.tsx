import { useState } from "preact/hooks";
import Sidepanel from "./Sidepanel";
import { initChatHistory } from "@/lib/helpers";

initChatHistory();

const WidgetContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className={`fixed top-0 bottom-0 right-0 transition-all ease-in-out duration-300 shadow-lg ${
          isOpen ? "w-80 visible opacity-100" : "w-0 invisible opacity-0"
        }`}
      >
        {isOpen && <Sidepanel />}
      </div>
      <div
        className="absolute flex items-center justify-center w-12 h-12 rounded-full cursor-pointer bg-gradient-to-b from-rose-100 to-teal-100 bottom-3 right-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "-" : "+"}
      </div>
    </div>
  );
};

export default WidgetContainer;
