import { createClient } from "@/lib/supabase/server";
import {
  recordTypeLabels,
  type RecordDetail,
  type RecordListItem,
  type RecordType,
} from "@/types/record";

type RecordRow = {
  id: string;
  title: string;
  content: string;
  type: string;
  tags: string[] | null;
  created_at: string;
  updated_at?: string | null;
};

type RecordsResult = {
  records: RecordListItem[];
  error: string | null;
  isAuthenticated: boolean;
  userId: string | null;
};

type RecordDetailResult = {
  record: RecordDetail | null;
  error: string | null;
  isAuthenticated: boolean;
  userId: string;
};

const recordTypes = Object.keys(recordTypeLabels) as RecordType[];

function normalizeRecordType(value: string): RecordType {
  if (recordTypes.includes(value as RecordType)) {
    return value as RecordType;
  }

  return "learning";
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function toRecordListItem(row: RecordRow): RecordListItem {
  const type = normalizeRecordType(row.type);

  return {
    id: row.id,
    title: row.title,
    content: row.content,
    type,
    typeLabel: recordTypeLabels[type],
    tags: row.tags ?? [],
    createdAt: formatDateTime(row.created_at),
  };
}

function toRecordDetail(row: RecordRow): RecordDetail {
  const listItem = toRecordListItem(row);

  return {
    ...listItem,
    updatedAt: formatDateTime(row.updated_at ?? row.created_at),
  };
}

export async function getCurrentUserRecords(): Promise<RecordsResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      records: [],
      error: "请先登录后查看记录。",
      isAuthenticated: false,
      userId: null,
    };
  }

  const { data, error } = await supabase
    .from("records")
    .select("id,title,content,type,tags,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      records: [],
      error: error.message,
      isAuthenticated: true,
      userId: user.id,
    };
  }

  return {
    records: ((data ?? []) as RecordRow[]).map(toRecordListItem),
    error: null,
    isAuthenticated: true,
    userId: user.id,
  };
}

export async function getCurrentUserRecordById(
  id: string,
): Promise<RecordDetailResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      record: null,
      error: "请先登录后查看记录。",
      isAuthenticated: false,
      userId: "",
    };
  }

  const { data, error } = await supabase
    .from("records")
    .select("id,title,content,type,tags,created_at,updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return {
      record: null,
      error: error.message,
      isAuthenticated: true,
      userId: user.id,
    };
  }

  return {
    record: data ? toRecordDetail(data as RecordRow) : null,
    error: null,
    isAuthenticated: true,
    userId: user.id,
  };
}
