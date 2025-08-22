import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            {translate({
              id: 'homepage.hero.startLearning',
              message: 'Start Learning AI Prompting 🚀',
              description: 'The text of the start learning button'
            })}
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/fundamentals/quick-start"
            style={{marginLeft: '1rem'}}>
            {translate({
              id: 'homepage.hero.quickStart',
              message: 'Quick Start Guide',
              description: 'The text of the quick start button'
            })}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Master AI Prompting`}
      description="Comprehensive guide to AI prompting techniques, from fundamentals to production deployment. Learn effective prompt engineering for developers, content creators, and AI practitioners.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}