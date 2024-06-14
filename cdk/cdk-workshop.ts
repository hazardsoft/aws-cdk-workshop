#!/usr/bin/env node
import { App } from 'aws-cdk-lib'
import { CdkWorkshopStack } from './cdk-workshop-stack.js'

const workshopStack = new CdkWorkshopStack(new App(), 'CdkWorkshopStack')
export { workshopStack }
