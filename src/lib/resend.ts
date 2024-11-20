import { Resend } from 'resend';
console.log("INSIDE RESEND")
export const resend = new Resend(process.env.RESEND_API_KEY);