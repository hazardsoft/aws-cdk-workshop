import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as CdkWorkshop from "../src/cdk-workshop-stack";
import { test } from "vitest";

test("Lambda Functions Created", () => {
    const app = new cdk.App();
    const stack = new CdkWorkshop.CdkWorkshopStack(app, "MyTestStack");

    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::Lambda::Function", {
        Handler: "hello.handler",
    });
    template.hasResourceProperties("AWS::Lambda::Function", {
        Handler: "hitcounter.handler",
    });
    template.resourceCountIs("AWS::Lambda::Function", 2);
});
