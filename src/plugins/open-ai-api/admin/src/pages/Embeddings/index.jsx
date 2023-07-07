// @ts-nocheck
import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { Box } from "@strapi/design-system";

export default function Embeddings() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className="container">
      <Box padding={8} background="neutral100">
        <MDEditor value={value} onChange={setValue} />
      </Box>
    </div>
  );
}

/* 

  import rehypeSanitize from "rehype-sanitize";

  <MDEditor.Markdown
    source={value}
    style={{ whiteSpace: "pre-wrap" }}
    previewOptions={{
      rehypePlugins: [[rehypeSanitize]],
    }}
  /> 
  
*/
