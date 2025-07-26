import {BrowserRouter, Route, Routes} from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import PageComponents from "./pages/page-components";
import LayoutMain from "./pages/layout-main";
import PageHome from "./pages/page-home";
import PagePhotoDetails from "./pages/page-photo-details";
import {NuqsAdapter} from "nuqs/adapters/react-router/v7";
import {Toaster} from "sonner";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <Toaster position="bottom-center" />
        <BrowserRouter>
          <Routes>
            <Route element={<LayoutMain />}>
              <Route index element={<PageHome />} />
              <Route path="/fotos/:id" element={<PagePhotoDetails />} />
              <Route path="/componentes" element={<PageComponents />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
