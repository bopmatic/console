import React from 'react';
import EnvSelector from '../envSelector/EnvSelector';

export type PageHeaderProps = {
  title: string | undefined;
  hideEnvironment?: boolean;
};
// TODO: Make environment component for dropdown manu
const PageHeader: React.FC<PageHeaderProps> = ({ title, hideEnvironment }) => {
  return (
    <div className="flex justify-between pt-4 pb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {hideEnvironment ? <div></div> : <EnvSelector />}
    </div>
  );
};

export default PageHeader;
