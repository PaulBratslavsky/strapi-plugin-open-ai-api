// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, Button } from "@strapi/design-system";
import { useFetchClient } from "@strapi/helper-plugin";
import Header from "../../components/Header";
import pluginId from "../../pluginId";
import { useHistory, useParams } from "react-router-dom";

export default function EmbeddingDetails() {
  const history = useHistory();
  const params = useParams();
  const { del, get } = useFetchClient();

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await get(`/open-ai-api/embeddings/find/${params.id}`);
      setData(data.data);
    }
    fetchData();
  }, []);

  const deleteEmbeddings = async (id) => {
    if (isLoading === false) setIsLoading(true);
    await del(`/open-ai-api/embeddings/delete-embedding/${id}`);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    alert("Deleting");
    await deleteEmbeddings(params.id);
    history.push("/plugins/" + pluginId + "/");
  }

  return (
    <div className="container">
      <Header
        link={"/plugins/" + pluginId + "/"}
        title="Manage Embeddings"
        subtitle="Manage your embeddings"
      />
      <Box padding={8}>
        <h1>Embeddings Details: {params.id}</h1>
        <h2>{data.title}</h2>
        <p>{data.content}</p>
        <pre>{JSON.stringify(data.embeddings, null, 2)}</pre>
      </Box>
      <Box padding={8}>
        <form onSubmit={handleSubmit}>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Deleting Embeddings" : "Delete Embeddings"}
          </Button>
        </form>
      </Box>
    </div>
  );
}
