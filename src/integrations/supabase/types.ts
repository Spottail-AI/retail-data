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
      competitor_analysis: {
        Row: {
          analysis_data: Json
          competitor_id: string
          created_at: string
          id: string
          last_analyzed_at: string | null
          migrated: boolean
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_data?: Json
          competitor_id: string
          created_at?: string
          id?: string
          last_analyzed_at?: string | null
          migrated?: boolean
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_data?: Json
          competitor_id?: string
          created_at?: string
          id?: string
          last_analyzed_at?: string | null
          migrated?: boolean
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitor_analysis_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: true
            referencedRelation: "tracked_competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          currency: string
          discount_percent: number | null
          id: string
          is_on_sale: boolean | null
          notes: string | null
          price: number
          scraped_at: string
          stock_status: string | null
          tracked_price_id: string
          user_id: string
        }
        Insert: {
          currency?: string
          discount_percent?: number | null
          id?: string
          is_on_sale?: boolean | null
          notes?: string | null
          price: number
          scraped_at?: string
          stock_status?: string | null
          tracked_price_id: string
          user_id: string
        }
        Update: {
          currency?: string
          discount_percent?: number | null
          id?: string
          is_on_sale?: boolean | null
          notes?: string | null
          price?: number
          scraped_at?: string
          stock_status?: string | null
          tracked_price_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_history_tracked_price_id_fkey"
            columns: ["tracked_price_id"]
            isOneToOne: false
            referencedRelation: "tracked_prices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          country: string | null
          created_at: string
          id: string
          product_name: string
          results: Json
          results_found: number
          search_selection: string
          user_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          product_name: string
          results?: Json
          results_found?: number
          search_selection: string
          user_id: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          product_name?: string
          results?: Json
          results_found?: number
          search_selection?: string
          user_id?: string
        }
        Relationships: []
      }
      source_buyer_votes: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_buyer_votes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "source_products"
            referencedColumns: ["id"]
          },
        ]
      }
      source_community_votes: {
        Row: {
          created_at: string
          email: string
          id: string
          product_id: string
          verification_token: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          product_id: string
          verification_token?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          product_id?: string
          verification_token?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "source_community_votes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "source_products"
            referencedColumns: ["id"]
          },
        ]
      }
      source_enquiries: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          message: string | null
          product_id: string
          status: string | null
          supplier_id: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          message?: string | null
          product_id: string
          status?: string | null
          supplier_id: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          message?: string | null
          product_id?: string
          status?: string | null
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_enquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "source_products"
            referencedColumns: ["id"]
          },
        ]
      }
      source_product_views: {
        Row: {
          created_at: string
          id: string
          product_id: string
          viewer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          viewer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "source_products"
            referencedColumns: ["id"]
          },
        ]
      }
      source_products: {
        Row: {
          available_skus: number | null
          category: string | null
          contact_email: string | null
          contact_preference: string | null
          contact_whatsapp: string | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          is_trending: boolean | null
          is_verified: boolean | null
          launched_at: string | null
          lead_time: string | null
          moq: number | null
          product_images: Json | null
          product_name: string
          shipping_countries: Json | null
          slug: string
          tagline: string | null
          updated_at: string
          user_id: string
          wholesale_price_max: number | null
          wholesale_price_min: number | null
        }
        Insert: {
          available_skus?: number | null
          category?: string | null
          contact_email?: string | null
          contact_preference?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_trending?: boolean | null
          is_verified?: boolean | null
          launched_at?: string | null
          lead_time?: string | null
          moq?: number | null
          product_images?: Json | null
          product_name: string
          shipping_countries?: Json | null
          slug: string
          tagline?: string | null
          updated_at?: string
          user_id: string
          wholesale_price_max?: number | null
          wholesale_price_min?: number | null
        }
        Update: {
          available_skus?: number | null
          category?: string | null
          contact_email?: string | null
          contact_preference?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_trending?: boolean | null
          is_verified?: boolean | null
          launched_at?: string | null
          lead_time?: string | null
          moq?: number | null
          product_images?: Json | null
          product_name?: string
          shipping_countries?: Json | null
          slug?: string
          tagline?: string | null
          updated_at?: string
          user_id?: string
          wholesale_price_max?: number | null
          wholesale_price_min?: number | null
        }
        Relationships: []
      }
      source_shortlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_shortlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "source_products"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          average_price: number | null
          contact_email: string | null
          created_at: string
          id: string
          location: string | null
          moq: number | null
          product_category: string | null
          region: string | null
          reliability_score: number | null
          supplier_name: string
          user_id: string
        }
        Insert: {
          average_price?: number | null
          contact_email?: string | null
          created_at?: string
          id?: string
          location?: string | null
          moq?: number | null
          product_category?: string | null
          region?: string | null
          reliability_score?: number | null
          supplier_name: string
          user_id: string
        }
        Update: {
          average_price?: number | null
          contact_email?: string | null
          created_at?: string
          id?: string
          location?: string | null
          moq?: number | null
          product_category?: string | null
          region?: string | null
          reliability_score?: number | null
          supplier_name?: string
          user_id?: string
        }
        Relationships: []
      }
      tracked_competitors: {
        Row: {
          category: string | null
          competitor_name: string
          created_at: string
          id: string
          last_checked: string | null
          last_price_change: number | null
          pricing_position: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          category?: string | null
          competitor_name: string
          created_at?: string
          id?: string
          last_checked?: string | null
          last_price_change?: number | null
          pricing_position?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          category?: string | null
          competitor_name?: string
          created_at?: string
          id?: string
          last_checked?: string | null
          last_price_change?: number | null
          pricing_position?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      tracked_prices: {
        Row: {
          created_at: string
          currency: string | null
          error_count: number
          id: string
          last_checked: string | null
          last_error: string | null
          product_label: string
          product_name: string | null
          status: string
          tracking_type: string
          update_frequency: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          error_count?: number
          id?: string
          last_checked?: string | null
          last_error?: string | null
          product_label: string
          product_name?: string | null
          status?: string
          tracking_type?: string
          update_frequency?: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          error_count?: number
          id?: string
          last_checked?: string | null
          last_error?: string | null
          product_label?: string
          product_name?: string | null
          status?: string
          tracking_type?: string
          update_frequency?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tracked_products: {
        Row: {
          category: string | null
          created_at: string
          currency: string | null
          current_price: number | null
          id: string
          last_updated: string | null
          previous_price: number | null
          price_change_pct: number | null
          product_name: string
          region: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          currency?: string | null
          current_price?: number | null
          id?: string
          last_updated?: string | null
          previous_price?: number | null
          price_change_pct?: number | null
          product_name: string
          region?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          currency?: string | null
          current_price?: number | null
          id?: string
          last_updated?: string | null
          previous_price?: number | null
          price_change_pct?: number | null
          product_name?: string
          region?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trend_results: {
        Row: {
          category: string
          created_at: string
          id: string
          results: Json
          session_id: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          results: Json
          session_id: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          results?: Json
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          country: string | null
          created_at: string
          id: string
          onboarding_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          onboarding_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          onboarding_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          additional_info: string | null
          business_registration: string | null
          company_name: string
          created_at: string
          id: string
          product_id: string
          reviewed_at: string | null
          status: string
          user_id: string
          website_url: string
        }
        Insert: {
          additional_info?: string | null
          business_registration?: string | null
          company_name: string
          created_at?: string
          id?: string
          product_id: string
          reviewed_at?: string | null
          status?: string
          user_id: string
          website_url: string
        }
        Update: {
          additional_info?: string | null
          business_registration?: string | null
          company_name?: string
          created_at?: string
          id?: string
          product_id?: string
          reviewed_at?: string | null
          status?: string
          user_id?: string
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "source_products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_community_vote_count: {
        Args: { p_product_id: string }
        Returns: number
      }
      get_community_vote_counts: {
        Args: { p_product_ids: string[] }
        Returns: {
          product_id: string
          vote_count: number
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_paid: { Args: { p_user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "supplier" | "buyer" | "admin"
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
      app_role: ["supplier", "buyer", "admin"],
    },
  },
} as const
