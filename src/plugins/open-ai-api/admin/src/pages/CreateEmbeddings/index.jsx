// @ts-nocheck
import React from "react";
import styled from "styled-components";
import MDEditor from "@uiw/react-md-editor";
import { Box, TextInput, Button } from "@strapi/design-system";
import { useFetchClient } from "@strapi/helper-plugin";
import Header from "../../components/Header";
import pluginId from "../../pluginId";
import { useHistory } from "react-router-dom";

const StyledMDEditor = styled(MDEditor)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export default function CreateEmbeddings() {
  const { post } = useFetchClient();
  const [input, setInput] = React.useState("");
  const [markdown, setMarkdown] = React.useState("Enter text here");
  const [error, setError] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const history = useHistory();

  const createEmbeddings = async () => {
    if (isLoading === false) setIsLoading(true);
    await post("/open-ai-api/embeddings/create-embedding", {
      data: { title: input, content: markdown },
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
    history.push("/plugins/" + pluginId + "/");
  }

  return (
    <div className="container">
      <Header
        link={"/plugins/" + pluginId + "/"}
        title="Embeddings"
        subtitle={`Chunk Size: ${markdown.length}`}
      />
      <Box padding={8}>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={isLoading}>
            <TextInput
              placeholder="Title"
              label="Title"
              name="input"
              error={input.length > 55 ? "input is too long" : undefined}
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <div data-color-mode="light" >
              <StyledMDEditor
                value={markdown}
                onChange={handleMarkdownChange}
                height={400}
              />
              <div>{error && <p>{error}</p>}</div>
            </div>
            <Button type="submit" disabled={isLoading || error}>
              {isLoading ? "Creating Embeddings" : "Create Embeddings"}
            </Button>
          </fieldset>
        </form>
      </Box>
    </div>
  );
}
