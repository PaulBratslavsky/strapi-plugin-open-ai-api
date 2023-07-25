// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import qs from "qs";
import { useFetchClient } from "@strapi/helper-plugin";

import {
  Button,
  Typography,
  IconButton,
  Box,
  TextInput,
} from "@strapi/design-system";

import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@strapi/design-system";

import { Message } from "@strapi/icons";

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
`;

const ResponseText = styled.div`
  border: solid 1px #e3e9f3;
  border-radius: 4px;
  padding-bottom: 0.65625rem;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 0.65625rem;
  color: #32324d;
  font-weight: 400;
  font-size: 0.875rem;
  display: block;
  width: 100%;
  height: 400px;
  background: inherit;
  overflow-y: scroll;
  scroll-behavior: smooth;
`;

export default function ChatModal() {
  const { get } = useFetchClient();
  const ref = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [data]);

  async function handleQueryEmbeddings(e) {
    e.preventDefault();
    if (isLoading === false) setIsLoading(true);
    const response = await get(
      "/open-ai-api/embeddings/embeddings-query?" +
        qs.stringify({ query: inputValue })
    );
    setData((prev) => [...prev, response.data]);
    setInputValue("");
    setIsLoading(false);
  }

  function showResponse(data) {
    return data.map((item, index) => {
      return (
        <Box key={index} padding={1}>
          <Typography>{item.text}</Typography>
        </Box>
      );
    });
  }

  return (
    <div>
      <StyledIconButton onClick={() => setIsVisible(true)} icon={<Message />} />
      {isVisible && (
        <ModalLayout
          onClose={() => setIsVisible((prev) => !prev)}
          labelledBy="title"
        >
          <ModalHeader>
            <Typography
              fontWeight="bold"
              textColor="neutral800"
              as="h2"
              id="title"
            >
              Chat With Your Data
            </Typography>
          </ModalHeader>
          <ModalBody>
            {data.length > 0 && (
              <Box padding={1}>
                <ResponseText ref={ref}>{showResponse(data)}</ResponseText>
              </Box>
            )}
            <Box padding={1}>
              <TextInput
                placeholder="Enter your question"
                type="text"
                aria-label="Text"
                name="text"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
              />
            </Box>
          </ModalBody>
          <ModalFooter
            startActions={
              <Button
                onClick={() => setIsVisible((prev) => !prev)}
                variant="tertiary"
              >
                Cancel
              </Button>
            }
            endActions={
              <Button onClick={handleQueryEmbeddings} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
            }
          />
        </ModalLayout>
      )}
    </div>
  );
}
