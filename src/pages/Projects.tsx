import React from 'react';
import ProjectsTable from '../components/tables/ProjectsTable';
import BopmaticTableContainer from '../components/tables/BopmaticTableContainer';

const Projects: React.FC = () => {
  return (
    <BopmaticTableContainer tableResource="Projects" numResources={2}>
      <ProjectsTable />
    </BopmaticTableContainer>
  );
};

export default Projects;
