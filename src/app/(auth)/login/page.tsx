// "use client";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { FormSchema } from "@/lib/types";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import Link from "next/link";
// import Image from "next/image";
// import Logo from ".@/.@/.@/.@/public/vercel.svg";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import Loader from "@/components/global/Loader";
// import { actionLoginUser } from "@/lib/server-actions/auth-actions";

// const LoginPage = () => {
//   const router = useRouter();
//   const [submitError, setSubmitError] = useState("");

//   const form = useForm<z.infer<typeof FormSchema>>({
//     mode: "onChange",
//     resolver: zodResolver(FormSchema),
//     defaultValues: { email: "", password: "" },
//   });

//   const isLoading = form.formState.isSubmitting;

//   const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (formData) => {
//     const { error } = await actionLoginUser(formData);
//     if (error) {
//       form.reset();
//       setSubmitError(error.message);
//     }
//     router.replace("/dashboard");
//   };

//   return (
//     <Form {...form}>
//       <form
//         onChange={() => {
//           if (submitError) setSubmitError("");
//         }}
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col"
//       >
//         <Link
//           href="/"
//           className="
//           w-full
//           flex
//           justify-left
//           items-center"
//         >
//           <Image src={Logo} alt="specatisan Logo" width={50} height={50} />
//           <span
//             className="font-semibold
//           dark:text-white text-4xl first-letter:ml-2"
//           >
//             specatisan.
//           </span>
//         </Link>
//         <FormDescription
//           className="
//         text-foreground/60"
//         >
//           An all-In-One Collaboration and Productivity Platform
//         </FormDescription>
//         <FormField
//           disabled={isLoading}
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <Input type="email" placeholder="Email" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           disabled={isLoading}
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <Input type="password" placeholder="Password" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         {submitError && <FormMessage>{submitError}</FormMessage>}
//         <Button type="submit" className="w-full p-6" size="lg" disabled={isLoading}>
//           {!isLoading ? "Login" : <Loader />}
//         </Button>
//         <span className="self-container">
//           Dont have an account?{" "}
//           <Link href="/signup" className="text-primary">
//             Sign Up
//           </Link>
//         </span>
//       </form>
//     </Form>
//   );
// };

// export default LoginPage;

"use client";

import find from "lodash/find";
import { observer } from "mobx-react";
import { Mail } from "lucide-react";
import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
// import { useLocation, Link, Redirect } from "react-router-dom";
import { usePathname, redirect } from "next/navigation";
import { getCookie, setCookie } from "tiny-cookie";
import { UserPreference } from "@/shared/types";
import { parseDomain } from "@/shared/utils/domains";
import { Config } from "@/stores/AuthStore";
import ChangeLanguage from "@/components/ChangeLanguage";
import OutlineIcon from "@/components/Icons/OutlineIcon";
import LoadingIndicator from "@/components/LoadingIndicator";
// import TeamLogo from "@/components/TeamLogo";
import { env } from "@/app/env";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLastVisitedPath from "@/hooks/useLastVisitedPath";
import useQuery from "@/hooks/useQuery";
import useStores from "@/hooks/useStores";
import isCloudHosted from "@/utils/isCloudHosted";
import { detectLanguage } from "@/utils/language";
import AuthenticationProvider from "@/scenes/Login/components/AuthenticationProvider";
import BackButton from "@/scenes/Login/components/BackButton";
import Notices from "@/scenes/Login/components/Notices";
// import { getRedirectUrl } from "@/getRedirectUrl";
import Link from "next/link";

type Props = {
  children?: (config?: Config) => React.ReactNode;
};

function Login({ children }: Props) {
  const pathname = usePathname();
  const query = useQuery();

  const { t } = useTranslation();
  const user = useCurrentUser({ rejectOnEmpty: false });
  const { auth } = useStores();
  const { config } = auth;
  const [error, setError] = React.useState(null);
  const [emailLinkSentTo, setEmailLinkSentTo] = React.useState("");
  const isCreate = pathname === "/create";
  const rememberLastPath = !!user?.getPreference(
    UserPreference.RememberLastPath
  );
  const [lastVisitedPath] = useLastVisitedPath();

  const handleReset = React.useCallback(() => {
    setEmailLinkSentTo("");
  }, []);
  const handleEmailSuccess = React.useCallback((email) => {
    setEmailLinkSentTo(email);
  }, []);

  React.useEffect(() => {
    auth.fetchConfig().catch(setError);
  }, [auth]);

  // React.useEffect(() => {
  //   const entries = Object.fromEntries(query.entries());
  //   const existing = getCookie("signupQueryParams");

  //   if (Object.keys(entries).length && !query.get("notice") && !existing) {
  //     setCookie("signupQueryParams", JSON.stringify(entries));
  //   }
  // }, [query]);

  if (
    auth.authenticated &&
    rememberLastPath &&
    lastVisitedPath !== location.pathname
  ) {
    return redirect(lastVisitedPath);
  }

  if (auth.authenticated && auth.team?.defaultCollectionId) {
    return redirect(`/collection/${auth.team?.defaultCollectionId}`);
  }

  if (auth.authenticated) {
    return redirect("/home");
  }

  if (error) {
    return (
      <div className="w-screen h-screen bg-background flex items-center justify-center">
        <BackButton />
        <ChangeLanguage locale={detectLanguage()} />
        <div className="text-center">
          <h2>{t("Error")}</h2>
          <span>
            {t("Failed to load configuration.")}
            {!isCloudHosted && (
              <p>
                {t(
                  "Check the network requests and server logs for full details of the error."
                )}
              </p>
            )}
          </span>
        </div>
      </div>
    );
  }

  if (!config) {
    return <LoadingIndicator />;
  }

  const isCustomDomain = parseDomain(window.location.origin).custom;

  if (isCloudHosted && isCustomDomain && !config.name) {
    return (
      <div className="w-screen h-screen bg-background flex items-center justify-center">
        <BackButton config={config} />
        <ChangeLanguage locale={detectLanguage()} />
        <div className="text-center">
          <h2>{t("Almost there")}…</h2>
          <span>
            {t(
              "Your custom domain is successfully pointing at Outline. To complete the setup process please contact support."
            )}
          </span>
        </div>
      </div>
    );
  }

  const hasMultipleProviders = config.providers.length > 1;
  const defaultProvider = find(
    config.providers,
    (provider) => provider.id === auth.lastSignedIn && !isCreate
  );

  if (emailLinkSentTo) {
    return (
      <div className="w-screen h-screen bg-background flex items-center justify-center">
        <BackButton config={config} />
        <div className="text-center">
          <Mail className="text-primary" size={38} />
          <h2>{t("Check your email")}</h2>
          <span>
            <Trans
              defaults="A magic sign-in link has been sent to the email <em>{{ emailLinkSentTo }}</em> if an account exists."
              values={{ emailLinkSentTo }}
              components={{ em: <em /> }}
            />
          </span>
          <button className="btn" onClick={handleReset}>
            {t("Back to login")}
          </button>
        </div>
      </div>
    );
  }

  // if (
  //   config.providers.length === 1 &&
  //   config.providers[0].id === "oidc" &&
  //   !env.OIDC_DISABLE_REDIRECT &&
  //   !query.get("notice")
  // ) {
  //   window.location.href = getRedirectUrl(config.providers[0].authUrl);
  //   return null;
  // }

  return (
    <div className="w-screen h-screen bg-background flex items-center justify-center">
      <BackButton config={config} />
      <ChangeLanguage locale={detectLanguage()} />
      <div className="text-center space-y-12">
        <div className="mb-4">
          {config.logo && !isCreate ? (
            <image href={config.logo} />
          ) : (
            <OutlineIcon size={48} />
          )}
        </div>
        {isCreate ? (
          <>
            <h2 className="text-2xl font-semibold">
              {t("Create a workspace")}
            </h2>
            <span>
              {t(
                "Get started by choosing a sign-in method for your new workspace below…"
              )}
            </span>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">
              {t("Login to {{ authProviderName }}", {
                authProviderName: config.name || env.APP_NAME,
              })}
            </h2>
            {children?.(config)}
          </>
        )}
        <Notices />
        {defaultProvider && (
          <>
            <AuthenticationProvider
              isCreate={isCreate}
              onEmailSuccess={handleEmailSuccess}
              {...defaultProvider}
            />
            {hasMultipleProviders && (
              <>
                <span>
                  {t("You signed in with {{ authProviderName }} last time.", {
                    authProviderName: defaultProvider.name,
                  })}
                </span>
                <hr className="my-4" />
              </>
            )}
          </>
        )}
        {config.providers.map((provider) => {
          if (defaultProvider && provider.id === defaultProvider.id) {
            return null;
          }
          return (
            <AuthenticationProvider
              key={provider.id}
              isCreate={isCreate}
              onEmailSuccess={handleEmailSuccess}
              {...provider}
            />
          );
        })}
        {isCreate && (
          <span>
            <Trans>
              Already have an account? Go to <Link href="/login">login</Link>.
            </Trans>
          </span>
        )}
      </div>
    </div>
  );
}

export default observer(Login);
