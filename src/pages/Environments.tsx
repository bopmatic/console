import React from 'react';
import BopmaticTableContainer from '../components/tables/BopmaticTableContainer';
import EnvironmentsTable from '../components/tables/EnvironmentsTable';

const Environments: React.FC = () => {
  return (
    <BopmaticTableContainer tableResource="Environments" numResources={1}>
      <EnvironmentsTable />
    </BopmaticTableContainer>
  );
};

export default Environments;
