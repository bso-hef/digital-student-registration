"use client";

import React, { Fragment, memo, useCallback, useEffect, useState } from "react";

import { CHECKBOX_COL_WIDTH } from "@/constants/ui.constants";
import { applicationScrollbar } from "@/utils/styling.utils";
import { getComparator, stableSort } from "@/utils/table.utils";
import ReportGmailerrorredRoundedIcon from "@mui/icons-material/ReportGmailerrorredRounded";
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { EnhancedTableHead } from "./EnhancedTableHead";
import { EnhancedTablePaginationRow } from "./Pagination";

const StyledTableWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "flex-start",
  overflow: "auto",
  transitionDuration: ".3s",
  flex: 1,
  minHeight: 0,
  borderRadius: theme.spacing(0.5),
  color: theme.palette.text.default,
  ...applicationScrollbar(theme),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  backgroundColor: theme.palette.surface.interface.base,
  backgroundImage: "unset",
  color: theme.palette.text.default,
  width: "100%",
  borderRadius: theme.spacing(0.5),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-child(even)": {
    backgroundColor: `${theme.palette.surface.button.hoverLight} !important`,
  },
  "&:hover": {
    backgroundColor: theme.palette.surface.button.hover,
    color: theme.palette.text.default,
  },
}));

const StyledTableCheckBoxCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.border.seperator}`,
  padding: 0,
  width: CHECKBOX_COL_WIDTH,
  textAlign: "center",
  verticalAlign: "middle",
  height: 48,
  maxHeight: 48,
  boxSizing: "border-box",
  backgroundImage: "unset",
  color: theme.palette.text.default,
  "& .MuiCheckbox-root": { padding: 0, margin: 0 },
  "& .MuiSvgIcon-root": { fontSize: 18 },
}));

const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== "width",
})(({ theme, width }) => ({
  backgroundImage: "unset",
  border: `1px solid ${theme.palette.border.seperator}`,
  color: theme.palette.text.default,
  fontWeight: "400",
  fontSize: "16px",
  padding: "4px 16px",
  width: width,
  height: 48,
  maxHeight: 48,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  color: theme.palette.text.default,
  "&:hover": {
    color: theme.palette.text.contrast,
    cursor: "pointer",
  },
  "& a": {
    color: theme.palette.text.default,
    "&:hover": {
      color: `${theme.palette.text.primary}`,
      cursor: "pointer",
    },
  },
}));

interface TableHeader {
  id: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: string | number;
  clickable?: boolean;
}

interface DataTableProps {
  headers: TableHeader[];
  data: Array<Record<string, unknown>>;
  setSelectedItems?: (items: (string | number)[]) => void;
  onClickRowItem?: (id: string | number) => void;
  onClickActionCell?: (id: string | number) => void;
  clearSelected?: boolean;
  setClearSelected?: (clear: boolean) => void;
  dataSelection?: boolean;
  loading?: boolean;
  notFoundTitle?: string;
  notFoundDescription?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  headers,
  data,
  setSelectedItems,
  onClickRowItem = () => {},
  onClickActionCell,
  clearSelected,
  setClearSelected,
  dataSelection = true,
  loading = false,
  notFoundTitle,
  notFoundDescription,
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

  useEffect(() => {
    if (setSelectedItems) {
      setSelectedItems(selected);
    }
  }, [setSelectedItems, selected]);

  useEffect(() => {
    if (clearSelected) {
      if (typeof setSelectedItems === "function") {
        setSelectedItems([]);
      }
      setSelected([]);
      if (typeof setClearSelected === "function") {
        setClearSelected(false);
      }
    }
  }, [clearSelected, setClearSelected, setSelectedItems]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: React.SetStateAction<string>,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage - 1);
    },
    [setPage],
  );

  const handleSelectAllClick = (event: { target: { checked: boolean } }) => {
    if (event.target.checked) {
      const newSelecteds = data
        .filter((i) => !(i as { disabled?: boolean }).disabled)
        .map((n) => (n as { id: string | number }).id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (
    event: React.MouseEvent<HTMLTableCellElement>,
    id: string | number,
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: (string | number)[] | ((prevState: never[]) => never[]) =
      [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = useCallback(
    (event: { target: { value: string } }) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [setPage, setRowsPerPage],
  );

  const isSelected = (name: string | number) => selected.indexOf(name) !== -1;

  return (
    <StyledTableWrapper>
      {data?.length > 0 && (
        <Fragment>
          <StyledTableContainer>
            <StyledTable
              size="small"
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                headers={headers}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={
                  data?.filter((i) => !(i as { disabled?: boolean }).disabled)
                    ?.length
                }
                dataSelection={dataSelection}
              />

              <TableBody>
                {stableSort(data || [], getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: Record<string, unknown>, index: number) => {
                    const isItemSelected = isSelected(
                      row.id as string | number,
                    );
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <StyledTableRow
                        role="checkbox"
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        tabIndex={-1}
                        key={`${row.id}-${index}`}
                      >
                        {dataSelection && (
                          <StyledTableCheckBoxCell
                            component="td"
                            id={labelId}
                            scope="row"
                            padding="checkbox"
                            align="center"
                            onClick={(event) =>
                              !row?.disabled &&
                              handleSelectClick(
                                event,
                                row.id as string | number,
                              )
                            }
                          >
                            <Checkbox
                              checked={
                                selected.indexOf(row.id as string | number) !==
                                  -1 && !row?.disabled
                              }
                              color="primary"
                              disabled={Boolean(
                                (row as { disabled?: boolean }).disabled,
                              )}
                              size="small"
                            />
                          </StyledTableCheckBoxCell>
                        )}

                        {headers.map((header) => {
                          if (
                            header.id === "analytics" ||
                            header.id === "actions" ||
                            header.id === "callType" ||
                            header.id === "recordings" ||
                            header.id === "files"
                          ) {
                            return (
                              <StyledTableCell
                                key={`${row.id}-${header.id}`}
                                width={row.width as string | number | undefined}
                                align="center"
                                onClick={() =>
                                  onClickActionCell &&
                                  onClickActionCell(row.id as string | number)
                                }
                              >
                                <StyledBox key={`${row.id}-${header.id}-box`}>
                                  {row[header.id] as React.ReactNode}
                                </StyledBox>
                              </StyledTableCell>
                            );
                          }

                          return (
                            <StyledTableCell
                              key={`${row.id}-${header.id}`}
                              width={header.width}
                              align={header.align}
                              onClick={() =>
                                header.clickable &&
                                onClickRowItem(row.id as string | number)
                              }
                            >
                              <StyledBox>
                                {row[header.id] as React.ReactNode}
                              </StyledBox>
                            </StyledTableCell>
                          );
                        })}
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </StyledTable>
          </StyledTableContainer>
          {!loading && dataSelection && (
            <EnhancedTablePaginationRow
              data={data}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          )}
        </Fragment>
      )}

      {data?.length < 1 && !loading && (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Box sx={{ fontSize: 60 }}>
            <ReportGmailerrorredRoundedIcon
              fontSize="inherit"
              color="secondary"
            />
          </Box>
          <Box sx={{ fontSize: 20, fontWeight: "bold", mb: 1 }}>
            {notFoundTitle || t("table.No data found")}
          </Box>
          <Box sx={{ fontSize: 16, color: "text.secondary" }}>
            {notFoundDescription || t("table.No data found description")}
          </Box>
        </Box>
      )}
    </StyledTableWrapper>
  );
};

export default memo(DataTable);
