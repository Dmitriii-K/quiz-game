export enum SortDirection {
    asc,
    desc,
}

export class EmailConfirmationType {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
}
export class UserDBModel {
    login: string;
    password: string;
    email: string;
    createdAt: string;
    // emailConfirmation: EmailConfirmationType;
}

