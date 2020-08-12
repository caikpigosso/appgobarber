import React from 'react';

import { AuthProvider } from './Auth';

const appProvider: React.FC = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default appProvider;
