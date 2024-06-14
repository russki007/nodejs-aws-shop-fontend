import fs from 'fs-extra';
import path from 'path';

(async () => {

  try {


    const STACK_JSON_FILE = path.join(__dirname, 'outputs.json');
    console.log(`Reading CDK outputs from: ${STACK_JSON_FILE}`);
    
    const cdkOutput = JSON.parse(fs.readFileSync(STACK_JSON_FILE).toString())['russki007-WebAppStack'];
    
    console.log(`CDK Outputs: ${JSON.stringify(cdkOutput)}`);


    const configEnv = path.join(__dirname, ".env");

    const config = {
      DISTRIBUTION_ID: cdkOutput.DistributionId,
      FILES_BUCKET: cdkOutput.FilesBucket,
      WEBSITE_URL: cdkOutput.WebsiteUrl,
      AWS_REGION: cdkOutput.Region,
      STACK_NAME: cdkOutput.StackName
    };

    fs.writeFileSync(
      configEnv,
      Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
    );
  } catch (error) {
    console.log(`Error while updating .env: ${error}`);
    process.exit(1);
  }

})();