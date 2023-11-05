const serialize = require ("cookie");
import { Response } from "express";

export const cookieSetter = (res: Response, token: string, set: boolean) => {
    res.setHeader("Set-Cookie", serialize("token", set ? token : "", {
        path: '/',
        httpOnly: true,
        maxAge: 10 * 24 * 60 * 60 * 1000   // set the time in millisecond ; Here the expiry time will be 10 days 
    }))   
}