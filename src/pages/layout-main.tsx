import {Outlet} from "react-router";
import Header from "../core-components/header";
import MainContent from "../core-components/main-content";
import {Toaster} from "sonner";

export default function LayoutMain() {
	return (
		<>
			<Toaster position="bottom-center" />
			<Header className="mt-9" />
			<MainContent>
				<Outlet />
			</MainContent>
		</>
	);
}
