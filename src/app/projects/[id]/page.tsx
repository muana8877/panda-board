// src/app/project/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ProjectBoard from "@/components/ProjectBoard";

export default function ProjectPage() {
  const { id } = useParams(); // this is the project ID from the URL

  return (
    <div className="h-screen w-full bg-neutral-900 text-white p-4">
      <ProjectBoard projectId={id as string} />
    </div>
  );
}
