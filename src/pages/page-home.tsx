import Container from "../components/container";
import PhotosList from "../core-components/photos-list";
import Text from "../components/text";
import Badge from "../components/badge";

export default function PageHome() {
	return (
		<Container>
			<div className="flex items-center gap-3.5 mb-9">
				<Text variant="heading-small">Álbuns</Text>
				<div className="flex gap-3">
					<Badge className="cursor-pointer">Todos</Badge>
					<Badge className="cursor-pointer">Natureza</Badge>
					<Badge className="cursor-pointer">Viagem</Badge>
					<Badge className="cursor-pointer">Gastronomia</Badge>
					<Badge className="cursor-pointer">Fotografia</Badge>
					<Badge className="cursor-pointer">Pets</Badge>
				</div>
			</div>

			<PhotosList
				photos={[
					{
						id: "1",
						title: "Photo 1",
						imageId: "/images/portrait-shadow.png",
						albums: [
							{
								id: "1",
								title: "Album 1",
							},
							{
								id: "2",
								title: "Album 2",
							},
							{
								id: "3",
								title: "Album 3",
							},
						],
					},
					{
						id: "2",
						title: "Photo 2",
						imageId: "/images/square-breakfast.png",
						albums: [
							{
								id: "1",
								title: "Album 1",
							},
						],
					},
					{
						id: "3",
						title: "Photo 3",
						imageId: "/images/wide-car.png",
						albums: [],
					},
				]}
			/>
		</Container>
	);
}
