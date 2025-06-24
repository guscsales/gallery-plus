import {useForm} from "react-hook-form";
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
import InputText from "../../../components/input-text";
import Text from "../../../components/text";
import PhotoImage from "../../photos/components/photo-image";
import SelectCheckboxIllustration from "../../../assets/images/select-checkbox.svg?react";
import {albumNewFormSchema, type AlbumNewForm} from "../schemas";
import usePhotos from "../../photos/hooks/use-photos";
import Skeleton from "../../../components/skeleton";
import {zodResolver} from "@hookform/resolvers/zod";
import React from "react";
import useAlbum from "../hooks/use-album";

interface PhotoNewDialogProps {
	trigger: React.ReactNode;
}

export default function PhotoNewDialog({trigger}: PhotoNewDialogProps) {
	const [modalOpen, setModalOpen] = React.useState(false);
	const form = useForm<AlbumNewForm>({
		resolver: zodResolver(albumNewFormSchema),
	});
	const {photos, isLoadingPhotos} = usePhotos();
	const {createAlbum} = useAlbum();

	const [isCreating, startCreateTransition] = React.useTransition();

	React.useEffect(() => {
		if (!modalOpen) {
			form.reset();
		}
	}, [modalOpen, form]);

	function handleTogglePhoto(selected: boolean, photoId: string) {
		const photosIds = form.getValues("photosIds");
		if (selected) {
			form.setValue("photosIds", [...(photosIds || []), photoId]);
		} else {
			form.setValue(
				"photosIds",
				photosIds?.filter((id) => id !== photoId)
			);
		}
	}

	async function handleSubmit(payload: AlbumNewForm) {
		startCreateTransition(async () => {
			await createAlbum(payload);
			setModalOpen(false);
		});
	}

	return (
		<Dialog open={modalOpen} onOpenChange={setModalOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<DialogHeader>Criar álbum</DialogHeader>
					<DialogBody>
						<div className="flex flex-col gap-5">
							<InputText
								placeholder="Adicione um título"
								error={form.formState.errors.title?.message}
								{...form.register("title")}
							/>

							<div className="flex flex-col gap-3">
								<Text variant="label-small">Fotos cadastradas</Text>
								<div className="flex flex-wrap gap-2">
									{isLoadingPhotos &&
										Array.from({length: 5}).map((_, index) => (
											<Skeleton key={index} className="w-20 h-20 rounded" />
										))}
									{photos?.map((photo) => (
										<PhotoImage
											key={photo.id}
											imageId={`${import.meta.env.VITE_IMAGES_URL}/${
												photo.imageId
											}`}
											title={photo.title}
											className="w-[5.25rem] rounded"
											imageClassName="h-[5.25rem]"
											selectable
											selected={false}
											onSelect={(selected) => {
												handleTogglePhoto(selected, photo.id);
											}}
										/>
									))}
									{!isLoadingPhotos && photos?.length === 0 && (
										<div className="w-full flex flex-col justify-center items-center gap-3">
											<SelectCheckboxIllustration />
											<Text variant="paragraph-medium" className="text-center">
												Nenhuma foto disponível para seleção
											</Text>
										</div>
									)}
								</div>
							</div>
						</div>
					</DialogBody>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="secondary">Cancelar</Button>
						</DialogClose>
						<Button type="submit" disabled={isCreating} handling={isCreating}>
							{isCreating ? "Criando..." : "Criar"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
