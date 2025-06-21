import {useParams} from "react-router";
import Container from "../components/container";
import Text from "../components/text";

export default function PagePhotoDetails() {
	const {id} = useParams();

	return (
		<Container>
			<Text>Photo Details: {id}</Text>
		</Container>
	);
}
