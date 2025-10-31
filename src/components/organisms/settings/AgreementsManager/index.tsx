"use client";

import React, { useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import AgreementModal from "@/components/organisms/modals/AgreementModal";
import ConfirmationModal from "@/components/organisms/modals/ConfirmationModal";
import { AgreementItem } from "@/types/settings";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Chip,
  List,
  ListItem,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import AppleSwitch from "@/components/atoms/AppleSwitch";

const Container = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const OptionItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "isDragging",
})<{ isDragging?: boolean }>(({ theme, isDragging }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backgroundColor: isDragging
    ? theme.palette.action.hover
    : theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  cursor: "move",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DragHandle = styled(DragIndicatorIcon)(({ theme }) => ({
  color: theme.palette.text.secondary,
  cursor: "grab",
  "&:active": {
    cursor: "grabbing",
  },
}));

const LabelSection = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

const LabelRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

const LangBadge = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  minWidth: 24,
}));

const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  color: theme.palette.text.primary,
}));

const ActionsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const SwitchLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  minWidth: 60,
}));

const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
}));

interface AgreementsManagerProps {
  agreements: AgreementItem[];
  onChange: (agreements: AgreementItem[]) => void;
}

const AgreementsManager: React.FC<AgreementsManagerProps> = ({
  agreements,
  onChange,
}) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] =
    useState<AgreementItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [agreementToDelete, setAgreementToDelete] = useState<string | null>(
    null,
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(agreements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    onChange(updatedItems);
  };

  const handleToggleEnabled = (id: string) => {
    const updated = agreements.map((agreement) =>
      agreement.id === id
        ? { ...agreement, enabled: !agreement.enabled }
        : agreement,
    );
    onChange(updated);
  };

  const handleAdd = () => {
    setEditingAgreement(null);
    setModalOpen(true);
  };

  const handleEdit = (agreement: AgreementItem) => {
    setEditingAgreement(agreement);
    setModalOpen(true);
  };

  const handleSave = (agreement: AgreementItem) => {
    if (editingAgreement) {
      // Edit existing
      const updated = agreements.map((a) =>
        a.id === editingAgreement.id ? agreement : a,
      );
      onChange(updated);
    } else {
      // Add new
      const newAgreement = {
        ...agreement,
        order: agreements.length,
      };
      onChange([...agreements, newAgreement]);
    }
  };

  const handleDeleteClick = (id: string) => {
    setAgreementToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!agreementToDelete) return;

    const updated = agreements.filter((a) => a.id !== agreementToDelete);
    // Reorder after deletion
    const reordered = updated.map((item, i) => ({ ...item, order: i }));
    onChange(reordered);

    setDeleteConfirmOpen(false);
    setAgreementToDelete(null);
  };

  const existingKeys = agreements.map((a) => a.key);

  return (
    <Container>
      <Header>
        <Title>{t("settings.agreements.title")}</Title>
        <GeneralButton
          label={t("settings.agreements.addAgreement")}
          startIcon={<AddIcon />}
          onAction={handleAdd}
          isPrimary={true}
        />
      </Header>

      {agreements.length === 0 ? (
        <EmptyState>
          <Typography variant="body2" color="text.secondary">
            {t("settings.agreements.noAgreements")}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            {t("settings.agreements.clickAddToStart")}
          </Typography>
        </EmptyState>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="agreements-list">
            {(provided) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ padding: 0 }}
              >
                {agreements.map((agreement, index) => (
                  <Draggable
                    key={agreement.id}
                    draggableId={agreement.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <OptionItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                      >
                        <DragHandle />

                        <LabelSection>
                          <LabelRow>
                            <LangBadge>EN:</LangBadge>
                            <LabelText>{agreement.labels.en}</LabelText>
                            {agreement.required && (
                              <Chip
                                label={t("settings.agreements.required")}
                                size="small"
                                color="error"
                                sx={{ height: 20, fontSize: "0.7rem" }}
                              />
                            )}
                          </LabelRow>
                          <LabelRow>
                            <LangBadge>DE:</LangBadge>
                            <LabelText>{agreement.labels.de}</LabelText>
                          </LabelRow>
                        </LabelSection>

                        <ActionsSection>
                          <Box display="flex" alignItems="center" gap={1}>
                            <SwitchLabel>{t("general.Active")}</SwitchLabel>
                            <AppleSwitch
                              checked={agreement.enabled}
                              onChange={() => handleToggleEnabled(agreement.id)}
                            />
                          </Box>

                          <SmallIconButton
                            icon={<EditIcon />}
                            onAction={() => handleEdit(agreement)}
                            title={t("general.Edit")}
                            placement="top"
                          />

                          <SmallIconButton
                            icon={<DeleteIcon />}
                            onAction={() => handleDeleteClick(agreement.id)}
                            title={t("general.Delete")}
                            placement="top"
                            customColor="#d32f2f"
                          />
                        </ActionsSection>
                      </OptionItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Agreement Modal */}
      <AgreementModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAgreement(null);
        }}
        onSave={handleSave}
        agreement={editingAgreement}
        existingKeys={existingKeys}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirmation={handleDeleteConfirm}
        title={t("settings.agreements.deleteConfirm")}
        message={t("settings.agreements.deleteWarning")}
      />
    </Container>
  );
};

export default AgreementsManager;
