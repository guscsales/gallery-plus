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
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import useAlbums from "../hooks/use-albums";

interface PhotoNewDialogProps {
	trigger: React.ReactNode;
}

const photoNewFormSchema = z.object({
	title: z.string().min(1, {message: "Campo obrigatório"}).max(255),
	file: z.instanceof(FileList),
	albumsIds: z.array(z.string().uuid()).optional(),
});

type PhotoNewForm = z.infer<typeof photoNewFormSchema>;

export default function PhotoNewDialog({trigger}: PhotoNewDialogProps) {
	const form = useForm<PhotoNewForm>({
		resolver: zodResolver(photoNewFormSchema),
	});
	const file = form.watch("file");
	const filePreview = file?.[0] ? URL.createObjectURL(file[0]) : undefined;

	const {albums, isLoadingAlbums} = useAlbums();

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>Adicionar foto</DialogHeader>
				<DialogBody>
					<form className="flex flex-col gap-5">
						<InputText
							placeholder="Adicione um título"
							maxLength={255}
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
								{isLoadingAlbums &&
									Array.from({length: 5}).map((_, index) => (
										<Button loading key={index} />
									))}
								{albums?.map((album) => (
									<Button variant="ghost" size="sm">
										{album.title}
									</Button>
								))}
							</div>
						</div>
					</form>
				</DialogBody>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary">Cancelar</Button>
					</DialogClose>
					<Button>Adicionar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
