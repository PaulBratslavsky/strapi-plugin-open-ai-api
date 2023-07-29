// @ts-nocheck
import React from "react";
import { useIntl } from "react-intl";
import { SettingsPageTitle } from "@strapi/helper-plugin";
import { HeaderLayout } from "@strapi/design-system/Layout";
import getTrad from "../utils/getTrad";

const OpenAiHeader = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <SettingsPageTitle
        name={"Open AI API"}
      />
      <HeaderLayout
        id="title"
        title={"Open AI API"}
        subtitle={"Settings for the Open AI API plugin"}
      />
    </>
  );
};

export default OpenAiHeader;
