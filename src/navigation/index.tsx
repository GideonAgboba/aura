import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  useLocation,
} from 'react-router-dom';
import {useUser} from '@hooks';
import ErrorBox from '@pages/ErrorBox/ui';
import Home from '@pages/Home/ui';
import Layout from '@pages/Layout/ui';
import Login from '@pages/Login/ui';
import NotFound from '@pages/NotFound/ui';
import {Routes as AppRoutes} from '@types';

const PrivateRoute = () => {
  const {user} = useUser();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={AppRoutes.login}
        state={{
          message: 'You must log in first.',
          from: location.pathname,
        }}
        replace
      />
    );
  }
  return <Outlet />;
};

const PublicRoute = () => {
  const {user} = useUser();

  if (user) {
    return <Navigate to={AppRoutes.home} replace />;
  }
  return <Outlet />;
};

const Navigation = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorBox />}>
      <Route element={<PublicRoute />}>
        <Route index element={<Login />} />
        <Route path={AppRoutes.login} element={<Login />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route index element={<Home />} />
        <Route path={AppRoutes.home} element={<Home />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default Navigation;
