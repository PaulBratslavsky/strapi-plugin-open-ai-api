// @ts-nocheck
/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from "react";
import { useFetchClient } from "@strapi/helper-plugin";
import { useHistory } from "react-router-dom";
import { EmptyStateLayout, Box, Button } from "@strapi/design-system";
import { Plus } from "@strapi/icons";
import pluginId from "../../pluginId";
import Illo from "../../components/Illo";
import ButtonLink from "../../components/ButtonLink";
import Header from "../../components/Header";
import PluginTable from "../../components/Table";

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

export default function HomePage() {
  const { get } = useFetchClient();
  const [embeddings, setEmbeddings] = useState([]);


  useEffect(() => {
    async function fetchData() {
      const response = await get("/open-ai-embeddings/embeddings/find?pagination[page]=1&pagination[pageSize]=2");
      console.log(response.data, "response");
      setEmbeddings(response.data);
    }
    fetchData();
  }, []);

  const { data, count } = embeddings;
  if (count === 0) return <EmptyState />;

  return (
    <Box padding={8}>
      <Header
        title="Embeddings"
        subtitle={`${count} results found`}
        primaryAction={
          <ButtonLink
            to={`/plugins/${pluginId}/embeddings`}
            icon={<Plus />}
            text="Create new embedding"
          />
        }
      />
      <PluginTable data={data} />
    </Box>
  );
}
