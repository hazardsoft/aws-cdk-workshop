import { IFunction, Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";

interface HitCounterProps {
    downstream: IFunction;
}

export class HitCounter extends Construct {
    public readonly handler: Function;
    public readonly table: Table;

    constructor(scope: Construct, id: string, props: HitCounterProps) {
        super(scope, id);

        this.table = new Table(this, "Hits", {
            partitionKey: {
                name: "path",
                type: AttributeType.STRING,
            },
            removalPolicy: RemovalPolicy.DESTROY,
        });

        this.handler = new Function(this, "HitCounterHandler", {
            runtime: Runtime.NODEJS_18_X,
            code: Code.fromAsset("dist/lambdas/hitcounter"),
            handler: "hitcounter.handler",
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: this.table.tableName,
            },
        });

        this.table.grantReadWriteData(this.handler);
        props.downstream.grantInvoke(this.handler);
    }
}
