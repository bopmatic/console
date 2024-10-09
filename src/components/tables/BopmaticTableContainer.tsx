import React, { ReactNode } from 'react';

type BopmaticTableContainerProps = {
  tableResource: string;
  numResources: number | undefined;
  children: ReactNode;
};

const BopmaticTableContainer: React.FC<BopmaticTableContainerProps> = ({
  tableResource,
  numResources,
  children,
}) => {
  return (
    <div className="bg-white rounded border-bopgreyborder border">
      <div className="p-4">
        {/*TABLE HEADER*/}
        <div className="flex items-center pb-4">
          <h2>{tableResource}</h2>
          <div className="ml-2 text-bopgreytext">({numResources})</div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BopmaticTableContainer;
