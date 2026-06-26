import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  learningRecords: number;
  expressionEntries: number;
  projectThoughts: number;
  projects: number;
};

export type DashboardUser = {
  id: string;
  email: string | null;
  displayName: string | null;
};

export type DashboardData = {
  user: DashboardUser | null;
  stats: DashboardStats;
  error: string | null;
  isAuthenticated: boolean;
};

const emptyStats: DashboardStats = {
  learningRecords: 0,
  expressionEntries: 0,
  projectThoughts: 0,
  projects: 0,
};

async function getTableCount(
  tableName: "records" | "projects",
  userId: string,
) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from(tableName)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    return {
      count: 0,
      error: error.message,
    };
  }

  return {
    count: count ?? 0,
    error: null,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return {
      user: null,
      stats: emptyStats,
      error: userError.message,
      isAuthenticated: false,
    };
  }

  if (!user) {
    return {
      user: null,
      stats: emptyStats,
      error: null,
      isAuthenticated: false,
    };
  }

  const [recordsResult, projectsResult] = await Promise.all([
    getTableCount("records", user.id),
    getTableCount("projects", user.id),
  ]);

  return {
    user: {
      id: user.id,
      email: user.email ?? null,
      displayName: user.user_metadata?.display_name ?? null,
    },
    stats: {
      learningRecords: recordsResult.count,
      expressionEntries: 0,
      projectThoughts: 0,
      projects: projectsResult.count,
    },
    error: recordsResult.error ?? projectsResult.error,
    isAuthenticated: true,
  };
}
