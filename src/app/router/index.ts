import { Router } from "express";
import AuthRouter from "../modules/user/index.js";
const route = Router();

const AUTH = `/v1/auth`;

route.use(AUTH, AuthRouter);

export default route;
