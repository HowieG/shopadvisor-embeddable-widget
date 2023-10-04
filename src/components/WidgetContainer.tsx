import { h } from "preact";
import { useState } from "preact/hooks";

const WidgetContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`flex transition-all ease-in-out duration-300 ${
        isOpen ? "mr-48" : ""
      }`}
    >
      <div className="relative flex-grow">{/* Main content */}</div>
      <div
        className={`fixed top-0 bottom-0 right-0 bg-blue-500 transition-all ease-in-out duration-300 ${
          isOpen ? "w-80 visible opacity-100" : "w-0 invisible opacity-0"
        }`}
      >
        <p className="p-5 text-white">This is a fixed container</p>
      </div>
      <div
        className="absolute flex items-center justify-center w-12 h-12 text-2xl text-white bg-red-500 rounded-full cursor-pointer bottom-3 right-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "-" : "+"}
      </div>
    </div>
  );
};

export default WidgetContainer;
