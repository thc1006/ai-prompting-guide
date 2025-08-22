import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Master the Fundamentals',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Learn the core principles of effective AI prompting, from basic structure
        to advanced patterns. Build a solid foundation with proven techniques
        used by professionals.
      </>
    ),
  },
  {
    title: 'Practical, Real-World Examples',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Go beyond theory with hands-on tutorials covering content creation,
        code generation, data analysis, and more. Apply techniques to your
        specific use cases.
      </>
    ),
  },
  {
    title: 'Production-Ready Strategies',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Scale your prompting expertise with advanced techniques like chain-of-thought
        reasoning, prompt chaining, and production deployment best practices.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}