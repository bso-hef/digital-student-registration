import React from "react";

import { ROWS_PER_PAGE_OPTIONS } from "@/constants/ui.constants";
import {
  Box,
  Pagination,
  PaginationItem,
  TablePagination,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const StyledPagination = styled(Pagination)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(2, 0, 2, 2),
  color: theme.palette.text.default,
}));

const StyledPaginationItem = styled(PaginationItem)(({ theme }) => ({
  color: theme.palette.text.default,
  borderRadius: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: theme.palette.surface.button.hover,
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.surface.button.primary,
    color: theme.palette.text.contrast,
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  border: "none",
  padding: 0,
  "& .MuiTablePagination-toolbar": {
    color: theme.palette.text.default,
    padding: 0,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  "& .MuiTablePagination-actions": {
    display: "none",
  },

  "& .MuiTablePagination-selectLabel": {
    order: 2,
    marginRight: theme.spacing(1),
  },

  "& .MuiTablePagination-select": {
    order: 3,
    padding: 0,
  },

  "& .MuiTablePagination-input": {
    padding: 0,
    display: "flex",
    alignItems: "center",
    flexDirection: "row-reverse",
  },

  "& .MuiTablePagination-displayedRows": {
    order: 1,
    marginRight: theme.spacing(2.5),
  },

  "& .MuiTablePagination-spacer": {
    flex: "0 0 0",
  },
}));

const StyledPaginationRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 0),
  color: theme.palette.text.default,
}));

const EnhancedPagination: React.FC<React.ComponentProps<typeof Pagination>> = (
  props,
) => {
  return (
    <StyledPagination
      renderItem={(item) => <StyledPaginationItem {...item} />}
      {...props}
    />
  );
};

type EnhancedTablePaginationProps = {
  rowsPerPageOptions: number[];
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const EnhancedTablePagination: React.FC<EnhancedTablePaginationProps> = ({
  rowsPerPageOptions,
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const { t } = useTranslation();

  const StyledTablePaginationAny =
    StyledTablePagination as unknown as React.ComponentType<
      React.ComponentProps<typeof TablePagination> & {
        component?: React.ElementType;
      }
    >;

  return (
    <StyledTablePaginationAny
      component="div"
      rowsPerPageOptions={rowsPerPageOptions}
      count={count}
      rowsPerPage={rowsPerPage}
      labelRowsPerPage={t("general.Rows per page")}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};

type EnhancedTablePaginationRowProps<T> = {
  rowsPerPageOptions?: number[];
  data: T[];
  rowsPerPage: number;
  page: number;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const EnhancedTablePaginationRow = <T,>({
  rowsPerPageOptions = ROWS_PER_PAGE_OPTIONS,
  data,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}: EnhancedTablePaginationRowProps<T>) => {
  return (
    <StyledPaginationRow>
      <EnhancedTablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        count={data?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <EnhancedPagination
        count={Math.ceil(data.length / rowsPerPage)}
        page={page + 1}
        size="small"
        onChange={(_, newPage) => handleChangePage(null, newPage)}
        showFirstButton
        showLastButton
      />
    </StyledPaginationRow>
  );
};

export default EnhancedTablePaginationRow;
