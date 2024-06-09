import { Stack, type StackProps } from 'aws-cdk-lib'
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'
import { HitCounter } from './constructs/hitcounter.js'
import { Hello } from './constructs/hello.js'

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const hello = new Hello(this, 'HelloConstruct')

    const hitCounter = new HitCounter(this, 'HitCounterConstruct', {
      downstream: hello.handler
    })

    new LambdaRestApi(this, 'Endpoint', {
      handler: hitCounter.handler
    })
  }
}
