import { Stack } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import { Construct } from "constructs";

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id)

        const repo = new Repository(this, "CDKWorkshopRepository", {
            repositoryName: "CDKWorkshopRepository"
        })
    }
}