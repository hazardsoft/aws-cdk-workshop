#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { PipelineStack } from "./cdk-workshop-pipeline.js";

const app = new App();
new PipelineStack(app, "CdkWorkshopPipelineStack");
