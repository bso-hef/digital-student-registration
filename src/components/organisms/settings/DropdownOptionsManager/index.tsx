import React, { useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import { DropdownOption } from "@/types/settings";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Checkbox,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Container = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const OptionItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "isDragging",
})<{ isDragging?: boolean }>(({ theme, isDragging }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
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

const AddOptionForm = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
}));

interface DropdownOptionsManagerProps {
  options: DropdownOption[];
  onChange: (options: DropdownOption[]) => void;
}

const DropdownOptionsManager: React.FC<DropdownOptionsManagerProps> = ({
  options,
  onChange,
}) => {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(options);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    onChange(updatedItems);
  };

  const handleToggleEnabled = (index: number) => {
    const updated = [...options];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    const updated = options.filter((_, i) => i !== index);
    // Reorder after deletion
    const reordered = updated.map((item, i) => ({ ...item, order: i }));
    onChange(reordered);
  };

  const handleEdit = (index: number) => {
    setEditingId(index);
    setEditValue(options[index].value);
    setEditLabel(options[index].label);
  };

  const handleSaveEdit = () => {
    if (editingId === null) return;

    const updated = [...options];
    updated[editingId] = {
      ...updated[editingId],
      value: editValue.trim(),
      label: editLabel.trim(),
    };
    onChange(updated);
    setEditingId(null);
    setEditValue("");
    setEditLabel("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setEditLabel("");
  };

  const handleAdd = () => {
    if (!newValue.trim() || !newLabel.trim()) return;

    const newOption: DropdownOption = {
      value: newValue.trim(),
      label: newLabel.trim(),
      enabled: true,
      order: options.length,
    };

    onChange([...options, newOption]);
    setNewValue("");
    setNewLabel("");
  };

  return (
    <Container elevation={0}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dropdown-options">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ minHeight: 50 }}
            >
              {options?.map((option, index) => (
                <Draggable
                  key={`${option.value}-${index}`}
                  draggableId={`${option.value}-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <OptionItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      isDragging={snapshot.isDragging}
                    >
                      <Box {...provided.dragHandleProps}>
                        <DragIndicatorIcon color="action" />
                      </Box>

                      <Checkbox
                        checked={option.enabled}
                        onChange={() => handleToggleEnabled(index)}
                        size="small"
                      />

                      {editingId === index ? (
                        <>
                          <TextField
                            size="small"
                            label={t(
                              "settings.onboarding.dropdownManager.value",
                            )}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            size="small"
                            label={t(
                              "settings.onboarding.dropdownManager.label",
                            )}
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            sx={{ flex: 1 }}
                          />
                          <GeneralButton
                            label={t(
                              "settings.onboarding.dropdownManager.save",
                            )}
                            onAction={handleSaveEdit}
                            isPrimary={true}
                          />
                          <GeneralButton
                            label={t(
                              "settings.onboarding.dropdownManager.cancel",
                            )}
                            onAction={handleCancelEdit}
                            isPrimary={false}
                          />
                        </>
                      ) : (
                        <>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                textDecoration: option.enabled
                                  ? "none"
                                  : "line-through",
                                color: option.enabled
                                  ? "text.primary"
                                  : "text.disabled",
                              }}
                            >
                              {option.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {t(
                                "settings.onboarding.dropdownManager.valuePrefix",
                              )}{" "}
                              {option.value}
                            </Typography>
                          </Box>
                          <SmallIconButton
                            onAction={() => handleEdit(index)}
                            icon={<EditIcon />}
                            bigIcon
                          />
                          <SmallIconButton
                            onAction={() => handleDelete(index)}
                            icon={<DeleteIcon />}
                            bigIcon
                          />
                        </>
                      )}
                    </OptionItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      <AddOptionForm>
        <TextField
          size="small"
          label={t("settings.onboarding.dropdownManager.newValue")}
          placeholder={t(
            "settings.onboarding.dropdownManager.valuePlaceholder",
          )}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          size="small"
          label={t("settings.onboarding.dropdownManager.newLabel")}
          placeholder={t(
            "settings.onboarding.dropdownManager.labelPlaceholder",
          )}
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          sx={{ flex: 1 }}
        />
        <GeneralButton
          label={t("settings.onboarding.dropdownManager.addOption")}
          onAction={handleAdd}
          disabled={!newValue.trim() || !newLabel.trim()}
        />
      </AddOptionForm>
    </Container>
  );
};

export default DropdownOptionsManager;
