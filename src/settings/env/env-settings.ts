import { IsEnum } from "class-validator";
import { Environments, EnvironmentVariable } from "../configuration";
import { Trim } from "src/infrastructure/decorators/transform/trim";

export class EnvironmentSettings {
    constructor(private environmentVariables: EnvironmentVariable) {
        // console.log("++", `|${this.environmentVariables.ENV}|`)
    }
    
    @IsEnum(Environments)
    @Trim()
    private ENV = this.environmentVariables.ENV;
    get isProduction() {
        return this.environmentVariables.ENV === Environments.PRODUCTION;
    }
    get isStaging() {
        return this.environmentVariables.ENV === Environments.STAGING;
    }
    get isTesting() {
        return this.environmentVariables.ENV === Environments.TEST;
    }
    get isDevelopment() {
        return this.environmentVariables.ENV === Environments.DEVELOPMENT;
    }
    get currentEnv() {
        return this.ENV;
    }
}