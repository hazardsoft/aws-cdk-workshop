#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { CDKPipelineStack } from "./cdk-workshop-pipeline.js";

const app = new App();
new CDKPipelineStack(app, "CdkWorkshopPipelineStack");
