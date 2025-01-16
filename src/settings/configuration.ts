export enum Environments {
    DEVELOPMENT = 'DEVELOPMENT',
    STAGING = 'STAGING',
    PRODUCTION = 'PRODUCTION',
    TEST = 'TEST',
}

export type EnvironmentVariable = { [key: string]: string | undefined };

export type ConfigurationType = ReturnType<typeof getConfig>;

const getConfig = (
    environmentVariables: EnvironmentVariable,
    currentEnvironment: Environments,
) => {
    return {
    apiSettings: {
        PORT: Number.parseInt(environmentVariables.PORT || '3003'),
    },

    databaseSettings: {
        // MONGO_CONNECTION_URI: environmentVariables.MONGO_CONNECTION_URI,
        // MONGO_CONNECTION_URI_FOR_TESTS: environmentVariables.MONGO_CONNECTION_URI_FOR_TESTS,
        PORT_SQL: Number.parseInt(environmentVariables.PORT_SQL || ''),
    },

    environmentSettings: {
        currentEnv: currentEnvironment,
        isProduction: currentEnvironment === Environments.PRODUCTION,
        isStaging: currentEnvironment === Environments.STAGING,
        isTesting: currentEnvironment === Environments.TEST,
        isDevelopment: currentEnvironment === Environments.DEVELOPMENT,
    },

    nodemailerSettings: {
        PASSWORD_BY_EMAIL: environmentVariables.PASSWORD_BY_EMAIL
    },

    jwtSecretSettings: {
        // из сервиса прописать exp если нужно
        JWT_SECRET_KEY: environmentVariables.JWT_SECRET_KEY
    },

    basicAuthSettings: {
        ADMIN_NAME: environmentVariables.ADMIN_NAME,
        ADMIN_PASS: environmentVariables.ADMIN_PASS
    }
    };
};

export default () => {
    const environmentVariables = process.env;

    // console.log('process.env.ENV =', environmentVariables.ENV);
    const currentEnvironment: Environments = environmentVariables.ENV as Environments;

    return getConfig(environmentVariables, (currentEnvironment.toString().trim()) as Environments);
};