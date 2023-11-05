import { Stack } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import { CodeBuildStep, CodePipeline, CodePipelineSource } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { CDKPipelineStage } from "./cdk-workshop-pipeline-stage";

export class CDKPipelineStack extends Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id)

        const repo = new Repository(this, "CDKWorkshopRepository", {
            repositoryName: "CDKWorkshopRepository"
        })

        const pipeline = new CodePipeline(this, "CDKWorkshopPipeline", {
            pipelineName: "CDKWorkshopPipeline",
            synth: new CodeBuildStep("Step1", {
                input: CodePipelineSource.codeCommit(repo, "feature-pipeline"),
                installCommands: ["npm install -g aws-cdk"],
                commands: ["npm ci", "npm run build", "npx cdk synth"]
            })
        })

        const stage = new CDKPipelineStage(this, "Stage1");
        pipeline.addStage(stage);
    }
}