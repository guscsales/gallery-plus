import {useForm} from "react-hook-form";
import Alert from "../../../components/alert";
import Button from "../../../components/button";
import {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "../../../components/dialog";
import InputSingleFile from "../../../components/input-single-file";
import InputText from "../../../components/input-text";
import Text from "../../../components/text";
import {zodResolver} from "@hookform/resolvers/zod";
import useAlbums from "../../albums/hooks/use-albums";
import {photoNewFormSchema, type PhotoNewForm} from "../schemas";
import usePhoto from "../hooks/use-photo";
import React from "react";
import PhotoImage from "./photo-image";

interface PhotoNewDialogProps {
	trigger: React.ReactNode;
}

export default function PhotoNewDialog({trigger}: PhotoNewDialogProps) {
	const [modalOpen, setModalOpen] = React.useState(false);
	const form = useForm<PhotoNewForm>({
		resolver: zodResolver(photoNewFormSchema),
	});
	const {albums, isLoadingAlbums} = useAlbums();
	const {createPhoto} = usePhoto();
	const [isCreating, startCreateTransition] = React.useTransition();

	const file = form.watch("file");
	const filePreview = file?.[0] ? URL.createObjectURL(file[0]) : undefined;

	const albumsIds = form.watch("albumsIds");

	React.useEffect(() => {
		if (!modalOpen) {
			form.reset();
		}
	}, [modalOpen, form]);

	function handleToggleAlbum(albumId: string) {
		const albumsIds = form.getValues("albumsIds");
		const albumsSet = new Set(albumsIds || []);

		if (albumsSet.has(albumId)) {
			albumsSet.delete(albumId);
		} else {
			albumsSet.add(albumId);
		}

		form.setValue("albumsIds", Array.from(albumsSet));
	}

	async function handleSubmit(payload: PhotoNewForm) {
		startCreateTransition(async () => {
			await createPhoto(payload);
			setModalOpen(false);
		});
	}

	return (
		<Dialog open={modalOpen} onOpenChange={setModalOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<DialogHeader>Adicionar foto</DialogHeader>
					<DialogBody>
						<div className="flex flex-col gap-5">
							<InputText
								placeholder="Adicione um título"
								maxLength={255}
								error={form.formState.errors.title?.message}
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
									<PhotoImage
										imageId={filePreview || ""}
										className="w-full h-56"
									/>
								}
								error={form.formState.errors.file?.message}
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
										<Button
											key={album.id}
											variant={
												albumsIds?.includes(album.id) ? "primary" : "ghost"
											}
											size="sm"
											className="truncate"
											onClick={() => handleToggleAlbum(album.id)}
										>
											{album.title}
										</Button>
									))}
								</div>
							</div>
						</div>
					</DialogBody>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="secondary">Cancelar</Button>
						</DialogClose>
						<Button type="submit" disabled={isCreating} handling={isCreating}>
							{isCreating ? "Adicionando..." : "Adicionar"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
