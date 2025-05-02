import { createFileRoute } from '@tanstack/react-router';
import Navigation from '../components/layouts/navigation';
import styles from './index.module.scss';
export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Frontend Lab</h1>
      <p className={styles.subtitle}>Research and experiments on frontend technologies</p>

      <Navigation />
    </div>
  );
}
