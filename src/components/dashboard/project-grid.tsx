import { ProjectCard } from "./project-card";

type Project = {
  id: string;
  title: string;
  rawIdea: string;
  status: string;
  updatedAt: Date;
  blueprint: { id: string } | null;
};

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
