// @ts-nocheck
/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from "react";
import PluginTable from "../../components/Table";
import { useFetchClient } from "@strapi/helper-plugin";
import { useHistory } from "react-router-dom";
import { EmptyStateLayout, Box, Button } from "@strapi/design-system";
import Plus from "@strapi/icons/Plus";
import Illo from "../../components/Illo";
function EmptyState() {
  const history = useHistory();
  return (
    <div>
      <Box padding={8} background="neutral100">
        <EmptyStateLayout
          icon={<Illo />}
          content="Let's create our first embedding..."
          action={
            <Button
              onClick={() => history.push(`/plugins/${pluginId}/embeddings`)}
              startIcon={<Plus />}
            >
              Create new embedding
            </Button>
          }
        />
      </Box>
    </div>
  );
}

import pluginId from "../../pluginId";
import Header from "../../components/Header";

const HomePage = () => {
  const { get } = useFetchClient();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await get("/open-ai-embeddings/embeddings/find");
      setData(data.data);
    }
    fetchData();
  }, []);

  if (data.length === 0) return <EmptyState />;

  return (
    <Box padding={8}>
      <Header
        link="/"
        buttonLink={"/plugins/" + pluginId + "/embeddings"}
        buttonText="Create Embeddings"
        title="Embeddings"
        subtitle={`${data.length} results found`}
      />
      <PluginTable data={data} />
    </Box>
  );
};

export default HomePage;
