import http from "./api";

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  phone: string;
  jobTitle: string;
  timezone: string;
}

export interface ProfileResponse {
  success: boolean;
  data: ProfileData;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

const profileService = {
  /**
   * Fetches the current user's profile
   */
  getProfile: () => {
    return http.get<ProfileResponse>("/api/auth/profile");
  },

  /**
   * Updates the current user's profile
   */
  updateProfile: (data: Partial<ProfileData>) => {
    return http.patch<ProfileResponse>("/api/auth/profile", data);
  },

  /**
   * Changes the current user's password
   */
  changePassword: (data: ChangePasswordData) => {
    return http.post<ChangePasswordResponse>(
      "/api/auth/profile/password",
      data,
    );
  },
};

export default profileService;
