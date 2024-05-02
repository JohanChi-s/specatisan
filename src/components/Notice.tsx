import React from "react";

type Props = {
  children?: React.ReactNode;
  icon?: JSX.Element;
  description?: JSX.Element;
};

const Notice: React.FC<Props> = ({ children, icon, description }: Props) => (
  <div className="bg-sidebarBackground text-sidebarText p-2 rounded-md relative text-sm">
    <div className="flex gap-2">
      {icon && <div className="flex-shrink-0">{icon}</div>}
      <div>
        <span className="font-semibold text-base">{children}</span>
        {description && (
          <>
            <br />
            {description}
          </>
        )}
      </div>
    </div>
  </div>
);

export default Notice;
