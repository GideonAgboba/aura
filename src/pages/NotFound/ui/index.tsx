import {Link} from 'react-router-dom';
import {Div, Text} from '@components';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <Div className={styles.container}>
      <Div className={styles.containerContent}>
        <Text as="h1">
          Sorry, the page you were looking for was not found.
        </Text>
        <Text>
          <Link to="/" className={styles.linkButton}>
            Return to Home
          </Link>
        </Text>
      </Div>
    </Div>
  );
};

export default NotFound;
