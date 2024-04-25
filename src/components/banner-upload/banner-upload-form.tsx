"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { UploadBannerFormSchema } from "@/lib/types";
import { updateDocument, updateWorkspace } from "@/server/api/queries";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Loader from "../global/Loader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface BannerUploadFormProps {
  dirType: "workspace" | "document";
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
      let documentPath = null;

      const uploadBanner = async () => {
        const { data, error } = await supabase.storage
          .from("document-banners")
          .upload(`banner-${id}`, document, {
            cacheControl: "5",
            upsert: true,
          });
        if (error) throw new Error();
        documentPath = data.path;
      };
      if (dirType === "document") {
        if (!workspaceId || !collectionId) return;
        await uploadBanner();
        dispatch({
          type: "UPDATE_DOCUMENT",
          payload: {
            document: { bannerUrl: documentPath },
            documentId: id,
            collectionId,
            workspaceId,
          },
        });
        await updateDocument(id, { bannerUrl: documentPath });
      } else if (dirType === "workspace") {
        if (!workspaceId) return;
        await uploadBanner();
        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            workspace: { bannerUrl: documentPath },
            workspaceId,
          },
        });
        await updateWorkspace({ bannerUrl: documentPath }, id);
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
