import { useAppState } from "@/lib/providers/state-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { Document, StarWithDocument } from "@/lib/supabase/supabase.types";
import { cn } from "@/lib/utils";
import { StarIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "../ui/use-toast";
import { deleteFavorite } from "@/lib/supabase/queries";
import { Button } from "../ui/button";

type Props = {
  favorite: StarWithDocument;
};

const FavoriteItem: React.FC<Props> = ({ favorite }) => {
  const { workspaceId, dispatch } = useAppState();
  if (!workspaceId) return null;

  const handleDeleteFavorite = async () => {
    dispatch({
      type: "DELETE_FAVORITE",
      payload: {
        favoriteId: favorite.id,
        workspaceId: workspaceId,
      },
    });
    const { error } = await deleteFavorite(favorite.id);
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not delete favorite",
      });
    } else {
      toast({
        title: "Success",
        description: "Deleted Favorite",
      });
    }
  };

  return (
    <li className="flex flex-1 w-full px-2 py-1 rounded-md hover:bg-muted justify-start items-center dark:text-white dark:hover:bg-muted dark:hover:text-white">
      <StarIcon className="w-4 h-4 mr-2" />
      <Link
        href={`/dashboard/${workspaceId}/${favorite.document.id}`}
        className={cn("flex-1 w-full justify-start ml-2")}
      >
        {favorite.document.title}
      </Link>
      <Button
        className="round-full hover:bg-slate-300"
        variant={"ghost"}
        size={"smallIcon"}
      >
        <XIcon onClick={() => handleDeleteFavorite()} />
      </Button>
    </li>
  );
};

export default FavoriteItem;
