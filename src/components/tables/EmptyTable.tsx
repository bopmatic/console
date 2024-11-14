import React, { useEffect } from 'react';

type EmptyTableProps = {
  resourceName: string;
};

const EmptyTable: React.FC<EmptyTableProps> = ({ resourceName }) => {
  const [resourceNameUppercase, setResourceNameUppercase] = React.useState('');
  const [resourceNameLowercase, setResourceNameLowercase] = React.useState('');
  useEffect(() => {
    if (resourceName) {
      const l = resourceName.toLowerCase();
      const u = l.charAt(0).toUpperCase() + l.slice(1).toLowerCase();
      setResourceNameLowercase(l);
      setResourceNameUppercase(u);
    }
  }, [resourceName]);
  return (
    <div className="flex justify-center">
      <div className="pt-8 pb-8">
        <div className="text-center text-bopblack text-xl">{`No ${resourceNameUppercase}s`}</div>
        <div className="text-center text-bopgreytext text-sm mt-4">
          {`Update your project definitions to include ${resourceNameLowercase}s then deploy your
          changes with the Bopmatic CLI.`}
        </div>
      </div>
    </div>
  );
};

export default EmptyTable;
