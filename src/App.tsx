import { ThemeProvider } from "@context";
import Navigation from "@navigation";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={Navigation} />
    </ThemeProvider>
  );
}

export default App;
