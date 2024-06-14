import { Stack } from 'aws-cdk-lib'
import { Capture, Template } from 'aws-cdk-lib/assertions'
import { describe, expect, test } from 'vitest'
import { workshopStack } from 'cdk/cdk-workshop.js'
import { Hello } from 'cdk/constructs/hello.js'
import { HitCounter } from 'cdk/constructs/hitcounter.js'

interface HitLambdaEnvVars {
  Variables: {
    DOWNSTREAM_FUNCTION_NAME: { Ref: string }
    HITS_TABLE_NAME: { Ref: string }
  }
}

describe('AWS CDK tests', () => {
  const template = Template.fromStack(workshopStack)

  test('Lambda functions are created', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'hello.handler'
    })
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'hitcounter.handler'
    })
    template.resourceCountIs('AWS::Lambda::Function', 2)
  })

  test('DynamoDB table is created', () => {
    template.resourceCountIs('AWS::DynamoDB::Table', 1)
  })

  test('Hitcounter Lambda has env vars', () => {
    const envCapture = new Capture()
    template.hasResourceProperties('AWS::Lambda::Function', {
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
    template.hasResourceProperties('AWS::DynamoDB::Table', {
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
})
