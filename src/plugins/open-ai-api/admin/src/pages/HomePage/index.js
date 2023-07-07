// @ts-nocheck
/*
 *
 * HomePage
 *
 */

import React from 'react';
import { useHistory } from "react-router-dom";
import { EmptyStateLayout, Box, Button, } from '@strapi/design-system';
import Plus from '@strapi/icons/Plus';
import Illo from '../../components/Illo';
;
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const HomePage = () => {
  const history = useHistory();

  return (
    <div>
      <Box padding={8} background="neutral100">
        <EmptyStateLayout icon={<Illo />} content="Let's create our first embedding..." action={<Button
          onClick={() => history.push(`/plugins/${pluginId}/embeddings`)}
          variant="secondary" startIcon={<Plus />}>
          Create new embedding
        </Button>} />
      </Box>
    </div>
  );
};

export default HomePage;
