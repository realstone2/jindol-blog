import { LanguageSwitcher } from "./language-switcher";
import { getUserLanguage } from "app/lib/language";
import { headers } from "next/headers";
import { IpodContainerClient } from "./ipod-container-client";

interface IpodContainerProps {
  children: React.ReactNode;
  lang?: "ko" | "en";
}

export async function IpodContainer({ children }: IpodContainerProps) {
  const lang = await getUserLanguage();
  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") || "/";

  return (
    <IpodContainerClient
      lang={lang}
      currentPath={currentPath}
      languageSwitcher={<LanguageSwitcher lang={lang} />}
    >
      {children}
    </IpodContainerClient>
  );
}
