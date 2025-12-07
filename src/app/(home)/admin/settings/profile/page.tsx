"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import FormikDropdown from "@/components/atoms/dropdowns/FormikDropdown";
import PasswordInput from "@/components/atoms/inputs/PasswordInput";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import EnhancedCollapse from "@/components/molecules/EnhancedCollapse";
import profileService, { ProfileData } from "@/lib/services/profileService";
import {
  validateAvatar,
  validateProfileData,
} from "@/lib/validate/profile.validate";
import { updateProfile } from "@/store/actions/authActions";
import { AppDispatch } from "@/store/store";
import {
  errorNotification,
  successNotification,
} from "@/utils/notification.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Form, Formik, FormikProps, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  overflowY: "auto",
  color: theme.palette.text.default,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  overflow: "hidden",
  overflowY: "auto",
  ...applicationScrollbar(theme),
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    gap: theme.spacing(3),
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  fontSize: "2.5rem",
  backgroundColor: theme.palette.primary.main,
  border: `3px solid ${theme.palette.border.seperator}`,
}));

const AvatarActions = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    alignItems: "flex-start",
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: "18px !important",
  lineHeight: "24px !important",
  fontWeight: 500,
  color: theme.palette.text.default,
  textAlign: "left",
  marginBottom: theme.spacing(2),
}));

const FormGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "1fr 1fr",
  },
}));

const HiddenInput = styled("input")({
  display: "none",
});

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  timezone: string;
}

// Common timezones for selection
const TIMEZONES = [
  { value: "Europe/Berlin", label: "Europe/Berlin (CET/CEST)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "Europe/Paris", label: "Europe/Paris (CET/CEST)" },
  { value: "Europe/Vienna", label: "Europe/Vienna (CET/CEST)" },
  { value: "Europe/Zurich", label: "Europe/Zurich (CET/CEST)" },
  { value: "Europe/Amsterdam", label: "Europe/Amsterdam (CET/CEST)" },
  { value: "America/New_York", label: "America/New_York (EST/EDT)" },
  { value: "America/Chicago", label: "America/Chicago (CST/CDT)" },
  { value: "America/Denver", label: "America/Denver (MST/MDT)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai (CST)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST/AEDT)" },
  { value: "UTC", label: "UTC" },
];

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
}

// Helper component to sync Formik's dirty state with parent component
const FormDirtyWatcher = ({
  onDirtyChange,
}: {
  onDirtyChange: (dirty: boolean) => void;
}) => {
  const { dirty } = useFormikContext();

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  return null;
};

const AdminProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(true);
  const [securityExpanded, setSecurityExpanded] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFormRef = useRef<FormikProps<ProfileFormValues>>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      setProfileData(response.data.data);
      setAvatar(response.data.data.avatar);
    } catch (error) {
      errorNotification(t("settings.profile.messages.updateFailed"));
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateAvatar(file);
    if (!validation.valid) {
      errorNotification(
        validation.error === "Only JPEG, PNG, GIF, and WebP images are allowed"
          ? t("settings.profile.messages.avatarTypeError")
          : t("settings.profile.messages.avatarSizeError"),
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
      setAvatarChanged(true);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarChanged(true);
  };

  const handleProfileSubmit = async (values: ProfileFormValues) => {
    try {
      setSaving(true);

      const updateData: Partial<ProfileData> = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        jobTitle: values.jobTitle,
        timezone: values.timezone,
      };

      // Include avatar if changed
      if (avatarChanged) {
        updateData.avatar = avatar;
      }

      // Dispatch Redux action which handles API call and state update
      const result = await dispatch(updateProfile(updateData));

      if (result.success) {
        // Update local state for UI consistency
        setProfileData((prev) =>
          prev
            ? {
                ...prev,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
                jobTitle: values.jobTitle,
                timezone: values.timezone,
                avatar: avatarChanged ? avatar : prev.avatar,
              }
            : null,
        );
        setAvatarChanged(false);
        setFormDirty(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (
    values: PasswordFormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    try {
      setChangingPassword(true);
      await profileService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      successNotification(t("settings.profile.messages.passwordSuccess"));
      resetForm();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      if (err.response?.data?.error === "Current password is incorrect") {
        errorNotification(t("settings.profile.messages.invalidPassword"));
      } else {
        errorNotification(t("settings.profile.messages.passwordFailed"));
      }
      console.error("Failed to change password:", error);
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = () => {
    if (!profileData) return "?";
    const first = profileData.firstName?.[0] || "";
    const last = profileData.lastName?.[0] || "";
    return (
      (first + last).toUpperCase() ||
      profileData.email?.[0]?.toUpperCase() ||
      "?"
    );
  };

  const hasProfileChanges = formDirty || avatarChanged;

  if (loading) {
    return (
      <Wrapper>
        <AdminSettingsHeader title={t("settings.profile.title")} />
        <ContentWrapper>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </ContentWrapper>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <AdminSettingsHeader
        title={t("settings.profile.title")}
        onSave={() => profileFormRef.current?.submitForm()}
        disabled={!hasProfileChanges || saving}
        onLoad={saving}
      />

      <ContentWrapper>
        {/* Section 1: Profile Data */}
        <Formik
          innerRef={profileFormRef}
          initialValues={{
            firstName: profileData?.firstName || "",
            lastName: profileData?.lastName || "",
            email: profileData?.email || "",
            phone: profileData?.phone || "",
            jobTitle: profileData?.jobTitle || "",
            timezone: profileData?.timezone || "Europe/Berlin",
          }}
          validationSchema={validateProfileData}
          onSubmit={handleProfileSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <FormDirtyWatcher onDirtyChange={setFormDirty} />
              <EnhancedCollapse
                title={t("settings.profile.personal.title")}
                subtitle={t("settings.profile.personal.subtitle")}
                expanded={profileExpanded}
                onAction={() => setProfileExpanded(!profileExpanded)}
              >
                <Box display="flex" flexDirection="column" gap={3}>
                  {/* Avatar Section */}
                  <Box>
                    <StyledTitle>
                      {t("settings.profile.avatar.title")}
                    </StyledTitle>
                    <AvatarContainer>
                      <StyledAvatar src={avatar || undefined}>
                        {!avatar && getInitials()}
                      </StyledAvatar>
                      <AvatarActions>
                        <Box display="flex" gap={1}>
                          <GeneralButton
                            label={
                              avatar
                                ? t("settings.profile.avatar.change")
                                : t("settings.profile.avatar.upload")
                            }
                            startIcon={<CameraAltRoundedIcon />}
                            onAction={() => fileInputRef.current?.click()}
                            isPrimary={false}
                          />
                          {avatar && (
                            <SmallIconButton
                              onAction={handleRemoveAvatar}
                              title={t("settings.profile.avatar.remove")}
                              placement="top"
                              icon={<DeleteRoundedIcon />}
                              hugeIcon
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {t("settings.profile.avatar.sizeLimit")}
                        </Typography>
                        <HiddenInput
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleAvatarUpload}
                        />
                      </AvatarActions>
                    </AvatarContainer>
                  </Box>

                  <Divider />

                  {/* Personal Information */}
                  <Box>
                    <StyledTitle>
                      {t("settings.profile.personal.details")}
                    </StyledTitle>
                    <FormGrid>
                      <TextField
                        name="firstName"
                        label={t("settings.profile.personal.firstName")}
                        placeholder={t(
                          "settings.profile.personal.firstNamePlaceholder",
                        )}
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        fullWidth
                        size="small"
                      />
                      <TextField
                        name="lastName"
                        label={t("settings.profile.personal.lastName")}
                        placeholder={t(
                          "settings.profile.personal.lastNamePlaceholder",
                        )}
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        fullWidth
                        size="small"
                      />
                    </FormGrid>
                  </Box>

                  <Divider />

                  {/* Email */}
                  <Box>
                    <StyledTitle>
                      {t("settings.profile.account.title")}
                    </StyledTitle>
                    <TextField
                      name="email"
                      label={t("settings.profile.account.email")}
                      placeholder={t(
                        "settings.profile.account.emailPlaceholder",
                      )}
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      fullWidth
                      size="small"
                      type="email"
                    />
                  </Box>

                  <Divider />

                  {/* Contact & Work Information */}
                  <Box>
                    <StyledTitle>
                      {t("settings.profile.contact.title")}
                    </StyledTitle>
                    <FormGrid>
                      <TextField
                        name="phone"
                        label={t("settings.profile.contact.phone")}
                        placeholder={t(
                          "settings.profile.contact.phonePlaceholder",
                        )}
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                        fullWidth
                        size="small"
                      />
                      <TextField
                        name="jobTitle"
                        label={t("settings.profile.contact.jobTitle")}
                        placeholder={t(
                          "settings.profile.contact.jobTitlePlaceholder",
                        )}
                        value={values.jobTitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.jobTitle && Boolean(errors.jobTitle)}
                        helperText={touched.jobTitle && errors.jobTitle}
                        fullWidth
                        size="small"
                      />
                    </FormGrid>
                  </Box>

                  <Divider />

                  {/* Preferences */}
                  <Box>
                    <StyledTitle>
                      {t("settings.profile.preferences.title")}
                    </StyledTitle>
                    <FormikDropdown
                      name="timezone"
                      label={t("settings.profile.preferences.timezone")}
                      options={TIMEZONES}
                      size="small"
                    />
                  </Box>
                </Box>
              </EnhancedCollapse>
            </Form>
          )}
        </Formik>

        {/* Section 2: Change Password */}
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
          }}
          onSubmit={handlePasswordSubmit}
        >
          {({ values, setFieldValue, dirty }) => (
            <Form>
              <EnhancedCollapse
                title={t("settings.profile.security.title")}
                subtitle={t("settings.profile.security.subtitle")}
                expanded={securityExpanded}
                onAction={() => setSecurityExpanded(!securityExpanded)}
              >
                <Box display="flex" flexDirection="column" gap={2}>
                  {/* Current Password */}
                  <TextField
                    name="currentPassword"
                    label={t("settings.profile.security.currentPassword")}
                    type={showCurrentPassword ? "text" : "password"}
                    value={values.currentPassword}
                    onChange={(e) =>
                      setFieldValue("currentPassword", e.target.value)
                    }
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              edge="end"
                            >
                              {showCurrentPassword ? (
                                <VisibilityOffRoundedIcon />
                              ) : (
                                <VisibilityRoundedIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  {/* New Password with PasswordInput component */}
                  <PasswordInput
                    label={t("settings.profile.security.newPassword")}
                    value={values.newPassword}
                    onChange={(e) =>
                      setFieldValue("newPassword", e.target.value)
                    }
                    showCubeIcon={true}
                    showEyeIcon={true}
                    showProgressBar={true}
                    showGuidelines={true}
                    autoComplete="new-password"
                  />

                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        !dirty ||
                        !values.currentPassword ||
                        !values.newPassword ||
                        changingPassword
                      }
                      startIcon={
                        changingPassword ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : null
                      }
                    >
                      {changingPassword
                        ? t("settings.profile.security.changingButton")
                        : t("settings.profile.security.changeButton")}
                    </Button>
                  </Box>
                </Box>
              </EnhancedCollapse>
            </Form>
          )}
        </Formik>
      </ContentWrapper>
    </Wrapper>
  );
};

export default AdminProfilePage;
