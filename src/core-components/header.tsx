import Container from "../components/container";
import Logo from "../assets/images/galeria-plus-full-logo.svg?react";
import Button from "../components/button";
import cx from "classnames";
import {Link, useLocation} from "react-router";
import PhotoNewDialog from "./photo-new-dialog";
import AlbumNewDialog from "./album-new-dialog";
import PhotosSearch from "./photos-search";
import {AppRoutes} from "../App";

interface HeaderProps extends React.ComponentProps<"div"> {}

export default function Header({className, ...props}: HeaderProps) {
	const {pathname} = useLocation();

	return (
		<Container
			as="header"
			className={cx("flex justify-between items-center gap-10", className)}
			{...props}
		>
			<Link to="/">
				<Logo className="h-5" />
			</Link>
			{pathname === AppRoutes.HOME && <PhotosSearch />}
			<div className="flex items-center gap-3">
				<PhotoNewDialog trigger={<Button>Nova foto</Button>} />
				<AlbumNewDialog
					trigger={<Button variant="secondary">Criar álbum</Button>}
				/>
			</div>
		</Container>
	);
}
