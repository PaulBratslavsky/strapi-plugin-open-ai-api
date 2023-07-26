// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Typography,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@strapi/design-system";
import { ExclamationMarkCircle, Trash } from "@strapi/icons";
import { useFetchClient } from "@strapi/helper-plugin";
import Header from "../../components/Header";
import pluginId from "../../pluginId";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";

const StyledTypography = styled(Typography)`
  display: block;
  margin-bottom: 1rem;
`;

function ConfirmDeleteEmbedding({ callback, isLoading }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setIsVisible(true)}>Deleting Embeddings</Button>
      <Dialog
        onClose={() => setIsVisible(false)}
        title="Confirmation"
        isOpen={isVisible}
      >
        <DialogBody icon={<ExclamationMarkCircle />}>
          <Flex direction="column" alignItems="center" gap={2}>
            <Flex justifyContent="center">
              <Typography id="confirm-description">
                Are you sure you want to delete this?
              </Typography>
            </Flex>
          </Flex>
        </DialogBody>
        <DialogFooter
          startAction={
            <Button onClick={() => setIsVisible(false)} variant="tertiary">
              Cancel
            </Button>
          }
          endAction={
            <Button
              variant="danger-light"
              onClick={callback}
              startIcon={<Trash />}
              disabled={isLoading}
            >
              {isLoading ? "Deleting Embeddings" : "Delete Embeddings"}
            </Button>
          }
        />
      </Dialog>
    </>
  );
}

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

  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    await deleteEmbeddings(params.id);
    history.push("/plugins/" + pluginId + "/");
  }

  return (
    <Box padding={8}>
      <Header
        link={"/plugins/" + pluginId + "/"}
        title={data.title || "Embeddings Details"}
        subtitle={`Pinecone ID: ${data.embeddingsId}`}
      />
      <Box padding={8}>
        <Box padding={4} background="neutral0">
          <StyledTypography variant="beta">Embeddings Content</StyledTypography>
          <StyledTypography variant="omega">{data.content}</StyledTypography>
        </Box>
      </Box>
      <Box padding={8}>
        <ConfirmDeleteEmbedding callback={handleDelete} />
      </Box>
    </Box>
  );
}
