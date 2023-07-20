// @ts-nocheck
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MDEditor from "@uiw/react-md-editor";
import { Box, TextInput, Button } from "@strapi/design-system";
import { useFetchClient } from "@strapi/helper-plugin";
import Header from '../../components/Header';
import pluginId from '../../pluginId';
import { useHistory, useParams } from "react-router-dom";

export default function EmbeddingDetails() {
  const history = useHistory();
  const params = useParams();
  const { del, get } = useFetchClient();

  const [data, setData] = useState({});
  const [error, setError] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await get(`/content-manager/collection-types/plugin::open-ai-api.embedding/${params.id}`);
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
    alert("Deleting")
    await deleteEmbeddings(params.id);
    history.push("/plugins/" + pluginId + "/");
  }

  return (
    <div className="container">
      <Header link={"/plugins/" + pluginId + "/"} title="Embeddings" subtitle="Create Embeddings" />
      <Box padding={8}>
        <h1>Embeddings Details: {params.id}</h1>
        <form onSubmit={handleSubmit}>
          <button type="submit">Delete</button>
        </form>
      </Box>
    </div>
  );
}
