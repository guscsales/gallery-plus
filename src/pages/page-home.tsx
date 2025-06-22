import Container from "../components/container";
import PhotosList from "../core-components/photos-list";
import Text from "../components/text";
import Button from "../components/button";

export default function PageHome() {
	return (
		<Container>
			<div className="flex items-center gap-3.5 mb-9">
				<Text variant="heading-small">Álbuns</Text>
				<div className="flex gap-3">
					<Button variant="primary" size="sm" className="cursor-pointer">
						Todos
					</Button>
					<Button variant="ghost" size="sm" className="cursor-pointer">
						Natureza
					</Button>
					<Button variant="ghost" size="sm" className="cursor-pointer">
						Viagem
					</Button>
					<Button variant="ghost" size="sm" className="cursor-pointer">
						Gastronomia
					</Button>
					<Button variant="ghost" size="sm" className="cursor-pointer">
						Fotografia
					</Button>
					<Button variant="ghost" size="sm" className="cursor-pointer">
						Pets
					</Button>
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
