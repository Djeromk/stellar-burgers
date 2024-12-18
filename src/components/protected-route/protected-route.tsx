import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router';
import { Preloader } from '../ui';
import {
  selectIsAuth,
  selectIsAuthChecked,
  selectIsLoading,
  selectUserData
} from '../../services/slices/user-slice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  //const isLoading = useSelector(selectFetchSuccess);
  //const fetchSuccess = useSelector(selectFetchSuccess);
  const user = useSelector(selectUserData);
  const location = useLocation();

  if (!isAuthChecked) {
    console.log('LOADING');

    return <Preloader />;
  }

  if (onlyUnAuth && user!.email && user!.name) {
    console.log('NAVIGATE FROM LOGIN TO PAGE');

    const from = location.state?.from || { pathname: '/' };
    // const { background } = from?.state || null;
    return <Navigate replace to={from} />;
  }
  if (!onlyUnAuth && (!user!.email || !user!.name)) {
    console.log('NAVIGATE FROM PAGE TO LOGIN');
    return <Navigate replace to='/login' />;
  }

  return children;
};
