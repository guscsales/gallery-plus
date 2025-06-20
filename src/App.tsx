import Button from "./components/button";
import ButtonIcon from "./components/button-icon";
import ChevronLeftIcon from "./assets/icons/chevron-left.svg?react";
import ChevronRightIcon from "./assets/icons/chevron-right.svg?react";
import Badge from "./components/badge";
import InputText from "./components/input-text";
import SearchIcon from "./assets/icons/search.svg?react";
import InputCheckbox from "./components/input-checkbox";
import Alert from "./components/alerts";
import InputSingleFile from "./components/input-single-file";
import {useForm} from "react-hook-form";
import Divider from "./components/divider";

interface UploadFileForm {
	file: FileList;
}

export default function App() {
	const uploadFileForm = useForm<UploadFileForm>();
	const file = uploadFileForm.watch("file");
	const filePreview = file?.[0] ? URL.createObjectURL(file[0]) : undefined;

	return (
		<div className="grid gap-7 p-6">
			<div className="flex gap-3">
				<Button>Button</Button>
				<Button variant="secondary">Button</Button>
				<Button disabled>Button</Button>
				<Button handling>Loading</Button>
				<Button icon={ChevronRightIcon}>Próxima Imagem</Button>
			</div>

			<div className="flex gap-3">
				<ButtonIcon icon={ChevronLeftIcon} />
				<ButtonIcon icon={ChevronRightIcon} variant="secondary" />
			</div>

			<div className="flex gap-3">
				<Badge>Todos</Badge>
				<Badge>Natureza</Badge>
				<Badge>Viagem</Badge>
				<Badge loading>Viagem</Badge>
				<Badge loading>Viagem</Badge>
				<Badge loading>Viagem</Badge>
			</div>

			<div className="flex flex-col gap-3">
				<InputText icon={SearchIcon} placeholder="Buscar fotos" />
				<InputText placeholder="Adicione um título" />
				<InputText value="Meu título" />
			</div>

			<div className="flex gap-3">
				<InputCheckbox />
				<InputCheckbox checked />
			</div>

			<div>
				<Alert>
					Tamanho máximo: 50MB
					<br />
					Você pode selecionar arquivos em PNG, JPG, JPEG ou WEBP
				</Alert>
			</div>

			<form
				onSubmit={uploadFileForm.handleSubmit((data) => {
					console.log(data);
				})}
			>
				<InputSingleFile
					className="mb-3"
					form={uploadFileForm}
					allowedExtensions={["png", "jpg", "jpeg", "webp"]}
					maxFileSizeInMB={50}
					replaceBy={
						<div className="flex flex-col items-center justify-center">
							<img src={filePreview} alt="File preview" />
						</div>
					}
					{...uploadFileForm.register("file")}
				/>
				<Button type="submit">Enviar Arquivo</Button>
			</form>

			<div>
				<Divider />
			</div>
		</div>
	);
}
