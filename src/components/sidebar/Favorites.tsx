"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { StarWithDocument } from "@/lib/supabase/supabase.types";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import TooltipComponent from "../global/tooltip-component";
import FavoriteItem from "./FavoriteItem";
import { Button } from "../ui/button";

interface FavoritesListProps {}

const FavoritesList: React.FC<FavoritesListProps> = ({}) => {
  const { state, dispatch } = useAppState();
  const [favorites, setFavorites] = useState<StarWithDocument[]>([]);

  const { subscription } = useSupabaseUser();

  useEffect(() => {
    setFavorites(state.favorites || []);
  }, [state.favorites]);

  return (
    <>
      <div
        className="flex
        sticky 
        z-20 
        top-0 
        w-full  
        h-10 
        group/title 
        justify-between 
        items-center 
        pr-4 
        text-Neutrals/neutrals-8
  "
      >
        <span
          className="text-Neutrals-8 
        font-bold 
        text-xs"
        >
          Favorites
        </span>
        <TooltipComponent message="Create Favorates">
          <PlusIcon
            onClick={() => {}}
            size={16}
            className="group-hover/title:inline-block
            hidden 
            cursor-pointer
            hover:dark:text-white
          "
          />
        </TooltipComponent>
      </div>
      <ul className="flex flex-col w-full items-start flex-1">
        {favorites.length ? (
          favorites.map((favorite) => (
            <FavoriteItem key={favorite.id} favorite={favorite} />
          ))
        ) : (
          <li className="flex items-center justify-center w-full h-10">
            <span className="text-Neutrals-8 text-sm">No favorites?</span>
            <Button variant={"link"}>Add Some</Button>
          </li>
        )}
      </ul>
    </>
  );
};

export default FavoritesList;
