"use client";
import {
  appCollectionsType,
  appWorkspacesType,
  useAppState,
} from "@/lib/providers/state-provider";
import { Collection, workspace } from "@/lib/supabase/supabase.types";
import { UploadBannerFormSchema } from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loader from "../global/Loader";
import {
  updateDocument,
  updateCollection,
  updateWorkspace,
} from "@/lib/supabase/queries";

interface BannerUploadFormProps {
  dirType: "workspace" | "document" | "collection";
  id: string;
}

const BannerUploadForm: React.FC<BannerUploadFormProps> = ({ dirType, id }) => {
  const supabase = createClientComponentClient();
  const { state, workspaceId, collectionId, dispatch } = useAppState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isUploading, errors },
  } = useForm<z.infer<typeof UploadBannerFormSchema>>({
    mode: "onChange",
    defaultValues: {
      banner: "",
    },
  });
  const onSubmitHandler: SubmitHandler<
    z.infer<typeof UploadBannerFormSchema>
  > = async (values) => {
    const document = values.banner?.[0];
    if (!document || !id) return;
    try {
      let filePath = null;

      const uploadBanner = async () => {
        const { data, error } = await supabase.storage
          .from("document-banners")
          .upload(`banner-${id}`, document, {
            cacheControl: "5",
            upsert: true,
          });
        if (error) throw new Error();
        filePath = data.path;
      };
      if (dirType === "document") {
        if (!workspaceId || !collectionId) return;
        await uploadBanner();
        dispatch({
          type: "UPDATE_FILE",
          payload: {
            document: { bannerUrl: filePath },
            fileId: id,
            collectionId,
            workspaceId,
          },
        });
        await updateDocument({ bannerUrl: filePath }, id);
      } else if (dirType === "collection") {
        if (!workspaceId || !collectionId) return;
        await uploadBanner();
        dispatch({
          type: "UPDATE_FOLDER",
          payload: {
            collectionId: id,
            collection: { bannerUrl: filePath },
            workspaceId,
          },
        });
        await updateCollection({ bannerUrl: filePath }, id);
      } else if (dirType === "workspace") {
        if (!workspaceId) return;
        await uploadBanner();
        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            workspace: { bannerUrl: filePath },
            workspaceId,
          },
        });
        await updateWorkspace({ bannerUrl: filePath }, id);
      }
    } catch (error) {}
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col gap-2"
    >
      <Label className="text-sm text-muted-foreground" htmlFor="bannerImage">
        Banner Image
      </Label>
      <Input
        id="bannerImage"
        type="file"
        accept="image/*"
        disabled={isUploading}
        {...register("banner", { required: "Banner Image is required" })}
      />
      <small className="text-red-600">
        {errors.banner?.message?.toString()}
      </small>
      <Button disabled={isUploading} type="submit">
        {!isUploading ? "Upload Banner" : <Loader />}
      </Button>
    </form>
  );
};

export default BannerUploadForm;
