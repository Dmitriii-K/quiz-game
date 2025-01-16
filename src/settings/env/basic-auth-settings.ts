import { IsString } from "class-validator";
import { EnvironmentVariable } from "../configuration";

export class BasicAuthSettings {
    constructor(private environmentVariables: EnvironmentVariable) {}
    @IsString()
    ADMIN_NAME: string | undefined = this.environmentVariables.ADMIN_NAME;
    @IsString()
    ADMIN_PASS: string | undefined = this.environmentVariables.ADMIN_PASS;
}