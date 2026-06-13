import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import "./styles/global.scss";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
