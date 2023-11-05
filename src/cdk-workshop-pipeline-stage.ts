import { CfnOutput, Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CdkWorkshopStack } from "./cdk-workshop-stack";

export class CDKPipelineStage extends Stage {
    public readonly gateWayUrlOutput: CfnOutput;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const application = new CdkWorkshopStack(this, "CDKWorkshopStack");
        this.gateWayUrlOutput = application.endpointOutput;
    }
}