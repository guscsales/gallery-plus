import Container from "../components/container";
import Logo from "../assets/images/galeria-plus-full-logo.svg?react";
import InputText from "../components/input-text";
import SearchIcon from "../assets/icons/search.svg?react";
import Divider from "../components/divider";
import Button from "../components/button";
import cx from "classnames";
import {Link} from "react-router";
import PhotoNewDialog from "./photo-new-dialog";
import AlbumNewDialog from "./album-new-dialog";

interface HeaderProps extends React.ComponentProps<"div"> {}

export default function Header({className, ...props}: HeaderProps) {
	return (
		<Container
			as="header"
			className={cx("flex justify-between items-center gap-10", className)}
			{...props}
		>
			<Link to="/">
				<Logo className="h-5" />
			</Link>
			<InputText
				icon={SearchIcon}
				placeholder="Buscar fotos"
				className="flex-1"
			/>
			<Divider orientation="vertical" className="h-10" />
			<div className="flex items-center gap-3">
				<PhotoNewDialog trigger={<Button>Nova foto</Button>} />
				<AlbumNewDialog
					trigger={<Button variant="secondary">Criar álbum</Button>}
				/>
			</div>
		</Container>
	);
}
