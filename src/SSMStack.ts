import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class SSMStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add("description", "WarsawJS 120");
    cdk.Tags.of(this).add("organization", "3sky.dev");
    cdk.Tags.of(this).add("owner", "3sky");

    const vpc = new ec2.Vpc(this, 'VPC', {
      ipAddresses: ec2.IpAddresses.cidr("10.192.0.0/20"),
      maxAzs: 1,
      restrictDefaultSecurityGroup: true,
      subnetConfiguration: [
        {
          cidrMask: 28,
          name: "public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 28,
          name: "private",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    const ssmRole = new iam.Role(this, "SSMRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore")
      ],
      roleName: "SSMRole"
    });

    new iam.InstanceProfile(this, "SSMInstanceProfile", {
      role: ssmRole,
      instanceProfileName: "SSMInstanceProfile"
    });


    const instnace = new ec2.Instance(this, 'instance-with-ssm', {
      vpc: vpc,
      instanceName: 'instance-with-ssm',
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      role: ssmRole,
      allowAllOutbound: true,
      detailedMonitoring: true,
      machineImage: ec2.MachineImage.genericLinux({
        // Canonical, Ubuntu, 24.04, arm64 noble image
        "eu-central-1": "ami-099a546c02844706e",
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE4_GRAVITON,
        ec2.InstanceSize.MICRO,
      ),
    });


    new cdk.CfnOutput(this, "connect", {
      value: "aws ssm start-session --target " + instnace.instanceId,
      description: "Host connect command",
    });

    new cdk.CfnOutput(this, "tunnel", {
      value: `aws ssm start-session --target ${instnace.instanceId} --document-name AWS-StartPortForwardingSessionToRemoteHost --parameters '{"portNumber":["80"],"localPortNumber":["8080"],"host":["${instnace.instancePrivateDnsName}"]}'`,
      description: "Tunnel port 80 to localhost 8080",
    });

  }
}
