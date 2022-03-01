# depstrive
Multi-tool for missing CI/CD features

# Usage

Depstrive supported commands:

## execWithAssume

`execWithAssume` sub-command uses your default AWS credentials to assume role. It uses assumed role to execute command with permissions of this role.

Application follows [order of recommendations](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) to retrieve current credentials.
### Example usage:

```sh
npx depstrive execWithAssume -r arn:aws:iam::account-id:role/role-name-with-path -l info -- aws sts get-caller-identity
```

### Options

```
depstrive execWithAssume <cmd...>

Run command with AWS role assumed.

Options:
  --version        Show version number                                 [boolean]
  --log-level, -l  Log Level
                  [choices: "debug", "info", "warn", "error"] [default: "error"]
  --role-arn, -r   AWS Assume Role arn                                [required]
  -h, --help       Show help                                           [boolean]
```
