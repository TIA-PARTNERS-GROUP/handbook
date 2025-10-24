import React, { useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

function GitHubReposIndex(props) {
  const { siteConfig } = useDocusaurusContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Docusaurus passes module data through props
  // The data can come as props.reposData (if it's a JSON module) or need to be accessed differently
  let repos = [];
  
  try {
    // Try to access the data from the module
    if (props.reposData) {
      // If reposData is already an array, use it directly
      if (Array.isArray(props.reposData)) {
        repos = props.reposData;
      }
      // If it's a module with default export
      else if (props.reposData.default) {
        repos = props.reposData.default;
      }
      // If it's a JSON string, parse it
      else if (typeof props.reposData === 'string') {
        repos = JSON.parse(props.reposData);
      }
      // Otherwise, try to use it as-is
      else {
        repos = props.reposData;
      }
    }
  } catch (error) {
    console.error('Error loading repository data:', error);
  }
  
  if (!repos || repos.length === 0) {
    return (
      <Layout title="GitHub Repositories" description="All repositories from TIA-PARTNERS-GROUP">
        <div className="container margin-vert--lg">
          <h1>Error: No repository data available</h1>
          <p>Please check the browser console for more details.</p>
          <p>Props keys: {JSON.stringify(Object.keys(props))}</p>
        </div>
      </Layout>
    );
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Show a brief loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh the page to trigger the plugin to re-fetch data
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing repositories:', error);
      setIsRefreshing(false);
    }
  };
  
  return (
    <Layout title="GitHub Repositories" description="All repositories from TIA-PARTNERS-GROUP">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className={styles.reposIndex}>
              <div className={styles.header}>
                <h1>GitHub Repositories</h1>
                <button
                  className={styles.refreshButton}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  title="Refresh GitHub repositories data"
                >
                  {isRefreshing ? (
                    <>
                      <span className={styles.spinner}>⟳</span>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <span className={styles.icon}>🔄</span>
                      Refresh Repos
                    </>
                  )}
                </button>
              </div>
              
              <p>
                This section contains documentation automatically generated from README files 
                of repositories in the{' '}
                <a href="https://github.com/TIA-PARTNERS-GROUP" target="_blank" rel="noopener noreferrer">
                  TIA-PARTNERS-GROUP
                </a>{' '}
                organization.
              </p>

              <h2>Repository List</h2>
              
              {repos.map((repo, index) => (
                <div key={repo.name} className={styles.repoCard}>
                  <h3>
                    <Link to={`/docs/github-repos/${repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`}>
                      {index + 1}. {repo.name}
                    </Link>
                  </h3>
                  
                  <div className={styles.repoMeta}>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className={styles.repoLink}>
                      🔗 View on GitHub
                    </a>
                    <span className={styles.repoLanguage}>
                      {repo.language || 'No language'}
                    </span>
                    <span className={styles.repoStats}>
                      ⭐ {repo.stars} | 🍴 {repo.forks}
                    </span>
                    <span className={styles.repoUpdated}>
                      Updated: {new Date(repo.lastUpdated).toLocaleDateString()}
                    </span>
                    {repo.archived && (
                      <span className={styles.archived}>🏛️ Archived</span>
                    )}
                  </div>
                  
                  {repo.description && (
                    <p className={styles.repoDescription}>{repo.description}</p>
                  )}
                </div>
              ))}

              <div className={styles.footer}>
                <p><em>This page is automatically generated from GitHub repository data.</em></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GitHubReposIndex;
