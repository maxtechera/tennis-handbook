import type { ReactNode } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

export default function TranslationNotice(): ReactNode {
  const { i18n } = useDocusaurusContext();

  // Only show on Spanish locale
  if (i18n.currentLocale !== "es") {
    return null;
  }

  return (
    <div className={styles.translationNotice}>
      <p>
        <strong>Nota:</strong> Esta página aún no está disponible en español. Se
        muestra la versión original en inglés.
      </p>
    </div>
  );
}
