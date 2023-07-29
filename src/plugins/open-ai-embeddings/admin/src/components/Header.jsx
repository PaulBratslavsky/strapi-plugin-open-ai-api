import React from "react";
import { Box, BaseHeaderLayout, Link } from "@strapi/design-system";
import { ArrowLeft } from "@strapi/icons";

export default function Header({
  navigationAction,
  primaryAction,
  title,
  subtitle,
}) {
  return (
    <Box background="neutral100">
      <BaseHeaderLayout
        navigationAction={navigationAction}
        primaryAction={primaryAction}
        title={title}
        subtitle={subtitle}
        as="h2"
      />
    </Box>
  );
}
