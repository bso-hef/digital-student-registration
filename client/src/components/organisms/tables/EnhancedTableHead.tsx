import React from "react";

import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  styled,
} from "@mui/material";

type HeadCell = {
  id: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  headAlign?: "left" | "right" | "center";
  align?: "left" | "right" | "center";
  numeric?: boolean;
  disablePadding?: boolean;
};

type EnhancedTableHeadProps = {
  headers: HeadCell[];
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: "asc" | "desc";
  orderBy: string;
  numSelected: number;
  rowCount: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  dataSelection?: boolean;
};

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 1,
  "& .MuiTableCell-head": {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.default,
    fontWeight: 700,
    fontSize: "16px !important",
    lineHeight: "20px !important",
    border: `1px solid ${theme.palette.border.seperator}`,
    whiteSpace: "nowrap",
    padding: theme.spacing(2),
  },
  "& .MuiTableRow-head": {
    height: 40,
    borderTop: `1px solid ${theme.palette.border.seperator}`,
  },
}));

const HeadCheckboxCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.border.seperator}`,
  padding: theme.spacing(1.5),
  width: 44,
  textAlign: "center",
  "& .MuiCheckbox-root": { padding: 0 },
  "& .MuiSvgIcon-root": { fontSize: 18 },
}));

type HeadCellProps = { $width?: string | number };

const HeadCellStyled = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== "$width",
})<HeadCellProps>(({ theme, $width }) => ({
  border: `1px solid ${theme.palette.border.seperator}`,
  padding: theme.spacing(2),
  fontSize: 16,
  lineHeight: "20px",
  fontWeight: 700,
  color: theme.palette.text.default,
  backgroundImage: "unset",
  whiteSpace: "nowrap",
  maxHeight: 48,
  width: $width,
}));

const SortLabelStyled = styled(TableSortLabel)(({ theme }) => ({
  "& .MuiTableSortLabel-icon": {
    color: theme.palette.text.secondary,
  },
  "&.Mui-active": {
    color: `${theme.palette.text.default} !important`,
    "& .MuiTableSortLabel-icon": {
      color: `${theme.palette.text.default} !important`,
    },
  },
}));

const StyledHiddenSpan = styled("span")(() => ({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  top: 20,
  width: 1,
}));

export const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = ({
  headers,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  dataSelection,
}) => {
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown, MouseEvent>) => {
      onRequestSort(event, property);
    };

  return (
    <StyledTableHead>
      <TableRow>
        {dataSelection && (
          <HeadCheckboxCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all rows" }}
            />
          </HeadCheckboxCell>
        )}

        {headers.map((headCell) =>
          headCell.sortable ? (
            <HeadCellStyled
              key={headCell.id}
              $width={headCell.width}
              align={
                headCell.headAlign ||
                headCell.align ||
                (headCell.numeric ? "right" : "left")
              }
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <SortLabelStyled
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <StyledHiddenSpan>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </StyledHiddenSpan>
                ) : null}
              </SortLabelStyled>
            </HeadCellStyled>
          ) : (
            <HeadCellStyled
              $width={headCell.width}
              key={headCell.id}
              align={headCell.headAlign || headCell.align || "left"}
              padding="normal"
            >
              {headCell.label}
            </HeadCellStyled>
          ),
        )}
      </TableRow>
    </StyledTableHead>
  );
};
