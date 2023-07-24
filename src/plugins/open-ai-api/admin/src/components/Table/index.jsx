// @ts-nocheck
import React from "react";
import { useHistory } from "react-router-dom";
import pluginId from "../../pluginId";

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  BaseCheckbox,
  Typography,
  VisuallyHidden,
  Flex,
} from "@strapi/design-system";
import { ArrowLeft } from "@strapi/icons";

export default function PluginTable({ data }) {
  const ROW_COUNT = 6;
  const COL_COUNT = 10;
  const history = useHistory();

  return (
    <Box padding={8} background="neutral100">
      <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
        <Thead>
          <Tr>
            <Th>
              <BaseCheckbox aria-label="Select all entries" />
            </Th>
            <Th>
              <Typography variant="sigma">ID</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Title</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Content</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Embeddings ID</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Embeddings</Typography>
            </Th>
            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.map((entry) => {
              console.log(entry);
              return (
                <Tr key={entry.id}>
                  <Td>
                    <BaseCheckbox aria-label={`Select ${entry.contact}`} />
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">{entry.id}</Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">
                      {entry.title}
                    </Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">
                      {entry.content && entry.content.slice(0, 50)}...
                    </Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">
                      {entry.embeddingsId && entry.embeddingsId}
                    </Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">
                      {entry.embeddings && entry.embeddings.slice(0, 25)}...
                    </Typography>
                  </Td>
                  <Td>
                    <Flex>
                      <ArrowLeft
                        onClick={() =>
                          history.push(
                            "/plugins/" + pluginId + "/embeddings/" + entry.id
                          )
                        }
                        label="Edit"
                        noBorder
                      />
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </Box>
  );
}
