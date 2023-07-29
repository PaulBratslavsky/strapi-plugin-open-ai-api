// @ts-nocheck
import React from "react";
import { useIntl } from "react-intl";
import { SettingsPageTitle } from "@strapi/helper-plugin";
import { HeaderLayout } from "@strapi/design-system/Layout";
import getTrad from "../utils/getTrad";

const OpenAiHeader = () => {

  return (
    <>
      <SettingsPageTitle
        name={"AI Embeddings"}
      />
      <HeaderLayout
        id="title"
        title={"AI Embeddings"}
        subtitle={"Settings for the AI Embeddings plugin"}
      />
    </>
  );
};

export default OpenAiHeader;
