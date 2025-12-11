'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';

// Redux Provider to wrap the app
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
