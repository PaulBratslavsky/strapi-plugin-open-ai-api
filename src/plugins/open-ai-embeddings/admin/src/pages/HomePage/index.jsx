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
import Pagination  from "../../components/Pagination";

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
        title="Embeddings"
        subtitle={`${data.length} results found`}
        primaryAction={
          <ButtonLink
            to={`/plugins/${pluginId}/embeddings`}
            icon={<Plus />}
            text="Create new embedding"
          />
        }
      />
      <PluginTable data={data} />
      <Pagination page={1} totalPages={26} basePath="/plugins/open-ai-embeddings/embeddings" />
    </Box>
  );
}
