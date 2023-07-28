// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useFetchClient, CheckPagePermissions } from "@strapi/helper-plugin";
import styled from "styled-components";
import {
  ContentLayout,
  Main,
  Box,
  TextInput,
  Button,
  Stack,
  Grid,
  GridItem,
} from "@strapi/design-system";

const BoxWrapper = styled(Box)`
  margin-bottom: 1rem;
`;

import pluginPermissions from "../../permissions";
import OpenAiHeader from "../../components/OpenAiHeader";

const ProtectedSettingsPage = () => {
  return (
    <CheckPagePermissions permissions={pluginPermissions.settingsUpdate}>
      <SettingsPage />
    </CheckPagePermissions>
  );
};

const SettingsForm = () => {
  const { get, put } = useFetchClient();
  const [apiKey, setApiKey] = useState("");
  const [pineConeApiKey, setPineConeApiKey] = useState("");
  const [pineConeApiEnv, setPineConeApiEnv] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await get("/open-ai-embeddings/get-settings");
      setApiKey(data ? data.data.apiKey : "");
      setPineConeApiKey(data ? data.data.pineConeApiKey : "");
      setPineConeApiEnv(data ? data.data.pineConeApiEnv : "");
    }
    fetchData();
  }, []);

  const updateData = async () => {
    if (isLoading === false) setIsLoading(true);
    await put("/open-ai-embeddings/update-settings", {
      data: {
        apiKey: apiKey,
        pineConeApiKey: pineConeApiKey,
        pineConeApiEnv: pineConeApiEnv,
      },
    });
    setIsLoading(false);
  };

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    await updateData();
  }

  return (
    <form onSubmit={onSubmit}>
      <BoxWrapper
        background="neutral0"
        hasRadius
        shadow="filterShadow"
        paddingTop={6}
        paddingBottom={6}
        paddingLeft={7}
        paddingRight={7}
      >
        <Stack spacing={4}>
          <Grid gap={5}>
            <GridItem key="apiKey" col={12}>
              <TextInput
                placeholder="OpenAI API Key"
                label="OpenAI API Key"
                name="apiKey"
                type="password"
                error={false}
                onChange={(e) => setApiKey(e.target.value)}
                value={apiKey}
              />
            </GridItem>
          </Grid>
        </Stack>
      </BoxWrapper>
      <BoxWrapper
        background="neutral0"
        hasRadius
        shadow="filterShadow"
        paddingTop={6}
        paddingBottom={6}
        paddingLeft={7}
        paddingRight={7}
      >
        <Stack spacing={4}>
          <Grid gap={5}>
            <GridItem key="pineConeApiEnv" col={12}>
              <TextInput
                placeholder="Pinecone Environment"
                label="Pinecone Environment"
                name="pineConeApiEnv"
                type="password"
                error={false}
                onChange={(e) => setPineConeApiEnv(e.target.value)}
                value={pineConeApiEnv}
              />
            </GridItem>
            <GridItem key="pineConeApiKey" col={12}>
              <TextInput
                placeholder="Pinecone API Key"
                label="Pinecone API Key"
                name="pineConeApiKey"
                type="password"
                error={false}
                onChange={(e) => setPineConeApiKey(e.target.value)}
                value={pineConeApiKey}
              />
            </GridItem>
          </Grid>
        </Stack>
      </BoxWrapper>
      <Stack spacing={4}>
        <Grid gap={5}>
          <GridItem key="submit" col={12}>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving Settings" : "Save Settings"}
            </Button>
          </GridItem>
        </Grid>
      </Stack>
    </form>
  );
};

const SettingsPage = () => {
  return (
    <Main labelledBy="title">
      <OpenAiHeader />
      <ContentLayout>
        <SettingsForm />
      </ContentLayout>
    </Main>
  );
};

export default ProtectedSettingsPage;
