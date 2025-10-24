import React, { useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ReactMarkdown from 'react-markdown';
import styles from './styles.module.css';

function GitHubRepoPage(props) {
  const { siteConfig } = useDocusaurusContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Docusaurus passes module data through props
  let repo = {};
  
  try {
    if (props.repoData) {
      // If repoData is already an object, use it directly
      if (typeof props.repoData === 'object' && !Array.isArray(props.repoData) && props.repoData.name) {
        repo = props.repoData;
      }
      // If it's a module with default export
      else if (props.repoData.default) {
        repo = props.repoData.default;
      }
      // If it's a JSON string, parse it
      else if (typeof props.repoData === 'string') {
        repo = JSON.parse(props.repoData);
      }
      // Otherwise, try to use it as-is
      else {
        repo = props.repoData;
      }
    }
  } catch (error) {
    console.error('Error loading repository data:', error);
  }
  
  if (!repo || !repo.name) {
    return (
      <Layout title="Error" description="Repository not found">
        <div className="container margin-vert--lg">
          <h1>Error: Repository data not available</h1>
          <p>Please check the browser console for more details.</p>
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
    <Layout title={repo.name} description={repo.description || 'Repository documentation'}>
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className={styles.repoPage}>
              <div className={styles.header}>
                <h1>{repo.name}</h1>
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
                      Refresh
                    </>
                  )}
                </button>
              </div>
              
              {repo.description && (
                <div className={styles.description}>
                  <blockquote>
                    {repo.description}
                  </blockquote>
                </div>
              )}

              <div className={styles.repoInfo}>
                <h2>Repository Information</h2>
                <table>
                  <tbody>
                    <tr>
                      <td><strong>Full Name:</strong></td>
                      <td><a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.fullName}</a></td>
                    </tr>
                    <tr>
                      <td><strong>Language:</strong></td>
                      <td>{repo.language || 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td><strong>Stars:</strong></td>
                      <td>⭐ {repo.stars}</td>
                    </tr>
                    <tr>
                      <td><strong>Forks:</strong></td>
                      <td>🍴 {repo.forks}</td>
                    </tr>
                    <tr>
                      <td><strong>Last Updated:</strong></td>
                      <td>{new Date(repo.lastUpdated).toLocaleDateString()}</td>
                    </tr>
                    {repo.archived && (
                      <tr>
                        <td><strong>Status:</strong></td>
                        <td>🏛️ Archived</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className={styles.readmeContent}>
                <h2>README Content</h2>
                <ReactMarkdown>{repo.content}</ReactMarkdown>
              </div>

              <div className={styles.footer}>
                <p><em>This documentation was automatically generated from the repository README.</em></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GitHubRepoPage;
