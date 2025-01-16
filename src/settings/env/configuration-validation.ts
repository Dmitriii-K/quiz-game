import { ValidateNested, validateSync } from "class-validator";
import { DatabaseSettings } from "./database-settings";
import { ApiSettings } from "./api-settings";
import { EnvironmentSettings } from "./env-settings";
import { JwtSecretSettings } from "./jwt-secret-settings";
import { BasicAuthSettings } from "./basic-auth-settings";
import { NodemailerSettings } from "./nodemailer-settings";

export type EnvironmentVariable = { [key: string]: string };
export type ConfigurationType = Configuration;
export type ApiSettingsType = ConfigurationType['apiSettings'];
export type DatabaseSettingsType = ConfigurationType['databaseSettings'];
export type EnvironmentSettingsType = ConfigurationType['environmentSettings'];
export type JwtSecretSettingsType = ConfigurationType['jwtSecretSettings'];
export type BasicAuthSettingsType = ConfigurationType['basicAuthSettings'];
export type NodemailerSettingsType = ConfigurationType['nodemailerSettings'];

export class Configuration {
@ValidateNested()
apiSettings: ApiSettings;
@ValidateNested()
databaseSettings: DatabaseSettings;
@ValidateNested()
environmentSettings: EnvironmentSettings;
@ValidateNested()
jwtSecretSettings: JwtSecretSettings;
@ValidateNested()
basicAuthSettings: BasicAuthSettings;
@ValidateNested()
nodemailerSettings: NodemailerSettings;
  // Другие настройки...

private constructor(configuration: Configuration) {
    Object.assign(this, configuration);
}

static createConfig(
    environmentVariables: Record<string, string>,
): Configuration {
    return new this({
      // Инициализация настроек
        apiSettings: new ApiSettings(environmentVariables),
        databaseSettings: new DatabaseSettings(environmentVariables),
        environmentSettings: new EnvironmentSettings(environmentVariables),
        jwtSecretSettings: new JwtSecretSettings(environmentVariables),
        basicAuthSettings: new BasicAuthSettings(environmentVariables),
        nodemailerSettings: new NodemailerSettings(environmentVariables)
      // Другие настройки...
        });
    }
}

export function validate(environmentVariables: Record<string, string>) {
    const config = Configuration.createConfig(environmentVariables);
    // console.log("-----", environmentVariables)
    // console.log(config, " config")
    const errors = validateSync(config, { skipMissingProperties: false });
    if (errors.length > 0) {
    throw new Error(errors.toString());
    }
    return config;
}

export default () => {
    const environmentVariables = process.env as EnvironmentVariable;
    // console.log('process.env.ENV =', environmentVariables.ENV);
    return Configuration.createConfig(environmentVariables);
};