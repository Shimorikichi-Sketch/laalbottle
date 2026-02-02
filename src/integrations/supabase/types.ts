export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_type: Database["public"]["Enums"]["service_type"]
          check_in_latitude: number | null
          check_in_longitude: number | null
          check_in_time: string | null
          completed_at: string | null
          created_at: string
          estimated_wait_minutes: number | null
          id: string
          institution_id: string
          notes: string | null
          queue_number: number | null
          scheduled_date: string | null
          scheduled_time: string | null
          service_id: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_type: Database["public"]["Enums"]["service_type"]
          check_in_latitude?: number | null
          check_in_longitude?: number | null
          check_in_time?: string | null
          completed_at?: string | null
          created_at?: string
          estimated_wait_minutes?: number | null
          id?: string
          institution_id: string
          notes?: string | null
          queue_number?: number | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          service_id: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_type?: Database["public"]["Enums"]["service_type"]
          check_in_latitude?: number | null
          check_in_longitude?: number | null
          check_in_time?: string | null
          completed_at?: string | null
          created_at?: string
          estimated_wait_minutes?: number | null
          id?: string
          institution_id?: string
          notes?: string | null
          queue_number?: number | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          service_id?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          address: string
          average_wait_time_minutes: number | null
          city: string
          closing_time: string
          country: string
          cover_image_url: string | null
          created_at: string
          current_queue_size: number | null
          description: string | null
          email: string | null
          geofence_radius_meters: number
          id: string
          institution_type: Database["public"]["Enums"]["institution_type"]
          is_active: boolean
          latitude: number
          logo_url: string | null
          longitude: number
          name: string
          opening_time: string
          owner_id: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string
          website: string | null
          working_days: string[] | null
        }
        Insert: {
          address: string
          average_wait_time_minutes?: number | null
          city: string
          closing_time?: string
          country?: string
          cover_image_url?: string | null
          created_at?: string
          current_queue_size?: number | null
          description?: string | null
          email?: string | null
          geofence_radius_meters?: number
          id?: string
          institution_type?: Database["public"]["Enums"]["institution_type"]
          is_active?: boolean
          latitude: number
          logo_url?: string | null
          longitude: number
          name: string
          opening_time?: string
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          website?: string | null
          working_days?: string[] | null
        }
        Update: {
          address?: string
          average_wait_time_minutes?: number | null
          city?: string
          closing_time?: string
          country?: string
          cover_image_url?: string | null
          created_at?: string
          current_queue_size?: number | null
          description?: string | null
          email?: string | null
          geofence_radius_meters?: number
          id?: string
          institution_type?: Database["public"]["Enums"]["institution_type"]
          is_active?: boolean
          latitude?: number
          logo_url?: string | null
          longitude?: number
          name?: string
          opening_time?: string
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          website?: string | null
          working_days?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_latitude: number | null
          current_longitude: number | null
          full_name: string | null
          id: string
          location_updated_at: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          full_name?: string | null
          id?: string
          location_updated_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          full_name?: string | null
          id?: string
          location_updated_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string
          id: string
          institution_id: string
          rating: number
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          institution_id: string
          rating: number
          user_id: string
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          institution_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          current_queue_position: number | null
          description: string | null
          duration_minutes: number
          id: string
          institution_id: string
          is_active: boolean
          max_queue_size: number | null
          name: string
          price: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_queue_position?: number | null
          description?: string | null
          duration_minutes?: number
          id?: string
          institution_id: string
          is_active?: boolean
          max_queue_size?: number | null
          name: string
          price?: number | null
          service_type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_queue_position?: number | null
          description?: string | null
          duration_minutes?: number
          id?: string
          institution_id?: string
          is_active?: boolean
          max_queue_size?: number | null
          name?: string
          price?: number | null
          service_type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance_km: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      get_nearby_institutions: {
        Args: {
          inst_type?: Database["public"]["Enums"]["institution_type"]
          radius_km?: number
          user_lat: number
          user_lon: number
        }
        Returns: {
          address: string
          average_wait_time_minutes: number
          city: string
          closing_time: string
          current_queue_size: number
          description: string
          distance_km: number
          id: string
          institution_type: Database["public"]["Enums"]["institution_type"]
          latitude: number
          logo_url: string
          longitude: number
          name: string
          opening_time: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_within_geofence: {
        Args: { institution_id: string; user_lat: number; user_lon: number }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "institution_manager" | "customer"
      booking_status:
        | "pending"
        | "confirmed"
        | "checked_in"
        | "completed"
        | "cancelled"
        | "no_show"
      institution_type:
        | "bank"
        | "government"
        | "healthcare"
        | "retail"
        | "restaurant"
        | "salon"
        | "other"
      service_type: "queue" | "appointment" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "institution_manager", "customer"],
      booking_status: [
        "pending",
        "confirmed",
        "checked_in",
        "completed",
        "cancelled",
        "no_show",
      ],
      institution_type: [
        "bank",
        "government",
        "healthcare",
        "retail",
        "restaurant",
        "salon",
        "other",
      ],
      service_type: ["queue", "appointment", "both"],
    },
  },
} as const
