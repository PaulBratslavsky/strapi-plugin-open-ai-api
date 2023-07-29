// @ts-nocheck
import React from "react";
import styled from "styled-components";
import MDEditor from "@uiw/react-md-editor";
import { TextInput } from "@strapi/design-system";

const StyledMDEditor = styled(MDEditor)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export default function CreateEmbeddingsForm({
  onSubmit,
  isLoading,
  input,
  setInput,
  markdown,
  handleMarkdownChange,
  error,
  height,
  children,
}) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={isLoading}>
        <TextInput
          placeholder="Title"
          label="Title"
          name="input"
          error={input.length > 55 ? "input is too long" : undefined}
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <div data-color-mode="light">
          <StyledMDEditor
            value={markdown}
            onChange={handleMarkdownChange}
            height={height || 400}
          />
          <div>{error && <p>{error}</p>}</div>
        </div>
        {children && children}
      </fieldset>
    </form>
  );
}
