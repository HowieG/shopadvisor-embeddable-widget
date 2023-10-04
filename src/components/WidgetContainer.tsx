import { useState } from "preact/hooks";
import Sidepanel from "./Sidepanel";

const WidgetContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className={`fixed bottom-0 right-0 p-3 bg-blue-500 text-white rounded-lg shadow-md transition-all ease-in-out duration-300 ${
          isOpen
            ? "w-[400px] max-h-[800px] visible opacity-100"
            : "w-[400px] max-h-0 invisible opacity-0"
        }`}
      >
        {isOpen && <Sidepanel />}
      </div>
      <div
        className="fixed flex items-center justify-center w-12 h-12 text-2xl text-white bg-red-500 rounded-full cursor-pointer bottom-5 right-5"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "-" : "+"}
      </div>
    </div>
  );
};

export default WidgetContainer;
