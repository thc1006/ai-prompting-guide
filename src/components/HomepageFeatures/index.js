import clsx from 'clsx';
import Heading from '@theme/Heading';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: translate({
      id: 'homepage.features.fundamentals.title',
      message: 'Master the Fundamentals',
      description: 'The title of the fundamentals feature'
    }),
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: translate({
      id: 'homepage.features.fundamentals.description',
      message: 'Learn the core principles of effective AI prompting, from basic structure to advanced patterns. Build a solid foundation with proven techniques used by professionals.',
      description: 'The description of the fundamentals feature'
    }),
  },
  {
    title: translate({
      id: 'homepage.features.examples.title',
      message: 'Practical, Real-World Examples',
      description: 'The title of the examples feature'
    }),
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: translate({
      id: 'homepage.features.examples.description',
      message: 'Go beyond theory with hands-on tutorials covering content creation, code generation, data analysis, and more. Apply techniques to your specific use cases.',
      description: 'The description of the examples feature'
    }),
  },
  {
    title: translate({
      id: 'homepage.features.strategies.title',
      message: 'Production-Ready Strategies',
      description: 'The title of the strategies feature'
    }),
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: translate({
      id: 'homepage.features.strategies.description',
      message: 'Scale your prompting expertise with advanced techniques like chain-of-thought reasoning, prompt chaining, and production deployment best practices.',
      description: 'The description of the strategies feature'
    }),
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