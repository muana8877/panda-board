// src/components/ProjectBoard.tsx
import React from "react";

interface ProjectBoardProps {
  projectId: string;
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ projectId }) => {
  return <div>ProjectBoard ID: {projectId}</div>;
};

export default ProjectBoard;