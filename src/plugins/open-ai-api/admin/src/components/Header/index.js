import React from 'react';
import { Box, Button, BaseHeaderLayout, Link, } from '@strapi/design-system';
import { ArrowLeft, Plus, Pencil } from '@strapi/icons';
import { useHistory } from "react-router-dom";

function BackLink({ to }) {
  return <Link to={to} startIcon={<ArrowLeft />}> Go back </Link>
}

function EditLink({ to, text }) {
  const history = useHistory();
  return <Button startIcon={<Plus />} onClick={() => history.push(to)} >{text}</Button>
}

export default function Header({ link, buttonText, buttonLink, title, subtitle }) {
  return (
    <Box background="neutral100">
      <BaseHeaderLayout
        navigationAction={<BackLink to={link} />}
        primaryAction={buttonLink && buttonText ? <EditLink to={buttonLink} text={buttonText} /> : null}
        title={title} subtitle={subtitle} as="h2" />
    </Box>
  )
}
