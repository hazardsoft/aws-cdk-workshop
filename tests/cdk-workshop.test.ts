import { App, Stack } from 'aws-cdk-lib'
import { Capture, Template } from 'aws-cdk-lib/assertions'
import { beforeAll, expect, test } from 'vitest'
import { CdkWorkshopStack } from '@/cdk-workshop-stack'
import { Hello } from '@/constructs/hello'
import { HitCounter } from '@/constructs/hitcounter'

let appStack: Stack
let appTemplate: Template

beforeAll(async () => {
  appStack = new CdkWorkshopStack(new App(), 'MyTestStack')
  appTemplate = Template.fromStack(appStack)
})

test('Lambda functions are created', () => {
  appTemplate.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'hello.handler'
  })
  appTemplate.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'hitcounter.handler'
  })
  appTemplate.resourceCountIs('AWS::Lambda::Function', 2)
})

test('DynamoDB table is created', () => {
  appTemplate.resourceCountIs('AWS::DynamoDB::Table', 1)
})

interface HitLambdaEnvVars {
  Variables: {
    DOWNSTREAM_FUNCTION_NAME: { Ref: string }
    HITS_TABLE_NAME: { Ref: string }
  }
}
test('Hitcounter Lambda has env vars', () => {
  const envCapture = new Capture()
  appTemplate.hasResourceProperties('AWS::Lambda::Function', {
    Environment: envCapture
  })

  const envVars = envCapture.asObject() as HitLambdaEnvVars
  expect(envVars.Variables.DOWNSTREAM_FUNCTION_NAME.Ref).toSatisfy((val: string) =>
    val.startsWith('HelloConstructHelloHandler')
  )
  expect(envVars.Variables.HITS_TABLE_NAME.Ref).toSatisfy((val: string) =>
    val.startsWith('HitCounterConstructHits')
  )
})

test('DynamoDB is created with encryption', () => {
  appTemplate.hasResourceProperties('AWS::DynamoDB::Table', {
    SSESpecification: {
      SSEEnabled: true
    }
  })
})

test('Read capacity is in range 5-20', () => {
  const stack = new Stack()
  const hello = new Hello(stack, 'HelloTest')
  expect(() => {
    new HitCounter(stack, 'HitCounterTest', {
      downstream: hello.handler,
      readCapacity: 3
    })
  }).toThrowError('Read capacity must be between 5 and 20')
})
