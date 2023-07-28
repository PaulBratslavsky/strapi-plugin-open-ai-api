// @ts-nocheck
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import { useFetchClient } from "@strapi/helper-plugin";
import {
  Button,
  Typography,
  Box,
  ModalLayout,
  ModalBody,
} from "@strapi/design-system";
import { Plus } from "@strapi/icons";

import CreateEmbeddingsForm from "../CreateEmbeddingsForm";

const StyledTypography = styled(Typography)`
  display: block;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export default function EmbeddingsModal() {
  const dataManager = useCMEditViewDataManager();
  const initialData = dataManager.initialData;
  const [isVisible, setIsVisible] = useState(false);
  const { post } = useFetchClient();
  const [input, setInput] = React.useState("");
  const [fieldname, setFieldname] = React.useState("");
  const [markdown, setMarkdown] = React.useState("Enter text here");
  const [error, setError] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    for (const [key, value] of Object.entries(dataManager.layout.attributes)) {
      if (value.type === "richtext") {
        setFieldname(key);
        setMarkdown(dataManager.modifiedData[key]);
      }
    }
  }, [dataManager.modifiedData]);

  useEffect(() => {
    function checkIfEmbeddingExists(id) {
      console.log("checkIfEmbeddingExists", id);
    }

    checkIfEmbeddingExists(initialData.id);
  }, []);

  const createEmbeddings = async () => {
    if (isLoading === false) setIsLoading(true);
    await post("/open-ai-embeddings/embeddings/create-embedding", {
      data: {
        title: input,
        content: markdown,
        collectionType: dataManager.layout.apiID,
        fieldName: fieldname,
      },
    });
  };

  function handleMarkdownChange(value) {
    if (value.length > 4000) setError("Chunk size limit reached");
    setMarkdown(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    await createEmbeddings();
    setIsVisible(false);
  }

  return (
    <div>
      <Button
        onClick={() => setIsVisible(true)}
        startIcon={<Plus />}
        disabled={!initialData.publishedAt}
        fullWidth
      >
        Create new embedding
      </Button>
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
              />
            </Box>
          </ModalBody>
        </ModalLayout>
      )}
    </div>
  );
}
