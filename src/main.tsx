import { render } from "preact";
import App from "./App";

// Mount the Preact app
const appElement = document.getElementById("app");
if (!appElement) {
  throw new Error(
    "App element not found. Make sure there is an element with id 'app' in your HTML."
  );
}
render(<App />, appElement);

// Fix viewport height on iOS
function setAppHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Update on resize and orientation change
window.addEventListener("resize", setAppHeight);
window.addEventListener("orientationchange", () => {
  setTimeout(setAppHeight, 100);
});

// Initial setup
setAppHeight();

// Hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept();
}
