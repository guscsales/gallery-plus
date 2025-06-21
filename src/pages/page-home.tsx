import Container from "../components/container";
import PhotosList from "../core-components/photos-list";

export default function PageHome() {
	return (
		<Container>
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
