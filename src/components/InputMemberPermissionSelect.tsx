import * as React from "react";
import { useTranslation } from "react-i18next";
import { Permission } from "@/app/types";
import InputSelect, {
  InputSelectProps as SelectProps,
} from "@/components/InputSelect";

export default function InputMemberPermissionSelect(
  props: Partial<SelectProps> & { permissions: Permission[] }
) {
  const { t } = useTranslation();

  return (
    <InputSelect
      label={t("Permissions")}
      options={props.permissions}
      ariaLabel={t("Permissions")}
      labelHidden
      nude
      {...props}
    />
  );
}
