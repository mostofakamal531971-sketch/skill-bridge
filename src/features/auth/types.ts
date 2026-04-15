export type signInPayloadType = {
    email:string;
    password:string
}
export type signUpPayloadType = {

    name:string;
    email:string;
    password:string
    role:"STUDENT" | "TUTOR"
}
