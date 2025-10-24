import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import ReactMarkdown from 'react-markdown';

export default function GitHubReposList() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRepos = async () => {
      try {
        // Load the data from the public directory
        const response = await fetch('/TIA-HANDBOOK/github-repos-data.json');
        if (response.ok) {
          const data = await response.json();
          setRepos(data);
        } else {
          throw new Error('Could not load repository data');
        }
      } catch (err) {
        console.error('Error loading repositories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, []);

  if (loading) {
    return (
      <div>
        <p>Loading GitHub repositories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error loading repositories: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {repos.map((repo, index) => (
        <div key={repo.name} style={{ 
          border: '1px solid #e1e4e8', 
          borderRadius: '6px', 
          padding: '16px', 
          marginBottom: '16px',
          backgroundColor: '#f6f8fa'
        }}>
          <h3>
            <a href={`/TIA-HANDBOOK/docs/github-repos/${repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`}>
              {index + 1}. {repo.name}
            </a>
          </h3>
          
          <div style={{ marginBottom: '8px' }}>
            <a href={repo.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '16px' }}>
              🔗 View on GitHub
            </a>
            <span style={{ marginRight: '16px' }}>
              {repo.language || 'No language'}
            </span>
            <span style={{ marginRight: '16px' }}>
              ⭐ {repo.stars} | 🍴 {repo.forks}
            </span>
            <span>
              Updated: {new Date(repo.lastUpdated).toLocaleDateString()}
            </span>
            {repo.archived && (
              <span style={{ marginLeft: '8px', color: '#6a737d' }}>
                🏛️ Archived
              </span>
            )}
          </div>
          
          {repo.description && (
            <p style={{ marginBottom: '8px', color: '#586069' }}>{repo.description}</p>
          )}

          {repo.content && (
            <div style={{ 
              borderTop: '1px solid #e1e4e8', 
              paddingTop: '12px',
              marginTop: '12px'
            }}>
              <h4>README Preview:</h4>
              <div style={{ 
                maxHeight: '200px', 
                overflow: 'hidden',
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #d1d5da'
              }}>
                <ReactMarkdown>{repo.content.substring(0, 500)}...</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f1f8ff', borderRadius: '6px' }}>
        <p><em>This page is automatically generated from GitHub repository data.</em></p>
      </div>
    </div>
  );
}
