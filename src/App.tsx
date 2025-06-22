import {BrowserRouter, Routes, Route} from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import PageComponents from "./pages/page-components";
import LayoutMain from "./pages/layout-main";
import PageHome from "./pages/page-home";
import PagePhotoDetails from "./pages/page-photo-details";

const queryClient = new QueryClient();

export enum AppRoutes {
	HOME = "/",
	COMPONENTS = "/componentes",
	PHOTO_DETAILS = "/fotos/:id",
}

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route element={<LayoutMain />}>
						<Route index element={<PageHome />} />
						<Route path={AppRoutes.COMPONENTS} element={<PageComponents />} />
						<Route
							path={AppRoutes.PHOTO_DETAILS}
							element={<PagePhotoDetails />}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}
