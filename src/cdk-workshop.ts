#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { CdkWorkshopStack } from "./cdk-workshop-stack.js";

const app = new App();
new CdkWorkshopStack(app, "CdkWorkshopStack");
