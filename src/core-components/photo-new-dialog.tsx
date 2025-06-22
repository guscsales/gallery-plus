import {useForm} from "react-hook-form";
import Alert from "../components/alert";
import Button from "../components/button";
import {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "../components/dialog";
import InputSingleFile from "../components/input-single-file";
import InputText from "../components/input-text";
import Text from "../components/text";

interface PhotoNewDialogProps {
	trigger: React.ReactNode;
}

export default function PhotoNewDialog({trigger}: PhotoNewDialogProps) {
	const form = useForm();
	const file = form.watch("file");
	const filePreview = file?.[0] ? URL.createObjectURL(file[0]) : undefined;

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>Adicionar foto</DialogHeader>
				<DialogBody>
					<form className="flex flex-col gap-5">
						<InputText
							placeholder="Adicione um título"
							{...form.register("title")}
						/>

						<Alert>
							Tamanho máximo: 50MB
							<br />
							Você pode selecionar arquivos em PNG, JPG, JPEG ou WEBP
						</Alert>

						<InputSingleFile
							form={form}
							allowedExtensions={["png", "jpg", "jpeg", "webp"]}
							maxFileSizeInMB={50}
							replaceBy={
								<div className="flex flex-col items-center justify-center">
									<img src={filePreview} alt="File preview" />
								</div>
							}
							{...form.register("file")}
						/>

						<div className="flex flex-col gap-3">
							<Text variant="label-small">Selecionar álbuns</Text>
							<div className="flex flex-wrap gap-3">
								<Button variant="primary" size="sm">
									Viagem
								</Button>
								<Button variant="ghost" size="sm">
									Natureza
								</Button>
								<Button variant="ghost" size="sm">
									Gastronomia
								</Button>
								<Button variant="ghost" size="sm">
									Fotografia
								</Button>
								<Button variant="ghost" size="sm">
									Pets
								</Button>
							</div>
						</div>
					</form>
				</DialogBody>
				<DialogFooter>
					<DialogClose>
						<Button variant="secondary">Cancelar</Button>
					</DialogClose>
					<Button>Adicionar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
