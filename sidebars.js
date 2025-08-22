/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // AI Prompting Guide sidebar structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Fundamentals',
      collapsed: false,
      items: [
        'fundamentals/what-is-prompting',
        'fundamentals/quick-start',
        'fundamentals/prompt-structure',
        'fundamentals/common-patterns',
      ],
    },
    {
      type: 'category',
      label: 'Practical Tutorials',
      collapsed: false,
      items: [
        'tutorials/content-creation',
        'tutorials/code-generation',
        'tutorials/data-analysis',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Techniques',
      collapsed: false,
      items: [
        'advanced/chain-of-thought',
        'advanced/prompt-chaining',
        'advanced/multi-modal',
      ],
    },
    {
      type: 'category',
      label: 'Best Practices',
      collapsed: false,
      items: [
        'best-practices/testing-prompts',
        'best-practices/production-deployment',
        'best-practices/security-ethics',
        'best-practices/team-collaboration',
      ],
    },
    {
      type: 'category',
      label: 'Applications',
      collapsed: false,
      items: [
        'applications/business-intelligence',
      ],
    },
    {
      type: 'category',
      label: 'Case Studies',
      collapsed: false,
      items: [
        'case-studies/enterprise-deployment',
      ],
    },
  ],
};

export default sidebars;