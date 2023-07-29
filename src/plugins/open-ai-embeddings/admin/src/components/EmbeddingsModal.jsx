// @ts-nocheck
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useFetchClient } from "@strapi/helper-plugin";
import { useHistory } from 'react-router-dom';
import pluginId from '../pluginId';
import {
  Button,
  Typography,
  Box,
  ModalLayout,
  ModalBody,
} from "@strapi/design-system";
import { Plus, Eye } from "@strapi/icons";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import CreateEmbeddingsForm from "./CreateEmbeddingsForm";

const StyledTypography = styled(Typography)`
  display: block;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export default function EmbeddingsModal() {
  const { post } = useFetchClient();
  const history = useHistory();
  const dataManager = useCMEditViewDataManager();
  const initialData = dataManager.initialData;

  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = React.useState("");
  const [fieldname, setFieldname] = React.useState("");
  const [markdown, setMarkdown] = React.useState("Enter text here");
  const [error, setError] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [response, setResponse] = React.useState(null);

  useEffect(() => {
    for (const [key, value] of Object.entries(dataManager.layout.attributes)) {
      if (value.type === "richtext") {
        setFieldname(key);
        setMarkdown(dataManager.modifiedData[key]);
      }
    }
  }, [dataManager.modifiedData]);

  const createEmbeddings = async () => {
    if (isLoading === false) setIsLoading(true);
    return await post("/open-ai-embeddings/embeddings/create-embedding", {
      data: {
        title: input,
        content: markdown,
        collectionType: dataManager.slug,
        fieldName: fieldname,
        related: {
          __type: dataManager.slug,
          id: initialData.id,
        },
      },
    });
  };


  function handleMarkdownChange(value) {
    if (value.length > 4000) { setError("Chunk size limit reached"); }
    setMarkdown(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const response = await createEmbeddings();
    setIsVisible(false);
    setResponse(response);
  }

  return (
    <div>
      {initialData?.embedding || response ? (
        <Button
          onClick={() =>
            history.push(
              "/plugins/" +
                pluginId +
                "/embeddings/" +
                initialData?.embedding.id
            )
          }
          startIcon={<Eye />}
          fullWidth
        >
          View Embedding
        </Button>
      ) : (
        <Button
          onClick={() => setIsVisible(true)}
          startIcon={<Plus />}
          disabled={!initialData.publishedAt}
          fullWidth
        >
          Create new embedding
        </Button>
      )}

      {isVisible && (
        <ModalLayout
          onClose={() => setIsVisible((prev) => !prev)}
          labelledBy="title"
        >
          <ModalBody>
            <Box padding={4}>
              <StyledTypography>{`Chunk Size: ${markdown.length}`}</StyledTypography>
              <CreateEmbeddingsForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                input={input}
                setInput={setInput}
                markdown={markdown}
                handleMarkdownChange={handleMarkdownChange}
                error={error}
              >
                <Button type="submit" disabled={isLoading || error}>
                  {isLoading ? "Creating Embeddings" : "Create Embeddings"}
                </Button>
              </CreateEmbeddingsForm>
            </Box>
          </ModalBody>
        </ModalLayout>
      )}
    </div>
  );
}
