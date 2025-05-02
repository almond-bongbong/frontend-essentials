import { Link } from '@tanstack/react-router';
import styles from './navigation.module.scss';

function Navigation() {
  const labPages = [
    {
      title: 'Fixed CTA Button',
      description: 'Research on positioning fixed CTA button above Safari mobile keyboard',
      path: '/fixed-cta-button',
    },
    // 추가 연구 페이지는 여기에 추가
  ];

  return (
    <nav className={styles.navigation}>
      <ul className={styles.menu}>
        {labPages.map((page) => (
          <li key={page.path}>
            <Link to={page.path}>
              <h2 className={styles.title}>{page.title}</h2>
              <p className={styles.description}>{page.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
