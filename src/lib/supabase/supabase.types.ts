import type {
  collections,
  comments,
  customers,
  collaborators,
  products,
  documents,
  events,
  notifications,
  policies,
  prices,
  shares,
  stars,
  subscriptions,
  users,
  workspaces,
  tags,
} from "@/lib/supabase/schema";
import type { InferSelectModel } from "drizzle-orm";
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      collaborators: {
        Row: {
          created_at: string;
          id: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collaborators_workspace_id_workspaces_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      collections: {
        Row: {
          banner_url: string | null;
          color: string | null;
          created_at: string;
          created_by_id: string | null;
          description: string | null;
          document_structure: Json | null;
          icon: string | null;
          id: string;
          import_id: string | null;
          in_trash: string | null;
          index: string | null;
          maintainer_approval_required: boolean | null;
          name: string;
          permission: string | null;
          sharing: boolean | null;
          url_id: string | null;
          workspace_id: string;
        };
        Insert: {
          banner_url?: string | null;
          color?: string | null;
          created_at?: string;
          created_by_id?: string | null;
          description?: string | null;
          document_structure?: Json | null;
          icon?: string | null;
          id?: string;
          import_id?: string | null;
          in_trash?: string | null;
          index?: string | null;
          maintainer_approval_required?: boolean | null;
          name: string;
          permission?: string | null;
          sharing?: boolean | null;
          url_id?: string | null;
          workspace_id: string;
        };
        Update: {
          banner_url?: string | null;
          color?: string | null;
          created_at?: string;
          created_by_id?: string | null;
          description?: string | null;
          document_structure?: Json | null;
          icon?: string | null;
          id?: string;
          import_id?: string | null;
          in_trash?: string | null;
          index?: string | null;
          maintainer_approval_required?: boolean | null;
          name?: string;
          permission?: string | null;
          sharing?: boolean | null;
          url_id?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collections_workspace_id_workspaces_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      comments: {
        Row: {
          content: Json;
          created_at: string;
          created_by_id: string;
          document_id: string;
          id: string;
          resolved_by_id: string | null;
        };
        Insert: {
          content: Json;
          created_at?: string;
          created_by_id: string;
          document_id: string;
          id?: string;
          resolved_by_id?: string | null;
        };
        Update: {
          content?: Json;
          created_at?: string;
          created_by_id?: string;
          document_id?: string;
          id?: string;
          resolved_by_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "comments_created_by_id_users_id_fk";
            columns: ["created_by_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_document_id_collections_id_fk";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_resolved_by_id_users_id_fk";
            columns: ["resolved_by_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      customers: {
        Row: {
          id: string;
          stripe_customer_id: string | null;
        };
        Insert: {
          id: string;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      documents: {
        Row: {
          archived_at: string | null;
          banner_url: string | null;
          collaborator_ids: string[] | null;
          collection_id: string | null;
          content: Json | null;
          created_at: string;
          created_by_id: string;
          data: string | null;
          emoji: string | null;
          fullwidth: boolean | null;
          id: string;
          in_trash: string | null;
          last_modified_by_id: string | null;
          parent_document_id: string | null;
          published_at: string | null;
          source_metadata: Json | null;
          summary: string | null;
          template: boolean | null;
          text: string | null;
          title: string;
          workspace_id: string;
        };
        Insert: {
          archived_at?: string | null;
          banner_url?: string | null;
          collaborator_ids?: string[] | null;
          collection_id?: string | null;
          content?: Json | null;
          created_at?: string;
          created_by_id: string;
          data?: string | null;
          emoji?: string | null;
          fullwidth?: boolean | null;
          id?: string;
          in_trash?: string | null;
          last_modified_by_id?: string | null;
          parent_document_id?: string | null;
          published_at?: string | null;
          source_metadata?: Json | null;
          summary?: string | null;
          template?: boolean | null;
          text?: string | null;
          title: string;
          workspace_id: string;
        };
        Update: {
          archived_at?: string | null;
          banner_url?: string | null;
          collaborator_ids?: string[] | null;
          collection_id?: string | null;
          content?: Json | null;
          created_at?: string;
          created_by_id?: string;
          data?: string | null;
          emoji?: string | null;
          fullwidth?: boolean | null;
          id?: string;
          in_trash?: string | null;
          last_modified_by_id?: string | null;
          parent_document_id?: string | null;
          published_at?: string | null;
          source_metadata?: Json | null;
          summary?: string | null;
          template?: boolean | null;
          text?: string | null;
          title?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_created_by_id_users_id_fk";
            columns: ["created_by_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_last_modified_by_id_users_id_fk";
            columns: ["last_modified_by_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_workspace_id_workspaces_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      events: {
        Row: {
          actor_id: string | null;
          changes: Json | null;
          created_at: string;
          data: Json | null;
          document_id: string | null;
          id: string;
          ip: string | null;
          model_id: string;
          name: string;
          type: string;
          user_id: string | null;
          workspace_id: string | null;
        };
        Insert: {
          actor_id?: string | null;
          changes?: Json | null;
          created_at?: string;
          data?: Json | null;
          document_id?: string | null;
          id?: string;
          ip?: string | null;
          model_id: string;
          name: string;
          type: string;
          user_id?: string | null;
          workspace_id?: string | null;
        };
        Update: {
          actor_id?: string | null;
          changes?: Json | null;
          created_at?: string;
          data?: Json | null;
          document_id?: string | null;
          id?: string;
          ip?: string | null;
          model_id?: string;
          name?: string;
          type?: string;
          user_id?: string | null;
          workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_actor_id_users_id_fk";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_document_id_documents_id_fk";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_user_id_users_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_workspace_id_workspaces_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      file_operations: {
        Row: {
          collection_id: string | null;
          created_at: string;
          data: Json | null;
          document_id: string | null;
          error: string | null;
          format: string | null;
          id: string;
          size: number | null;
          state: string;
          type: string | null;
          user_id: string | null;
        };
        Insert: {
          collection_id?: string | null;
          created_at?: string;
          data?: Json | null;
          document_id?: string | null;
          error?: string | null;
          format?: string | null;
          id?: string;
          size?: number | null;
          state: string;
          type?: string | null;
          user_id?: string | null;
        };
        Update: {
          collection_id?: string | null;
          created_at?: string;
          data?: Json | null;
          document_id?: string | null;
          error?: string | null;
          format?: string | null;
          id?: string;
          size?: number | null;
          state?: string;
          type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "file_operations_collection_id_collections_id_fk";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "file_operations_document_id_documents_id_fk";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "file_operations_user_id_users_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          actor_id: string | null;
          archived_at: string | null;
          collection_id: string | null;
          comment_id: string | null;
          created_at: string;
          data: Json | null;
          document_id: string | null;
          event: Database["public"]["Enums"]["notification_event_type"] | null;
          id: string;
          read_at: string | null;
          type: string;
          user_id: string | null;
        };
        Insert: {
          actor_id?: string | null;
          archived_at?: string | null;
          collection_id?: string | null;
          comment_id?: string | null;
          created_at?: string;
          data?: Json | null;
          document_id?: string | null;
          event?: Database["public"]["Enums"]["notification_event_type"] | null;
          id?: string;
          read_at?: string | null;
          type: string;
          user_id?: string | null;
        };
        Update: {
          actor_id?: string | null;
          archived_at?: string | null;
          collection_id?: string | null;
          comment_id?: string | null;
          created_at?: string;
          data?: Json | null;
          document_id?: string | null;
          event?: Database["public"]["Enums"]["notification_event_type"] | null;
          id?: string;
          read_at?: string | null;
          type?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_users_id_fk";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_collection_id_collections_id_fk";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_comment_id_comments_id_fk";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_document_id_documents_id_fk";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_user_id_users_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      policies: {
        Row: {
          abilities: Json;
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          abilities: Json;
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          abilities?: Json;
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "policies_workspace_id_workspaces_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      prices: {
        Row: {
          active: boolean | null;
          currency: string | null;
          description: string | null;
          id: string;
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null;
          interval_count: number | null;
          metadata: Json | null;
          product_id: string | null;
          trial_period_days: number | null;
          type: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id: string;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prices_product_id_products_id_fk";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Relationships: [];
      };
      shares: {
        Row: {
          created_at: string;
          document_id: string;
          document_title: string | null;
          document_url: string | null;
          domain: string | null;
          id: string;
          include_child_documents: boolean | null;
          is_published: boolean | null;
          last_access_at: string | null;
          url: string | null;
          url_id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          document_id: string;
          document_title?: string | null;
          document_url?: string | null;
          domain?: string | null;
          id?: string;
          include_child_documents?: boolean | null;
          is_published?: boolean | null;
          last_access_at?: string | null;
          url?: string | null;
          url_id: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          document_id?: string;
          document_title?: string | null;
          document_url?: string | null;
          domain?: string | null;
          id?: string;
          include_child_documents?: boolean | null;
          is_published?: boolean | null;
          last_access_at?: string | null;
          url?: string | null;
          url_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shares_document_id_documents_id_fk";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shares_user_id_users_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      stars: {
        Row: {
          created_at: string;
          document_id: string | null;
          id: string;
          index: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          document_id?: string | null;
          id?: string;
          index?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          document_id?: string | null;
          id?: string;
          index?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "stars_document_id_documents_id_fk";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stars_user_id_users_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created: string | null;
          current_period_end: string | null;
          current_period_start: string | null;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          price_id: string | null;
          quantity: number | null;
          status: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end: string | null;
          trial_start: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          ended_at?: string | null;
          id: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey";
            columns: ["price_id"];
            isOneToOne: false;
            referencedRelation: "prices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_price_id_prices_id_fk";
            columns: ["price_id"];
            isOneToOne: false;
            referencedRelation: "prices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      tags: {
        Row: {
          color: string | null;
          created_at: string;
          id: string;
          name: string;
          workspace_id: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          id?: string;
          name: string;
          workspace_id: string;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tags_workspace_id_workspaces_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      tags_to_documents: {
        Row: {
          document_id: string;
          tag_id: string;
        };
        Insert: {
          document_id: string;
          tag_id: string;
        };
        Update: {
          document_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tags_to_documents_document_id_documents_id_fk";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tags_to_documents_tag_id_tags_id_fk";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      user_permissions: {
        Row: {
          created_at: string;
          id: string;
          permission: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          permission: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          permission?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_users_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_permissions_workspace_id_workspaces_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          billing_address: Json | null;
          email: string | null;
          full_name: string | null;
          id: string;
          payment_method: Json | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          payment_method?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          payment_method?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      workspaces: {
        Row: {
          banner_url: string | null;
          created_at: string;
          data: string | null;
          icon_id: string;
          id: string;
          in_trash: string | null;
          logo: string | null;
          title: string;
          workspace_owner: string;
        };
        Insert: {
          banner_url?: string | null;
          created_at?: string;
          data?: string | null;
          icon_id: string;
          id?: string;
          in_trash?: string | null;
          logo?: string | null;
          title: string;
          workspace_owner: string;
        };
        Update: {
          banner_url?: string | null;
          created_at?: string;
          data?: string | null;
          icon_id?: string;
          id?: string;
          in_trash?: string | null;
          logo?: string | null;
          title?: string;
          workspace_owner?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      aal_level: "aal1" | "aal2" | "aal3";
      action: "INSERT" | "UPDATE" | "DELETE" | "TRUNCATE" | "ERROR";
      activity_event:
        | "collections.create"
        | "collections.delete"
        | "collections.move"
        | "collections.permission_changed"
        | "collections.add_user"
        | "collections.remove_user"
        | "documents.publish"
        | "documents.unpublish"
        | "documents.archive"
        | "documents.unarchive"
        | "documents.move"
        | "documents.delete"
        | "documents.permanent_delete"
        | "documents.restore"
        | "documents.add_user"
        | "documents.remove_user"
        | "revisions.create"
        | "users.create"
        | "users.demote"
        | "userMemberships.update";
      audit_event:
        | "api_keys.create"
        | "api_keys.delete"
        | "authenticationProviders.update"
        | "collections.create"
        | "collections.update"
        | "collections.permission_changed"
        | "collections.move"
        | "collections.add_user"
        | "collections.remove_user"
        | "collections.add_group"
        | "collections.remove_group"
        | "collections.delete"
        | "documents.create"
        | "documents.publish"
        | "documents.update"
        | "documents.archive"
        | "documents.unarchive"
        | "documents.move"
        | "documents.delete"
        | "documents.permanent_delete"
        | "documents.restore"
        | "documents.add_user"
        | "documents.remove_user"
        | "groups.create"
        | "groups.update"
        | "groups.delete"
        | "pins.create"
        | "pins.update"
        | "pins.delete"
        | "revisions.create"
        | "shares.create"
        | "shares.update"
        | "shares.revoke"
        | "teams.update"
        | "users.create"
        | "users.update"
        | "users.signin"
        | "users.signout"
        | "users.promote"
        | "users.demote"
        | "users.invite"
        | "users.suspend"
        | "users.activate"
        | "users.delete"
        | "fileOperations.create"
        | "fileOperations.delete"
        | "webhookSubscriptions.create"
        | "webhookSubscriptions.delete";
      code_challenge_method: "s256" | "plain";
      collection_permission: "read" | "read_write" | "admin";
      document_permission: "read" | "read_write";
      equality_op: "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "in";
      factor_status: "unverified" | "verified";
      factor_type: "totp" | "webauthn";
      key_status: "default" | "valid" | "invalid" | "expired";
      key_type:
        | "aead-ietf"
        | "aead-det"
        | "hmacsha512"
        | "hmacsha256"
        | "auth"
        | "shorthash"
        | "generichash"
        | "kdf"
        | "secretbox"
        | "secretstream"
        | "stream_xchacha20";
      notification_channel_type: "app" | "email" | "chat";
      notification_event_type:
        | "documents.publish"
        | "documents.update"
        | "documents.add_user"
        | "collections.add_user"
        | "revisions.create"
        | "collections.create"
        | "comments.create"
        | "documents.mentioned"
        | "comments.mentioned"
        | "emails.invite_accepted"
        | "emails.onboarding"
        | "emails.features"
        | "emails.export_completed";
      pricing_plan_interval: "day" | "week" | "month" | "year";
      pricing_type: "one_time" | "recurring";
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid";
      user_flags:
        | "inviteSent"
        | "inviteReminderSent"
        | "desktop"
        | "desktopWeb"
        | "mobileWeb";
      user_preferences:
        | "rememberLastPath"
        | "useCursorPointer"
        | "codeBlockLineNumbers"
        | "seamlessEdit"
        | "fullWidthDocuments";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type Workspace = InferSelectModel<typeof workspaces>;
export type Collection = InferSelectModel<typeof collections>;
export type Document = InferSelectModel<typeof documents>;
export type User = InferSelectModel<typeof users>;
export type Comment = InferSelectModel<typeof comments>;
export type Share = InferSelectModel<typeof shares>;
export type Star = InferSelectModel<typeof stars>;
export type Notification = InferSelectModel<typeof notifications>;
export type Subscription = InferSelectModel<typeof subscriptions>;
export type Price = InferSelectModel<typeof prices>;
export type Event = InferSelectModel<typeof events>;
export type Policy = InferSelectModel<typeof policies>;
export type Customer = InferSelectModel<typeof customers>;
export type Collaborator = InferSelectModel<typeof collaborators>;
export type Product = InferSelectModel<typeof products>;
export type Tag = InferSelectModel<typeof tags>;
export type DocumentWithTags = Document & {
  tags: Tag[] | [];
};
export type TagWithDocuments = Tag & {
  documents?: Document[];
};
export type ProductWirhPrice = Product & {
  prices?: Price[];
};
