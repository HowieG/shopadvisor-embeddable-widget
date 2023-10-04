import { render } from "preact";
import "@/style.css";
import WidgetContainer from "./components/WidgetContainer";

export function App() {
  return <WidgetContainer />;
}

render(<App />, document.getElementById("app"));
