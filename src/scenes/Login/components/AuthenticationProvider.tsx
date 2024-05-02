import * as React from "react";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
// import PluginIcon from "@/components/PluginIcon";
import { client } from "@/utils/ApiClient";
import { getRedirectUrl } from "../getRedirectUrl";
import { Button } from "@/components/ui/button";
import Input from "@/components/Input";

type Props = {
  id: string;
  name: string;
  authUrl: string;
  isCreate: boolean;
  onEmailSuccess: (email: string) => void;
};

function AuthenticationProvider(props: Props) {
  const { t } = useTranslation();
  const [showEmailSignin, setShowEmailSignin] = React.useState(false);
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const { isCreate, id, name, authUrl } = props;

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmitEmail = async (
    event: React.SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (showEmailSignin && email) {
      setSubmitting(true);

      try {
        const response = await client.post(event.currentTarget.action, {
          email,
          undefined,
        });

        if (response.redirect) {
          window.location.href = response.redirect;
        } else {
          props.onEmailSuccess(email);
        }
      } finally {
        setSubmitting(false);
      }
    } else {
      setShowEmailSignin(true);
    }
  };

  const href = getRedirectUrl(authUrl);

  if (id === "email") {
    if (isCreate) {
      return null;
    }

    return (
      <div className="w-full">
        <form
          className="w-full flex justify-between"
          method="POST"
          action="/auth/email"
          onSubmit={handleSubmitEmail}
        >
          {showEmailSignin ? (
            <>
              <Input
                type="email"
                name="email"
                placeholder="me@domain.com"
                value={email}
                onChange={handleChangeEmail}
                disabled={isSubmitting}
                autoFocus
                required
                short
              />
              <Button type="submit" disabled={isSubmitting}>
                {t("Sign In")} →
              </Button>
            </>
          ) : (
            <Button type="submit">
              <Mail size={24} />
              {t("Continue with Email")}
            </Button>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Button onClick={() => (window.location.href = href)}>
        {/* <PluginIcon type={id} /> */}
        {t("Continue with {{ authProviderName }}", {
          authProviderName: name,
        })}
      </Button>
    </div>
  );
}

export default AuthenticationProvider;
