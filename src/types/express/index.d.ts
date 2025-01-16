import * as express from 'express'



declare global {
    namespace Express {
        class User { login: string; email: string; userId: string}
        export interface Request {
            user?: User
            deviceId? : string | undefined
        }
    }
}

// declare global {
//     namespace Express {
//         export interface Request {
//             user: WithId<UserDBModel> 
//         }
//     }
// }