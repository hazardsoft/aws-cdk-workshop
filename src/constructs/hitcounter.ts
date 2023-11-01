import { IFunction, Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { Table, AttributeType, TableEncryption } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";

interface HitCounterProps {
    downstream: IFunction;
    readCapacity?: number;
}

export class HitCounter extends Construct {
    public readonly handler: Function;
    public readonly table: Table;

    constructor(scope: Construct, id: string, props: HitCounterProps) {
        if (
            props.readCapacity !== undefined &&
            (props.readCapacity < 5 || props.readCapacity > 20)
        ) {
            throw new Error("Read capacity must be between 5 and 20");
        }

        super(scope, id);

        this.table = new Table(this, "Hits", {
            partitionKey: {
                name: "path",
                type: AttributeType.STRING,
            },
            removalPolicy: RemovalPolicy.DESTROY,
            encryption: TableEncryption.AWS_MANAGED,
            readCapacity: props.readCapacity ?? 5,
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
