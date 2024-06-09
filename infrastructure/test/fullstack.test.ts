import * as cdk from "aws-cdk-lib";
import { Template } from 'aws-cdk-lib/assertions';
import WebappStack from "../lib";


test('Empty Stack', () => {
    const app = new cdk.App();
    const stack = new WebappStack(app, 'TestStack');
    const template = Template.fromStack(stack);
    console.log(template.toJSON());
});
