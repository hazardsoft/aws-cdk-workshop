import { Construct } from 'constructs'
import { Function as LambdaFunction, Runtime, Code } from 'aws-cdk-lib/aws-lambda'

export class Hello extends Construct {
  public readonly handler: LambdaFunction

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.handler = new LambdaFunction(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('dist/lambdas/hello'),
      handler: 'hello.handler'
    })
  }
}
