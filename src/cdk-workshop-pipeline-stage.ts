import { Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CdkWorkshopStack } from "./cdk-workshop-stack";

export class CDKPipelineStage extends Stage {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const stack = new CdkWorkshopStack(scope, "CDKWorkshopStack");
    }
}