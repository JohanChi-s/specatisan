import { ChevronLeft } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { parseDomain } from "@/shared/utils/domains";
import { Config } from "@/stores/AuthStore";
import { env } from "@/app/env";
import isCloudHosted from "@/utils/isCloudHosted";

type Props = {
  config?: Config;
};

export default function BackButton({ config }: Props) {
  const { t } = useTranslation();
  const isSubdomain = !!config?.hostname;

  if (!isCloudHosted || parseDomain(window.location.origin).custom) {
    return null;
  }

  return (
    <a
      href={isSubdomain ? env.URL : "https://www.getoutline.com"}
      className="flex items-center text-gray-700 font-semibold transition-transform duration-100 ease-in-out hover:text-gray-800 hover:translate-x-1 absolute"
      style={{
        padding: "32px",
      }}
    >
      <ChevronLeft className="mr-1" />
      {t("Back to home")}
    </a>
  );
}
