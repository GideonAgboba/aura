import {Div, Text} from '@components';
import styles from './TrendStats.module.css';

interface TrendStatProps {
  trend: 'improving' | 'declining' | 'stable' | 'variable';
  severity: 'positive' | 'neutral' | 'concern';
  fluctuationRate: number;
}

export const TrendStats: React.FC<TrendStatProps> = ({trend, severity, fluctuationRate}) => {
  return (
    <Div className={styles.container}>
      <ul className={styles.statsList}>
        <li className={styles.statItem}>
          <Text as="span" className={styles.label}>
            Trend
          </Text>
          <Text as="span" className={`${styles.value} ${styles[trend]}`}>
            {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </Text>
        </li>
        <li className={styles.statItem}>
          <Text as="span" className={styles.label}>
            Severity
          </Text>
          <Text as="span" className={`${styles.value} ${styles[severity]}`}>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </Text>
        </li>
        <li className={styles.statItem}>
          <Text as="span" className={styles.label}>
            Fluctuation
          </Text>
          <Text as="span" className={styles.value}>
            {(fluctuationRate * 100).toFixed(1)}%
          </Text>
        </li>
      </ul>
    </Div>
  );
};
