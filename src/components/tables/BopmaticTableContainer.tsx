import React, { ReactNode } from 'react';

type BopmaticTableContainerProps = {
  tableResource: string;
  includeNumResources: boolean;
  // refreshCallback: () => void;
  numResources?: number | undefined;
  subtitle?: string;
  subtitle2?: string;
  actionButtonContainer?: ReactNode;
  children: ReactNode;
};

const BopmaticTableContainer: React.FC<BopmaticTableContainerProps> = ({
  tableResource,
  includeNumResources,
  // refreshCallback,
  numResources,
  subtitle,
  subtitle2,
  actionButtonContainer,
  children,
}) => {
  return (
    <div className="bg-white rounded border-bopgreyborder border">
      <div className="p-4">
        {/*TABLE HEADER*/}
        <div className="pb-4">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center">
                <h2>{tableResource}</h2>
                {includeNumResources && (
                  <div className="ml-2 text-bopgreytext">({numResources})</div>
                )}
              </div>
              {subtitle && (
                <div className="text-bopgreytext text-sm">{subtitle}</div>
              )}
              {subtitle2 && (
                <div className="text-bopgreytext text-sm">{subtitle2}</div>
              )}
            </div>
            {/*<div className="border rounded border-gray-300">*/}
            {/*  <IconButton aria-label="refresh" onClick={refreshCallback}>*/}
            {/*    <RefreshIcon />*/}
            {/*  </IconButton>*/}
            {/*</div>*/}
            {actionButtonContainer && <div>{actionButtonContainer}</div>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BopmaticTableContainer;
