## TIA Smart Connect AWS Deployment

This directory contains scripts and configuration for deploying TIA Smart Connect infrastructure on AWS using Terraform.

### Structure

- `TIA-DEPLOYMENT/` - Main deployment scripts and environment files
	- `.env` - Example and real environment variable files for AWS credentials
	- `build_repos.sh` - Script to build and deploy repositories
	- `commands.txt` - Useful deployment commands
	- `env.example` - Template for required environment variables
	- `smart-connect.pem` - SSH key for EC2 access (should be kept secure and ignored by git)
	- `.terraform/` - Terraform state and provider files (ignored by git)
	- `cluster_service/` - Terraform configs for ECS cluster and services
	- `ec2/` - Terraform configs for EC2 instances

### Usage

1. Copy `env.example` to `.env` and fill in your AWS credentials.
2. Run `build_repos.sh` to build and deploy the infrastructure.
3. Use the commands in `commands.txt` for common deployment tasks.

