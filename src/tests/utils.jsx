import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import AppProviders from "../contexts/AppProviders.jsx";

export function renderWithProviders(
  ui,
  { route = "/", routerOptions = {} } = {}
) {
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={[route]} {...routerOptions}>
        {ui}
      </MemoryRouter>
    </AppProviders>
  );
}
