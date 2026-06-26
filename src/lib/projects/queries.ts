import { createClient } from "@/lib/supabase/server";
import type { ProjectCardInput, ProjectRecord } from "@/types/project";

type ProjectRow = {
  id: string;
  user_id: string;
  source_record_id: string;
  name: string;
  description: string;
  target_user: string;
  pain_point: string;
  mvp_scope: string[] | null;
  tech_stack: string[] | null;
  status: string;
  created_at: string;
  updated_at?: string | null;
  prd_markdown?: string | null;
};

type SaveProjectInput = {
  userId: string;
  sourceRecordId: string;
  project: ProjectCardInput;
};

type SaveProjectResult = {
  project: ProjectRecord | null;
  error: string | null;
};

type ProjectListResult = {
  projects: ProjectRecord[];
  error: string | null;
  isAuthenticated: boolean;
};

type ProjectDetailResult = {
  project: ProjectRecord | null;
  error: string | null;
  isAuthenticated: boolean;
};

type UpdateProjectPrdInput = {
  projectId: string;
  userId: string;
  prdMarkdown: string;
};

type UpdateProjectPrdResult = {
  project: ProjectRecord | null;
  error: string | null;
};

type SourceProjectResult = {
  project: ProjectRecord | null;
  error: string | null;
};

function toProjectRecord(row: ProjectRow): ProjectRecord {
  return {
    id: row.id,
    user_id: row.user_id,
    source_record_id: row.source_record_id,
    name: row.name,
    description: row.description,
    target_user: row.target_user,
    pain_point: row.pain_point,
    mvp_scope: row.mvp_scope ?? [],
    tech_stack: row.tech_stack ?? [],
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    prd_markdown: row.prd_markdown,
  };
}

export async function saveProjectCard({
  userId,
  sourceRecordId,
  project,
}: SaveProjectInput): Promise<SaveProjectResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      source_record_id: sourceRecordId,
      name: project.name,
      description: project.description,
      target_user: project.target_user,
      pain_point: project.pain_point,
      mvp_scope: project.mvp_scope,
      tech_stack: project.tech_stack,
      status: "idea",
    })
    .select(
      "id,user_id,source_record_id,name,description,target_user,pain_point,mvp_scope,tech_stack,status,created_at",
    )
    .single();

  if (error) {
    return {
      project: null,
      error: error.message,
    };
  }

  return {
    project: toProjectRecord(data as ProjectRow),
    error: null,
  };
}

export async function getProjectBySourceRecord({
  userId,
  sourceRecordId,
}: {
  userId: string;
  sourceRecordId: string;
}): Promise<SourceProjectResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id,user_id,source_record_id,name,description,target_user,pain_point,mvp_scope,tech_stack,status,created_at,updated_at,prd_markdown",
    )
    .eq("user_id", userId)
    .eq("source_record_id", sourceRecordId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return {
      project: null,
      error: error.message,
    };
  }

  return {
    project: data ? toProjectRecord(data as ProjectRow) : null,
    error: null,
  };
}

export async function getCurrentUserProjects(): Promise<ProjectListResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return {
      projects: [],
      error: userError.message,
      isAuthenticated: false,
    };
  }

  if (!user) {
    return {
      projects: [],
      error: null,
      isAuthenticated: false,
    };
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id,user_id,source_record_id,name,description,target_user,pain_point,mvp_scope,tech_stack,status,created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      projects: [],
      error: error.message,
      isAuthenticated: true,
    };
  }

  return {
    projects: ((data ?? []) as ProjectRow[]).map(toProjectRecord),
    error: null,
    isAuthenticated: true,
  };
}

export async function getCurrentUserProjectById(
  id: string,
): Promise<ProjectDetailResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return {
      project: null,
      error: userError.message,
      isAuthenticated: false,
    };
  }

  if (!user) {
    return {
      project: null,
      error: null,
      isAuthenticated: false,
    };
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id,user_id,source_record_id,name,description,target_user,pain_point,mvp_scope,tech_stack,status,created_at,updated_at,prd_markdown",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return {
      project: null,
      error: error.message,
      isAuthenticated: true,
    };
  }

  return {
    project: data ? toProjectRecord(data as ProjectRow) : null,
    error: null,
    isAuthenticated: true,
  };
}

export async function updateProjectPrd({
  projectId,
  userId,
  prdMarkdown,
}: UpdateProjectPrdInput): Promise<UpdateProjectPrdResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update({
      prd_markdown: prdMarkdown,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .eq("user_id", userId)
    .select(
      "id,user_id,source_record_id,name,description,target_user,pain_point,mvp_scope,tech_stack,status,created_at,updated_at,prd_markdown",
    )
    .maybeSingle();

  if (error) {
    return {
      project: null,
      error: error.message,
    };
  }

  if (!data) {
    return {
      project: null,
      error: "项目不存在，或不属于当前登录用户。",
    };
  }

  return {
    project: toProjectRecord(data as ProjectRow),
    error: null,
  };
}
