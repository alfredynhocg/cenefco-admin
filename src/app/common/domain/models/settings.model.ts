export interface GeneralSettings {
  site_name: string;
  site_active: boolean;
  contact_email: string;
  items_per_page: number;
  maintenance_mode: boolean;
  site_logo?: string | null;
}

export interface UpdateSettingsRequest {
  site_name?: string;
  site_active?: boolean;
  contact_email?: string;
  items_per_page?: number;
  maintenance_mode?: boolean;
  site_logo?: File | null;
}

export interface SettingsResponse {
  message?: string;
  settings?: GeneralSettings;
}
