// @ts-nocheck
/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
import PluginTable from '../../components/Table';
import { useFetchClient } from '@strapi/helper-plugin';
import { EmptyStateLayout, Box, Button, } from '@strapi/design-system';
import Plus from '@strapi/icons/Plus';
import Illo from '../../components/Illo';
;

function EmptyState() {
  return <div>
    <Box padding={8} background="neutral100">
      <EmptyStateLayout icon={<Illo />} content="Let's create our first embedding..." action={<Button
        onClick={() => history.push(`/plugins/${pluginId}/embeddings`)}
        variant="secondary" startIcon={<Plus />}>
        Create new embedding
      </Button>} />
    </Box>
  </div>
}

// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import Header from '../../components/Header';

const HomePage = () => {
  const { get } = useFetchClient();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await get("/content-manager/collection-types/plugin::open-ai-api.embedding");
      setData(data.data);
    }
    fetchData();
  }, []);

  if (data.length > 0) return <EmptyState />;
  const { results } = data;

  return (
    <Box padding={8} background="neutral100">
      <Header link="/" buttonLink={"/plugins/" + pluginId + "/embeddings"} buttonText="Create Embeddings" title="Embeddings" subtitle={results && `${results.length} results found`} />
      <PluginTable data={results} />
    </Box>

  );
};

export default HomePage;
