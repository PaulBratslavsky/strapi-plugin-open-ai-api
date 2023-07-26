// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import pluginId from "../../pluginId";
import { useHistory } from "react-router-dom";
import qs from "qs";

import { useFetchClient } from "@strapi/helper-plugin";

import {
  Link,
  Button,
  Typography,
  IconButton,
  Box,
  TextInput,
  Accordion,
  AccordionToggle,
  AccordionContent,
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

const StyledTypography = styled(Typography)`
  display: block;
  margin-top: 1rem;
  margin-bottom: 1rem;
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

function AccordionDetails({ title, content, children }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Box padding={1} background={"primary100"}>
      <Accordion
        expanded={expanded}
        onToggle={() => setExpanded((s) => !s)}
        id="acc-1"
        size="S"
      >
        <AccordionToggle title={title} />
        <AccordionContent>
          <Box padding={3}>
            <Typography>{content}</Typography>
            {children && <Box padding={1}>{children}</Box>}
          </Box>
        </AccordionContent>
      </Accordion>
    </Box>
  );
}

export default function ChatModal() {
  const { get } = useFetchClient();
  const ref = useRef(null);
  const history = useHistory();

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [data]);

  function redirect(id) {
    setIsVisible(false);
    history.push("/plugins/" + pluginId + "/embeddings/" + id);
  }

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
      console.log(item.sourceDocuments[0].pageContent);
      return (
        <Box key={index}>
          <Box padding={1}>
            <StyledTypography>{item.text}</StyledTypography>
          </Box>

          {item.sourceDocuments.map((doc, index) => {
            console.log(doc);
            return (
              <AccordionDetails
                key={index}
                title="Original Source Document"
                content={doc.pageContent}
              >
                <Link onClick={() => redirect(doc.metadata.id)}>
                  View Source for {doc.metadata.title}
                </Link>
              </AccordionDetails>
            );
          })}
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
