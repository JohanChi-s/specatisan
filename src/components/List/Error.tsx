import { CloudOff, ShieldAlert } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Empty from "@/components/Empty";
import useEventListener from "@/hooks/useEventListener";
import { OfflineError } from "@/utils/errors";
import Flex from "../Flex";
import { Button } from "../ui/button";

type Props = {
  error: Error;
  retry: () => void;
};

export default function LoadingError({ error, retry, ...rest }: Props) {
  const { t } = useTranslation();
  useEventListener("online", retry);

  const message =
    error instanceof OfflineError ? (
      <>
        <CloudOff /> {t("You’re offline.")}
      </>
    ) : (
      <>
        <ShieldAlert /> {t("Sorry, an error occurred.")}
      </>
    );

  return (
    <div className="py-8 whitespace-nowrap">
      <Flex align="center" gap={4} wrap>
        {message}{" "}
        <Button variant={"link"} onClick={() => retry()}>
          {t("Click to retry")}
        </Button>
      </Flex>
    </div>
  );
}
