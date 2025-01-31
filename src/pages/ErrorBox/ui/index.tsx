import {Link, useRouteError} from 'react-router-dom';
import {ConditionalDiv, Div, Icon, Text} from '@components';
import styles from './ErrorBox.module.css';
import { __DEV__ } from '@constants';

interface RouterError extends Error {
  statusText?: string;
  status?: number;
}

const ErrorBox: React.FC = () => {
  const error = useRouteError() as RouterError;
  const errorMessage = error?.message || 'Something went wrong';
  const showErrorLog = __DEV__ && !!error?.stack;

  return (
    <Div className={styles.container} data-testid="error-box">
      <Div className={styles.content}>
        <Icon name="emoji-sad" width={50} height={50} aria-hidden="true" />

        <Text as="h1" className={styles.title}>
          Unexpected Error
        </Text>

        <ConditionalDiv
          if={{
            condition: showErrorLog,
            render: (
              <Div className={styles.stack}>
                <Text className={styles.message}>{errorMessage}</Text>
                <code className={styles.stackTrace}>{error?.stack}</code>
              </Div>
            ),
          }}
          else={
            <Text className={styles.message}>
              An unexpected error occurred. Please try again later.
            </Text>
          }
        />

        <Link to="/" className={styles.link} aria-label="Return to homepage">
          Return to Home
        </Link>
      </Div>
    </Div>
  );
};

export default ErrorBox;
