import { render } from "preact";
import "@/style.css";
import WidgetContainer from "./components/WidgetContainer";

const root = document.createElement("div");
document.body.appendChild(root);
render(<WidgetContainer />, root);
