"use client";

import { useCallback, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import { ParsedMember, parseCSVFile } from "@/utils/csv.utils";
import { Box, styled } from "@mui/material";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
  height: "100%",
  color: theme.palette.text.default,
}));

export default function AdminPage() {
  const [csvData, setCsvData] = useState<ParsedMember[]>([]);

  const handleUploadCSV = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const rows = (await parseCSVFile(file)) ?? [];
        setCsvData(rows);
      }
    };
    input.click();
  }, []);

  return (
    <Wrapper>
      <Box>
        <GeneralButton
          label="Upload CSV"
          onAction={handleUploadCSV}
          fullHeight={false}
          fullWidth={false}
          isPrimary={false}
        />
      </Box>
    </Wrapper>
  );
}
