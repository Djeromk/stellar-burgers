import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUserDataName } from '../../services/slices/user-slice';

export const AppHeader: FC = () => {
  const name = useSelector(selectUserDataName);
  return <AppHeaderUI userName={name} />;
};
