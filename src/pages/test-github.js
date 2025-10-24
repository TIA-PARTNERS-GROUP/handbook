import React from 'react';
import Layout from '@theme/Layout';

export default function TestGitHub() {
  return (
    <Layout title="Test GitHub" description="Test page for GitHub integration">
      <div className="container margin-vert--lg">
        <h1>GitHub Integration Test</h1>
        <p>If you can see this page, the routing is working correctly.</p>
        <p>Now let's test the GitHub repositories page:</p>
        <a href="/docs/github-repos">Go to GitHub Repositories</a>
      </div>
    </Layout>
  );
}
