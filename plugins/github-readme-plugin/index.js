const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;
const path = require('path');

/**
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {import('@docusaurus/types').PluginOptions} options
 */
async function githubReadmePlugin(context, options) {
  const {
    siteConfig,
    siteDir,
    generatedFilesDir,
    routesPaths,
    baseUrl,
    i18n,
  } = context;

  const {
    organization = 'TIA-PARTNERS-GROUP',
    githubToken = process.env.GITHUB_TOKEN,
    outputDir = 'docs/github-repos',
    excludeRepos = [],
    includeArchived = false,
  } = options;

  return {
    name: 'github-readme-plugin',
    
    configureWebpack(config, isServer) {
      if (!isServer) {
        return {};
      }
      
      return {
        resolve: {
          alias: {
            '@github-plugin': path.resolve(__dirname, 'index.js'),
          },
        },
      };
    },

    async loadContent() {
      const octokit = new Octokit({
        auth: githubToken,
      });

      console.log('Using authenticated GitHub API requests (5000 requests/hour limit)');

      try {
        // Fetch all repositories from the organization
        const { data: repos } = await octokit.rest.repos.listForOrg({
          org: organization,
          type: 'all',
          per_page: 100,
        });

        // Filter repositories
        const filteredRepos = repos.filter(repo => {
          if (excludeRepos.includes(repo.name)) return false;
          if (!includeArchived && repo.archived) return false;
          return true;
        });

        console.log(`Found ${filteredRepos.length} repositories in ${organization}`);

        const repoData = [];

        for (const repo of filteredRepos) {
          try {
            // Fetch README content
            const { data: readme } = await octokit.rest.repos.getReadme({
              owner: organization,
              repo: repo.name,
            });

            // Decode the content (it's base64 encoded)
            const content = Buffer.from(readme.content, 'base64').toString('utf-8');

            repoData.push({
              name: repo.name,
              fullName: repo.full_name,
              description: repo.description,
              url: repo.html_url,
              cloneUrl: repo.clone_url,
              language: repo.language,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              lastUpdated: repo.updated_at,
              archived: repo.archived,
              content,
              path: readme.path,
            });

            console.log(`✓ Fetched README for ${repo.name}`);
          } catch (error) {
            console.warn(`⚠ Could not fetch README for ${repo.name}:`, error.message);
          }
        }

        return repoData;
      } catch (error) {
        console.error('Error fetching repositories:', error);
        return [];
      }
    },

    async contentLoaded({ content, actions }) {
      const { createData, addRoute } = actions;

      // Create data files for each repository
      for (const repo of content) {
        const repoData = await createData(
          `github-repo-${repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.json`,
          JSON.stringify(repo)
        );

        // Add route for the documentation page
        addRoute({
          path: `/docs/github-repos/${repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`,
          component: '@site/src/components/GitHubRepoPage',
          exact: true,
          modules: {
            repoData: repoData,
          },
        });
      }

      // Create index data
      const indexData = await createData(
        'github-repos-index.json',
        JSON.stringify(content)
      );

      addRoute({
        path: '/docs/github-repos',
        component: '@site/src/components/GitHubReposIndex',
        exact: true,
        modules: {
          reposData: indexData,
        },
      });
    },
  };
}

module.exports = githubReadmePlugin;
