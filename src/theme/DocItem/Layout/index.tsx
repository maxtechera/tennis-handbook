import React from "react";
import OriginalDocItemLayout from "@theme-original/DocItem/Layout";
import type DocItemLayoutType from "@theme/DocItem/Layout";
import type { WrapperProps } from "@docusaurus/types";
import TranslationNotice from "../../../components/TranslationNotice";

type Props = WrapperProps<typeof DocItemLayoutType>;

export default function DocItemLayoutWrapper(props: Props): JSX.Element {
  return (
    <>
      <TranslationNotice />
      <OriginalDocItemLayout {...props} />
    </>
  );
}
