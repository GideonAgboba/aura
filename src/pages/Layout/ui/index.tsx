import {Outlet} from 'react-router-dom';
import {useStoreHydration} from '@store';
import {Dictionary} from './components';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  const isHydrated = useStoreHydration();

  if (!isHydrated) {
    return <Dictionary />;
  }

  return (
    <main className={styles.wrapper}>
      <Outlet />
    </main>
  );
};

export default Layout;
