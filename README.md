# How to use SSM on AWS?

Very simple example of using AWS SSM with,
AWS CDK and TypeScript. All code is wrapped into
[Taskfile](https://github.com/go-task/task), which could be
considered as depedency.

## Prerequisits

1. AWS account with:
    - AWS_ACCESS_KEY_ID
    - AWS_SECRET_ACCESS_KEY
    - AWS_SESSION_TOKEN
1. or static creds with
    - AWS_ACCESS_KEY_ID
    - AWS_SECRET_ACCESS_KEY

For simplecity **AWSAdministratorAccess** account is used.

## How to use?

1. Edit `Taskfile.yml` according to your needs.

```yaml
env:
  AWS_REGION: user-region
  AWS_ACCOUNT: user-account-id
```

1. Run `task ssm` to build needed elements.
1. Run `task connect` to login into your EC2 instance.
1. Run `task tunnel` to open tunnel from remote 80/tcp to local 8080/tcp.
1. Run `task clean` to remove whole setup.
