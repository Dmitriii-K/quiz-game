import { IsNumber, IsString } from "class-validator";
import { EnvironmentVariable } from "../configuration";
import { log } from "console";

export class JwtSecretSettings {
    constructor(private environmentVariables: EnvironmentVariable) {
        // console.log(this.environmentVariables.JWT_SECRET_KEY, " this.environmentVariables.JWT_SECRET_KEY")
    }
    @IsString()
    JWT_SECRET_KEY: string | undefined = this.environmentVariables.JWT_SECRET_KEY;
}