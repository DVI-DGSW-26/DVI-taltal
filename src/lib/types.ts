import type { components } from "@/lib/api-types";

type Schemas = components["schemas"];

export type PeriodType = Schemas["PeriodType"];
export type AttachmentStatus = Schemas["AttachmentStatus"];
export type Region = Schemas["Region"];

export type Attachment = Schemas["AttachmentResponse"];
export type Program = Schemas["ProgramResponse"];
export type ProgramPage = Schemas["ProgramPage"];
export type Category = Schemas["CategoryResponse"];
export type CategoryCreate = Schemas["CategoryCreate"];
export type CategoryUpdate = Schemas["CategoryUpdate"];
export type BlacklistEntry = Schemas["BlacklistEntryResponse"];

export interface CrawlStatus {
  running: boolean;
  started_at: string | null;
  finished_at: string | null;
  last_result: {
    collected: number;
    deleted: number;
    retried_attachments: number;
    blocked_by_blacklist: number;
    skipped_closed: number;
    blacklist_expired: number;
    already_running: number;
  } | null;
  database_count: number;
}

export interface ProgramQuery {
  q: string;
  categories: string[];
  regions: string[];
  period_start?: string;
  period_end?: string;
  favorite?: boolean;
  similar: boolean;
  page: number;
  size: number;
}
