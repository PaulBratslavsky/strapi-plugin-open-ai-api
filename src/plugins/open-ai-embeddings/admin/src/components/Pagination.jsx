// @ts-nocheck
import React from "react";
import {
  NextLink,
  Pagination as StrapiPagination,
  PreviousLink,
} from "@strapi/design-system/v2";

import { Box, Flex } from "@strapi/design-system";

export default function Pagination({ page, totalPages, handlePageChange }) {
  return (
    <Box padding={8}>
      <Flex justifyContent="end">
        <StrapiPagination activePage={page} pageCount={totalPages}>
          <PreviousLink onClick={() => handlePageChange(page - 1)}>
            Go to previous page
          </PreviousLink>
          <div>{page}</div>
          <NextLink onClick={() => handlePageChange(page + 1)}>
            Go to next page
          </NextLink>
        </StrapiPagination>
      </Flex>
    </Box>
  );
}