import { Stack, StackProps } from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { HitCounter } from "./hitcounter";
import { TableViewer } from "cdk-dynamo-table-viewer";

export class CdkWorkshopStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const hello = new lambda.Function(this, "HelloHandler", {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset("lambda"),
            handler: "hello.handler",
        });

        const hitCounter = new HitCounter(this, "HitCounter", {
            downstream: hello,
        });

        new apigw.LambdaRestApi(this, "Endpoint", {
            handler: hitCounter.handler,
        });

        new TableViewer(this, "ViewHitCount", {
            title: "Hello Hits",
            table: hitCounter.table,
            sortBy: "-hits",
        });
    }
}
