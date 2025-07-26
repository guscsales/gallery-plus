import type {Album} from "../models/album";
import Text from "../../../components/text";
import Button from "../../../components/button";
import cx from "classnames";
import Skeleton from "../../../components/skeleton";
import usePhotos from "../../photos/hooks/use-photos";

interface AlbumsFilterProps extends React.ComponentProps<"div"> {
  albums: Album[];
  loading?: boolean;
}

export default function AlbumsFilter({
  albums,
  loading,
  className,
  ...props
}: AlbumsFilterProps) {
  const {filters} = usePhotos();

  return (
    <div
      className={cx("flex items-center gap-3.5 overflow-x-auto", className)}
      {...props}
    >
      <Text variant="heading-small">Álbuns</Text>
      <div className="flex gap-3">
        {!loading ? (
          <>
            <Button
              variant={filters.albumId === null ? "primary" : "ghost"}
              size="sm"
              className="cursor-pointer"
              onClick={() => filters.setAlbumId(null)}
            >
              Todos
            </Button>
            {albums.map((album) => (
              <Button
                key={album.id}
                variant={filters.albumId === album.id ? "primary" : "ghost"}
                size="sm"
                className="cursor-pointer"
                onClick={() => filters.setAlbumId(album.id)}
              >
                {album.title}
              </Button>
            ))}
          </>
        ) : (
          Array.from({length: 5}).map((_, index) => (
            <Skeleton
              className="w-28 h-7"
              key={`album-button-loading-${index}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
