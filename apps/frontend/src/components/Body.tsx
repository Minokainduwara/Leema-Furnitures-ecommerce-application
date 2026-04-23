import React, { type ReactNode } from 'react';

interface BodyProps {
  children: ReactNode;
}

const Body: React.FC<BodyProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Body;