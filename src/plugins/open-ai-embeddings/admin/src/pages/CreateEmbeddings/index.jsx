// @ts-nocheck
import React from "react";
import { Box } from "@strapi/design-system";
import { useFetchClient } from "@strapi/helper-plugin";
import CreateEmbeddingsForm from "../../components/CreateEmbeddingsForm";
import Header from "../../components/Header";
import pluginId from "../../pluginId";
import { useHistory } from "react-router-dom";

export default function CreateEmbeddings() {
  const { post } = useFetchClient();
  const [input, setInput] = React.useState("");
  const [markdown, setMarkdown] = React.useState("Enter text here");
  const [error, setError] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const history = useHistory();

  const createEmbeddings = async () => {
    if (isLoading === false) setIsLoading(true);

    await post("/open-ai-embeddings/embeddings/create-embedding", {
      data: {
        title: input,
        content: markdown,
        collectionType: "embeddings",
        fieldName: "embeddings",
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
    </div>
  );
}
