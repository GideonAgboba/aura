import { createMemoryRouter } from "react-router-dom";

export const mockNavigation = createMemoryRouter(
  [{
    path: '/',
    element: <div>Mock Route</div>,
  }],
  {
    initialEntries: ["/"],
  }
);
