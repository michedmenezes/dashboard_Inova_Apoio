import DashboardLayout, {
  type AdminNavigationItem,
} from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BarChart3,
  Check,
  ClipboardPenLine,
  FolderOpen,
  ListChecks,
  Pencil,
  Plus,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ViewKey = "overview" | "evaluate" | "projects" | "stages" | "groups";
type ScoreKey =
  | "contentMastery"
  | "prototyping"
  | "communication"
  | "socialImpact";
type Evaluation = {
  id: number;
  evaluatorName: string;
  contentMastery: number;
  prototyping: number;
  communication: number;
  socialImpact: number;
  totalScore: number;
  observations: string | null;
  createdAt: Date | string;
};
type Member = { id: number; name: string };
type Stage = {
  id: number;
  name: string;
  status: "draft" | "active" | "completed";
  groupsCount: number;
  projectsCount: number;
  evaluationsCount: number;
  averageScore: number | null;
};
type Group = {
  id: number;
  stageId: number;
  className: string;
  groupNumber: number;
  stage: Stage;
  members: Member[];
  project: Project | null;
};
type Project = {
  id: number;
  groupId: number;
  title: string;
  description: string | null;
  articleUrl: string | null;
  presentationUrl: string | null;
  status: "draft" | "in_progress" | "ready" | "presented";
  evaluations: Evaluation[];
  averageScore: number | null;
  criteriaAverage: Record<ScoreKey, number | null>;
  group: Group;
};
type GroupRankingItem = {
  groupId: number;
  className: string;
  groupNumber: number;
  stageName: string;
  projectTitle: string;
  evaluationsCount: number;
  averageScore: number | null;
};
type PlatformData = {
  stages: Stage[];
  groups: Group[];
  projects: Project[];
  rankedProjects: Project[];
  rankedGroups: GroupRankingItem[];
};

const navItems: AdminNavigationItem[] = [
  { key: "overview", label: "Visão geral", icon: BarChart3 },
  { key: "projects", label: "Projetos", icon: FolderOpen },
  { key: "evaluate", label: "Avaliar grupos", icon: ClipboardPenLine },
  { key: "groups", label: "Grupos", icon: Users },
  { key: "stages", label: "Etapas", icon: ListChecks },
];

const criteria: Array<{ key: ScoreKey; code: string; label: string }> = [
  { key: "contentMastery", code: "01", label: "Domínio de conteúdo" },
  { key: "prototyping", code: "02", label: "Prototipagem e criatividade" },
  { key: "communication", code: "03", label: "Comunicação e equipe" },
  { key: "socialImpact", code: "04", label: "Impacto social (ODS)" },
];

const emptyScores: Record<ScoreKey, number | null> = {
  contentMastery: null,
  prototyping: null,
  communication: null,
  socialImpact: null,
};

function scoreLabel(score: number | null) {
  if (score === null) return "—";
  return `${score.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}/16`;
}

function getProjectStatusLabel(status: Project["status"]) {
  return {
    draft: "Rascunho",
    in_progress: "Em andamento",
    ready: "Pronto",
    presented: "Apresentado",
  }[status];
}

function toMemberNames(value: string) {
  return value
    .split("\n")
    .map(name => name.trim())
    .filter(Boolean);
}

export default function Home() {
  const [view, setView] = useState<ViewKey>("overview");
  const [groupEditor, setGroupEditor] = useState<number | "new" | null>(null);
  const [projectEditor, setProjectEditor] = useState<number | "new" | null>(
    null
  );
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [evaluatorName, setEvaluatorName] = useState("");
  const [observations, setObservations] = useState("");
  const [scores, setScores] =
    useState<Record<ScoreKey, number | null>>(emptyScores);
  const utils = trpc.useUtils();
  const platformQuery = trpc.platform.data.useQuery();
  const auditQuery = trpc.platform.auditInitialData.useQuery();
  const data = platformQuery.data as PlatformData | undefined;

  const refresh = async (message: string) => {
    await utils.platform.data.invalidate();
    toast.success(message);
  };

  const createEvaluation = trpc.evaluations.create.useMutation({
    onSuccess: () => refresh("Avaliação registrada."),
    onError: error => toast.error(error.message),
  });
  const createGroup = trpc.groups.create.useMutation({
    onSuccess: () => {
      setGroupEditor(null);
      refresh("Grupo adicionado.");
    },
    onError: error => toast.error(error.message),
  });
  const updateGroup = trpc.groups.update.useMutation({
    onSuccess: () => {
      setGroupEditor(null);
      refresh("Grupo atualizado.");
    },
    onError: error => toast.error(error.message),
  });
  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      setProjectEditor(null);
      refresh("Projeto adicionado.");
    },
    onError: error => toast.error(error.message),
  });
  const updateProject = trpc.projects.update.useMutation({
    onSuccess: () => {
      setProjectEditor(null);
      refresh("Projeto atualizado.");
    },
    onError: error => toast.error(error.message),
  });

  const evaluatedCount = useMemo(
    () =>
      (data?.projects ?? []).filter(project => project.evaluations.length > 0)
        .length,
    [data]
  );
  const totalEvaluations = useMemo(
    () =>
      (data?.projects ?? []).reduce(
        (total, project) => total + project.evaluations.length,
        0
      ),
    [data]
  );
  const overallAverage = useMemo(() => {
    const allScores = (data?.projects ?? []).flatMap(project =>
      project.evaluations.map(evaluation => evaluation.totalScore)
    );
    if (!allScores.length) return null;
    return Number(
      (
        allScores.reduce((sum, score) => sum + score, 0) / allScores.length
      ).toFixed(1)
    );
  }, [data]);

  useEffect(() => {
    if (!selectedProjectId && data?.projects.length)
      setSelectedProjectId(data.projects[0]?.id ?? null);
  }, [data, selectedProjectId]);

  if (platformQuery.isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-white">
        <p className="text-xs font-black uppercase tracking-[0.2em]">
          Carregando plataforma
        </p>
      </div>
    );
  }

  if (platformQuery.isError || !data) {
    return (
      <div className="grid min-h-screen place-items-center bg-white p-6">
        <div className="max-w-md border-2 border-black p-6">
          <span className="mb-5 block h-5 w-5 bg-[#0b5b4b]" />
          <h1 className="text-2xl font-black tracking-[-0.06em]">
            Não foi possível carregar os dados.
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Verifique a conexão com o banco de dados e tente novamente.
          </p>
          <Button
            onClick={() => platformQuery.refetch()}
            className="mt-6 rounded-none bg-black text-[10px] font-black uppercase tracking-[0.12em] hover:bg-[#0b5b4b]"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const activeProject =
    data.projects.find(project => project.id === selectedProjectId) ??
    data.projects[0];
  const activeTotal = Object.values(scores).reduce<number>(
    (total, score) => total + (score ?? 0),
    0
  );

  return (
    <DashboardLayout
      activeKey={view}
      items={navItems}
      onNavigate={key => setView(key as ViewKey)}
      onQuickAdd={() => {
        setView("groups");
        setGroupEditor("new");
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {view === "overview" && (
          <Overview
            data={data}
            overallAverage={overallAverage}
            evaluatedCount={evaluatedCount}
            totalEvaluations={totalEvaluations}
            audit={auditQuery.data}
            onEvaluate={() => setView("evaluate")}
          />
        )}
        {view === "evaluate" && (
          <EvaluationScreen
            projects={data.projects}
            activeProject={activeProject}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            evaluatorName={evaluatorName}
            setEvaluatorName={setEvaluatorName}
            observations={observations}
            setObservations={setObservations}
            scores={scores}
            setScores={setScores}
            total={activeTotal}
            onSubmit={() => {
              if (
                !activeProject ||
                !evaluatorName.trim() ||
                Object.values(scores).some(score => score === null)
              ) {
                toast.error("Preencha o avaliador e os quatro critérios.");
                return;
              }
              createEvaluation.mutate(
                {
                  projectId: activeProject.id,
                  evaluatorName: evaluatorName.trim(),
                  contentMastery: scores.contentMastery!,
                  prototyping: scores.prototyping!,
                  communication: scores.communication!,
                  socialImpact: scores.socialImpact!,
                  observations: observations.trim() || undefined,
                },
                {
                  onSuccess: () => {
                    setObservations("");
                    setScores(emptyScores);
                  },
                }
              );
            }}
            submitting={createEvaluation.isPending}
          />
        )}
        {view === "projects" && (
          <ProjectsScreen
            projects={data.projects}
            groups={data.groups}
            editor={projectEditor}
            setEditor={setProjectEditor}
            onCreate={createProject.mutate}
            onUpdate={updateProject.mutate}
            busy={createProject.isPending || updateProject.isPending}
          />
        )}
        {view === "stages" && <StagesScreen stages={data.stages} />}
        {view === "groups" && (
          <GroupsScreen
            groups={data.groups}
            stages={data.stages}
            editor={groupEditor}
            setEditor={setGroupEditor}
            onCreate={createGroup.mutate}
            onUpdate={updateGroup.mutate}
            busy={createGroup.isPending || updateGroup.isPending}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-black pb-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#0b5b4b]">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-black leading-none tracking-[-0.06em] text-black sm:text-4xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function Metric({
  index,
  label,
  value,
  detail,
}: {
  index: string;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <article className="border-t-2 border-black pt-3">
      <p className="text-[10px] font-black tracking-[0.16em] text-[#0b5b4b]">
        {index}
      </p>
      <p className="mt-5 text-4xl font-black tracking-[-0.08em] text-black">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-[0.1em] text-black">
        {label}
      </p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </article>
  );
}

function Overview({
  data,
  overallAverage,
  evaluatedCount,
  totalEvaluations,
  audit,
  onEvaluate,
}: {
  data: PlatformData;
  overallAverage: number | null;
  evaluatedCount: number;
  totalEvaluations: number;
  audit?: {
    groups: number;
    projects: number;
    members: number;
    firstYearGroups: number;
  };
  onEvaluate: () => void;
}) {
  return (
    <>
      <SectionHeader
        eyebrow="Visão consolidada"
        title="Panorama da feira"
        action={
          <Button
            onClick={onEvaluate}
            className="h-10 rounded-none bg-[#0b5b4b] px-4 text-[11px] font-black uppercase tracking-[0.12em] hover:bg-black"
          >
            Registrar avaliação
          </Button>
        }
      />
      <section className="grid gap-x-10 gap-y-7 border-b border-black pb-8 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          index="01"
          value={data.groups.length}
          label="Grupos"
          detail="base inicial importada"
        />
        <Metric
          index="02"
          value={data.projects.length}
          label="Projetos"
          detail="vinculados aos grupos"
        />
        <Metric
          index="03"
          value={totalEvaluations}
          label="Avaliações"
          detail={`${evaluatedCount} projetos avaliados`}
        />
        <Metric
          index="04"
          value={scoreLabel(overallAverage)}
          label="Média geral"
          detail="escala máxima de 16 pontos"
        />
      </section>

      <section className="mt-9 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="grid gap-8 xl:grid-cols-2">
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.13em]">
                Ranking de grupos
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                Média
              </span>
            </div>
            {data.rankedGroups.length ? (
              <div className="border-t border-black">
                {data.rankedGroups.slice(0, 5).map((group, index) => (
                  <GroupRankingRow
                    key={group.groupId}
                    index={index + 1}
                    group={group}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="A classificação de grupos aparecerá após o primeiro registro." />
            )}
          </div>
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.13em]">
                Ranking de projetos
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                Média
              </span>
            </div>
            {data.rankedProjects.length ? (
              <div className="border-t border-black">
                {data.rankedProjects.slice(0, 5).map((project, index) => (
                  <RankingRow
                    key={project.id}
                    index={index + 1}
                    project={project}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="A classificação de projetos aparecerá após o primeiro registro." />
            )}
          </div>
        </div>
        <div className="border-t-2 border-black pt-3">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0b5b4b]">
            Etapas
          </p>
          <div className="mt-5 space-y-0 border-t border-black">
            {data.stages.map(stage => (
              <div
                key={stage.id}
                className="flex items-start justify-between gap-4 border-b border-black py-4"
              >
                <div>
                  <p className="text-sm font-black tracking-[-0.03em]">
                    {stage.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {stage.groupsCount} grupos · {stage.evaluationsCount}{" "}
                    avaliações
                  </p>
                </div>
                <span className="text-lg font-black tracking-[-0.05em]">
                  {scoreLabel(stage.averageScore)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {audit && (
        <p className="mt-7 border-t border-black pt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">
          Carga inicial validada: {audit.groups} grupos, {audit.projects}{" "}
          projetos e {audit.members} integrantes · 1ª série/Comunidade Gris:{" "}
          {audit.firstYearGroups}
        </p>
      )}
    </>
  );
}

function RankingRow({ index, project }: { index: number; project: Project }) {
  return (
    <div className="grid grid-cols-[2.2rem_1fr_auto] items-center gap-3 border-b border-black py-3">
      <span className="text-xs font-black text-[#0b5b4b]">
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <p className="text-sm font-black tracking-[-0.02em]">{project.title}</p>
        <p className="text-xs text-zinc-500">
          {project.group.className} · Grupo {project.group.groupNumber} ·{" "}
          {project.evaluations.length} avaliação(ões)
        </p>
      </div>
      <span className="text-xl font-black tracking-[-0.06em]">
        {scoreLabel(project.averageScore)}
      </span>
    </div>
  );
}

function GroupRankingRow({
  index,
  group,
}: {
  index: number;
  group: GroupRankingItem;
}) {
  return (
    <div className="grid grid-cols-[2.2rem_1fr_auto] items-center gap-3 border-b border-black py-3">
      <span className="text-xs font-black text-[#0b5b4b]">
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <p className="text-sm font-black tracking-[-0.02em]">
          {group.className} · Grupo {group.groupNumber}
        </p>
        <p className="text-xs text-zinc-500">
          {group.projectTitle} · {group.evaluationsCount} avaliação(ões)
        </p>
      </div>
      <span className="text-xl font-black tracking-[-0.06em]">
        {scoreLabel(group.averageScore)}
      </span>
    </div>
  );
}

function EvaluationScreen({
  projects,
  activeProject,
  selectedProjectId,
  setSelectedProjectId,
  evaluatorName,
  setEvaluatorName,
  observations,
  setObservations,
  scores,
  setScores,
  total,
  onSubmit,
  submitting,
}: {
  projects: Project[];
  activeProject?: Project;
  selectedProjectId: number | null;
  setSelectedProjectId: (id: number) => void;
  evaluatorName: string;
  setEvaluatorName: (value: string) => void;
  observations: string;
  setObservations: (value: string) => void;
  scores: Record<ScoreKey, number | null>;
  setScores: (value: Record<ScoreKey, number | null>) => void;
  total: number;
  onSubmit: () => void;
  submitting: boolean;
}) {
  if (!projects.length)
    return (
      <>
        <SectionHeader eyebrow="Registro de avaliação" title="Avaliar grupo" />
        <EmptyState message="Cadastre um grupo e um projeto para iniciar as avaliações." />
      </>
    );
  return (
    <>
      <SectionHeader eyebrow="Registro de avaliação" title="Avaliar grupo" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="border-t-2 border-black pt-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Projeto e grupo">
              <select
                value={selectedProjectId ?? ""}
                onChange={event =>
                  setSelectedProjectId(Number(event.target.value))
                }
                className="h-11 w-full rounded-none border border-black bg-white px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0b5b4b]"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.group.className} · G{project.group.groupNumber} —{" "}
                    {project.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Avaliador">
              <Input
                value={evaluatorName}
                onChange={event => setEvaluatorName(event.target.value)}
                placeholder="Nome do avaliador"
                className="h-11 rounded-none border-black"
              />
            </Field>
          </div>
          <div className="mt-7 space-y-0 border-t border-black">
            {criteria.map(criterion => (
              <div
                key={criterion.key}
                className="grid gap-3 border-b border-black py-5 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center bg-black text-[10px] font-black text-white">
                    {criterion.code}
                  </span>
                  <p className="text-sm font-black tracking-[-0.02em]">
                    {criterion.label}
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map(value => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={scores[criterion.key] === value}
                      onClick={() =>
                        setScores({ ...scores, [criterion.key]: value })
                      }
                      className={`h-10 w-11 border border-black text-sm font-black transition-colors ${scores[criterion.key] === value ? "bg-[#0b5b4b] text-white" : "bg-white text-black hover:bg-zinc-100"}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Field label="Observações">
            <Textarea
              value={observations}
              onChange={event => setObservations(event.target.value)}
              placeholder="Comentários relevantes sobre a apresentação, protótipo ou equipe."
              className="min-h-28 rounded-none border-black"
            />
          </Field>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-black text-[11px] font-black uppercase tracking-[0.16em] text-white transition-transform duration-150 hover:bg-[#0b5b4b] active:scale-[0.99] disabled:opacity-50"
          >
            <Check className="h-4 w-4" strokeWidth={3} />
            {submitting ? "Salvando" : "Salvar avaliação"}
          </button>
        </section>
        <aside className="border-t-2 border-black pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0b5b4b]">
            Em avaliação
          </p>
          <h3 className="mt-4 text-2xl font-black leading-[0.95] tracking-[-0.06em]">
            {activeProject?.title}
          </h3>
          <p className="mt-3 text-xs text-zinc-500">
            {activeProject?.group.className} · Grupo{" "}
            {activeProject?.group.groupNumber}
          </p>
          <div className="my-6 border-y border-black py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">
              Pontuação atual
            </p>
            <p className="mt-2 text-5xl font-black tracking-[-0.1em]">
              {total}
              <span className="ml-1 text-base tracking-normal text-zinc-500">
                /16
              </span>
            </p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">
            Integrantes
          </p>
          <p className="mt-2 text-sm leading-6">
            {activeProject?.group.members
              .map(member => member.name)
              .join(" · ")}
          </p>
        </aside>
      </div>
    </>
  );
}

function ProjectsScreen({
  projects,
  groups,
  editor,
  setEditor,
  onCreate,
  onUpdate,
  busy,
}: {
  projects: Project[];
  groups: Group[];
  editor: number | "new" | null;
  setEditor: (value: number | "new" | null) => void;
  onCreate: (input: {
    groupId: number;
    title: string;
    description?: string;
    status: Project["status"];
  }) => void;
  onUpdate: (input: {
    id: number;
    title: string;
    description?: string;
    status: Project["status"];
  }) => void;
  busy: boolean;
}) {
  const current =
    typeof editor === "number"
      ? projects.find(project => project.id === editor)
      : undefined;
  return (
    <>
      <SectionHeader
        eyebrow="Catálogo"
        title="Projetos"
        action={
          <Button
            onClick={() => setEditor("new")}
            className="h-10 rounded-none bg-black px-4 text-[11px] font-black uppercase tracking-[0.12em] hover:bg-[#0b5b4b]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar projeto
          </Button>
        }
      />
      {editor !== null && (
        <ProjectForm
          project={current}
          groups={groups}
          onCancel={() => setEditor(null)}
          onSubmit={input =>
            current ? onUpdate({ id: current.id, ...input }) : onCreate(input)
          }
          busy={busy}
        />
      )}
      <div className="mt-7 border-t border-black">
        {projects.length ? (
          projects.map(project => (
            <article
              key={project.id}
              className="grid gap-3 border-b border-black py-4 md:grid-cols-[2rem_minmax(0,1fr)_auto_auto] md:items-center"
            >
              <span className="text-xs font-black text-[#0b5b4b]">
                {String(project.group.groupNumber).padStart(2, "0")}
              </span>
              <div>
                <p className="text-base font-black tracking-[-0.035em]">
                  {project.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {project.group.className} · {project.group.stage.name} ·{" "}
                  {project.group.members.length} integrantes
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-lg font-black tracking-[-0.05em]">
                  {scoreLabel(project.averageScore)}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">
                  {project.evaluations.length} avaliação(ões)
                </p>
              </div>
              <button
                onClick={() => setEditor(project.id)}
                className="flex h-9 items-center justify-center gap-2 border border-black px-3 text-[10px] font-black uppercase tracking-[0.12em] hover:bg-black hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </button>
            </article>
          ))
        ) : (
          <EmptyState message="Nenhum projeto cadastrado nesta etapa." />
        )}
      </div>
    </>
  );
}

function ProjectForm({
  project,
  groups,
  onCancel,
  onSubmit,
  busy,
}: {
  project?: Project;
  groups: Group[];
  onCancel: () => void;
  onSubmit: (input: {
    groupId: number;
    title: string;
    description?: string;
    articleUrl?: string;
    presentationUrl?: string;
    status: Project["status"];
  }) => void;
  busy: boolean;
}) {
  const withoutProject = groups.filter(
    group => !group.project || group.project?.id === project?.id
  );
  const [groupId, setGroupId] = useState(
    project?.groupId ?? withoutProject[0]?.id ?? 0
  );
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [articleUrl, setArticleUrl] = useState(project?.articleUrl ?? "");
  const [presentationUrl, setPresentationUrl] = useState(
    project?.presentationUrl ?? ""
  );
  const [status, setStatus] = useState<Project["status"]>(
    project?.status ?? "draft"
  );
  if (!project && !withoutProject.length)
    return (
      <div className="border-2 border-black bg-zinc-50 p-5">
        <EmptyState message="Todos os grupos já possuem projetos associados." />
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 text-[10px] font-black uppercase tracking-[0.12em] underline"
        >
          Fechar
        </button>
      </div>
    );
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (!groupId || !title.trim()) {
          toast.error("Selecione um grupo e informe o título.");
          return;
        }
        onSubmit({
          groupId,
          title: title.trim(),
          description: description.trim() || undefined,
          articleUrl: articleUrl.trim() || undefined,
          presentationUrl: presentationUrl.trim() || undefined,
          status,
        });
      }}
      className="border-2 border-black bg-zinc-50 p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.14em]">
          {project ? "Editar projeto" : "Novo projeto"}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="text-[10px] font-black uppercase tracking-[0.12em] underline"
        >
          Cancelar
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Grupo">
          <select
            disabled={Boolean(project)}
            value={groupId}
            onChange={event => setGroupId(Number(event.target.value))}
            className="h-11 w-full rounded-none border border-black bg-white px-3 text-sm font-semibold disabled:opacity-60"
          >
            {withoutProject.map(group => (
              <option key={group.id} value={group.id}>
                {group.className} · Grupo {group.groupNumber}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={event =>
              setStatus(event.target.value as Project["status"])
            }
            className="h-11 w-full rounded-none border border-black bg-white px-3 text-sm font-semibold"
          >
            {(["draft", "in_progress", "ready", "presented"] as const).map(
              item => (
                <option key={item} value={item}>
                  {getProjectStatusLabel(item)}
                </option>
              )
            )}
          </select>
        </Field>
      </div>
      <Field label="Título">
        <Input
          value={title}
          onChange={event => setTitle(event.target.value)}
          className="h-11 rounded-none border-black"
        />
      </Field>
      <Field label="Descrição">
        <Textarea
          value={description}
          onChange={event => setDescription(event.target.value)}
          className="min-h-20 rounded-none border-black"
          placeholder="Escopo ou observações do projeto."
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Link do artigo">
          <Input
            type="url"
            value={articleUrl}
            onChange={event => setArticleUrl(event.target.value)}
            className="h-11 rounded-xl border-[#c9d8d1]"
            placeholder="https://..."
          />
        </Field>
        <Field label="Link da apresentação">
          <Input
            type="url"
            value={presentationUrl}
            onChange={event => setPresentationUrl(event.target.value)}
            className="h-11 rounded-xl border-[#c9d8d1]"
            placeholder="https://..."
          />
        </Field>
      </div>
      <button
        disabled={busy}
        className="mt-1 h-10 rounded-xl bg-[#0b5b4b] px-4 text-[10px] font-black uppercase tracking-[0.14em] text-white hover:bg-[#074438] disabled:opacity-50"
      >
        {busy ? "Salvando" : "Salvar projeto"}
      </button>
    </form>
  );
}

function StagesScreen({ stages }: { stages: Stage[] }) {
  return (
    <>
      <SectionHeader eyebrow="Acompanhamento" title="Etapas de avaliação" />
      {stages.length ? (
        <div className="grid gap-0 border-t border-black lg:grid-cols-3">
          {stages.map((stage, index) => (
            <article
              key={stage.id}
              className="border-b border-black py-6 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <p className="text-[10px] font-black tracking-[0.16em] text-[#0b5b4b]">
                ETAPA {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-5 text-3xl font-black tracking-[-0.07em]">
                {stage.name}
              </h3>
              <p className="mt-2 text-xs text-zinc-500">
                {stage.groupsCount} grupos · {stage.projectsCount} projetos
              </p>
              <div className="mt-8 flex items-end justify-between border-t border-black pt-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-zinc-500">
                    Média
                  </p>
                  <p className="mt-1 text-3xl font-black tracking-[-0.08em]">
                    {scoreLabel(stage.averageScore)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-zinc-500">
                    Registros
                  </p>
                  <p className="mt-1 text-3xl font-black tracking-[-0.08em]">
                    {stage.evaluationsCount}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="Nenhuma etapa cadastrada." />
      )}
    </>
  );
}

function GroupsScreen({
  groups,
  stages,
  editor,
  setEditor,
  onCreate,
  onUpdate,
  busy,
}: {
  groups: Group[];
  stages: Stage[];
  editor: number | "new" | null;
  setEditor: (value: number | "new" | null) => void;
  onCreate: (input: {
    stageId: number;
    className: string;
    groupNumber: number;
    memberNames: string[];
  }) => void;
  onUpdate: (input: {
    id: number;
    stageId: number;
    className: string;
    groupNumber: number;
    memberNames: string[];
  }) => void;
  busy: boolean;
}) {
  const current =
    typeof editor === "number"
      ? groups.find(group => group.id === editor)
      : undefined;
  return (
    <>
      <SectionHeader
        eyebrow="Cadastro"
        title="Grupos e integrantes"
        action={
          <Button
            onClick={() => setEditor("new")}
            className="h-10 rounded-none bg-black px-4 text-[11px] font-black uppercase tracking-[0.12em] hover:bg-[#0b5b4b]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar grupo
          </Button>
        }
      />
      {editor !== null && (
        <GroupForm
          group={current}
          stages={stages}
          onCancel={() => setEditor(null)}
          onSubmit={input =>
            current ? onUpdate({ id: current.id, ...input }) : onCreate(input)
          }
          busy={busy}
        />
      )}
      <div className="mt-7 grid gap-x-8 border-t border-black md:grid-cols-2">
        {groups.length ? (
          groups.map(group => (
            <article key={group.id} className="border-b border-black py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-black tracking-[-0.03em]">
                    {group.className} · Grupo {group.groupNumber}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {group.stage.name} · {group.members.length} integrantes
                  </p>
                </div>
                <button
                  onClick={() => setEditor(group.id)}
                  className="grid h-8 w-8 place-items-center border border-black hover:bg-black hover:text-white"
                  aria-label={`Editar grupo ${group.className} ${group.groupNumber}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-3 text-sm font-semibold">
                {group.project?.title ?? "Sem projeto associado"}
              </p>
              <p className="mt-2 text-xs leading-5 text-zinc-600">
                {group.members.map(member => member.name).join(" · ")}
              </p>
            </article>
          ))
        ) : (
          <EmptyState message="Nenhum grupo cadastrado." />
        )}
      </div>
    </>
  );
}

function GroupForm({
  group,
  stages,
  onCancel,
  onSubmit,
  busy,
}: {
  group?: Group;
  stages: Stage[];
  onCancel: () => void;
  onSubmit: (input: {
    stageId: number;
    className: string;
    groupNumber: number;
    memberNames: string[];
  }) => void;
  busy: boolean;
}) {
  const [stageId, setStageId] = useState(group?.stageId ?? stages[0]?.id ?? 0);
  const [className, setClassName] = useState(group?.className ?? "");
  const [groupNumber, setGroupNumber] = useState(
    String(group?.groupNumber ?? "")
  );
  const [memberList, setMemberList] = useState(
    group?.members.map(member => member.name).join("\n") ?? ""
  );
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        const groupNumberValue = Number(groupNumber);
        const memberNames = toMemberNames(memberList);
        if (!stageId || !className.trim() || !groupNumberValue) {
          toast.error("Preencha etapa, turma e número do grupo.");
          return;
        }
        if (!memberNames.length) {
          toast.error("Inclua pelo menos um integrante.");
          return;
        }
        onSubmit({
          stageId,
          className: className.trim(),
          groupNumber: groupNumberValue,
          memberNames,
        });
      }}
      className="border-2 border-black bg-zinc-50 p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.14em]">
          {group ? "Editar grupo" : "Novo grupo"}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="text-[10px] font-black uppercase tracking-[0.12em] underline"
        >
          Cancelar
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Etapa">
          <select
            value={stageId}
            onChange={event => setStageId(Number(event.target.value))}
            className="h-11 w-full rounded-none border border-black bg-white px-3 text-sm font-semibold"
          >
            {stages.map(stage => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Turma">
          <Input
            value={className}
            onChange={event => setClassName(event.target.value)}
            placeholder="Ex.: 9º A"
            className="h-11 rounded-none border-black"
          />
        </Field>
        <Field label="Número">
          <Input
            type="number"
            min="1"
            value={groupNumber}
            onChange={event => setGroupNumber(event.target.value)}
            className="h-11 rounded-none border-black"
          />
        </Field>
      </div>
      <Field label="Integrantes">
        <Textarea
          value={memberList}
          onChange={event => setMemberList(event.target.value)}
          className="min-h-28 rounded-none border-black"
          placeholder="Um integrante por linha"
        />
      </Field>
      <button
        disabled={busy}
        className="mt-1 h-10 bg-[#0b5b4b] px-4 text-[10px] font-black uppercase tracking-[0.14em] text-white hover:bg-black disabled:opacity-50"
      >
        {busy ? "Salvando" : "Salvar grupo"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-4 block text-[10px] font-black uppercase tracking-[0.12em] text-black">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}
function EmptyState({ message }: { message: string }) {
  return (
    <div className="border-y border-black py-10 text-center text-sm text-zinc-500">
      {message}
    </div>
  );
}
