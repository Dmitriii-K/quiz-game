import { IsString } from "class-validator";
import { EnvironmentVariable } from "../configuration";

export class DatabaseSettings {
    constructor(private environmentVariables: EnvironmentVariable) {}
    @IsString()
    // MONGO_CONNECTION_URI: string | undefined = this.environmentVariables.MONGO_CONNECTION_URI;
    SQL_CONNECTION_URI: string | undefined = this.environmentVariables.SQL_CONNECTION_URI;
}