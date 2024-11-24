import React, { ReactNode } from 'react';

type BopmaticTableContainerProps = {
  tableResource: string;
  includeNumResources: boolean;
  numResources?: number | undefined;
  subtitle?: string;
  subtitle2?: string;
  actionButtonContainer?: ReactNode;
  children: ReactNode;
};

const BopmaticTableContainer: React.FC<BopmaticTableContainerProps> = ({
  tableResource,
  includeNumResources,
  numResources,
  subtitle,
  subtitle2,
  actionButtonContainer,
  children,
}) => {
  return (
    <div className="bg-white rounded border-bopgreyborder border">
      <div className="p-4">
        {/* TABLE HEADER */}
        <div className="pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 md:items-center md:justify-between gap-y-4">
            {/* Left Section */}
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

            {/* Right Section (Action Button Container) */}
            {actionButtonContainer && (
              <div className="md:text-right">{actionButtonContainer}</div>
            )}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default BopmaticTableContainer;
