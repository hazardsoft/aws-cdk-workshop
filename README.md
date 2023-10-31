# Welcome to your CDK TypeScript project

Patched implementation of CDK Workshop described at [AWS CDK Workshop](https://cdkworkshop.com/20-typescript.html).
Differences are:
1. Lambda functions are compiled as ESM and not CommonJS (which is used by default)
2. In order for lambda functions to be picked up correctly they are transpiled into files with `*.mjs` extension
3. `NodeJSFunction` is NOT used, common `Function` of `aws-cdk-lib/aws-lambda` is used instead, the reason is that `NodeJSFunction` uses ESBuild under the hood to transpile each lambda function and requires ESBuild config at the place, I prefer common way of defining ESBuild options (e.g. in `esbuild.config.js` file)
4. `Vitest` used instead of `Jest` (typings out-of-the-box, HMR with `watch` option)

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run lint`    run typescript types verification
* `npm run build`   compile typescript to js
* `npm run test`    perform Vitest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
* `cdk destroy`     destroys created application
