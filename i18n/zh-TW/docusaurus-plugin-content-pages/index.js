import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.customFields.titleZhTW}</h1>
        <p className="hero__subtitle">{siteConfig.customFields.taglineZhTW}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            開始學習 AI 提示詞 🚀
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/fundamentals/quick-start"
            style={{marginLeft: '1rem'}}>
            快速入門指南
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
      title={`${siteConfig.customFields.titleZhTW} － 掌握 AI 提示詞與 agentic 開發`}
      description="從 prompt 基礎到 2026 年的 agentic coding（Claude Code、OpenAI Codex、情境工程），一份繁體中文的 AI 提示詞與 AI 編碼代理寶典。">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}