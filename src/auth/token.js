import createHttpError from "http-errors";
import { verifyAccessToken } from "./tools.js";

export const JWTMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide Bearer Token in the authorization header!"
      )
    );
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");

      const payload = await verifyAccessToken(token);

      req.user = {
        _id: payload._id,
        isAdmin: payload.isAdmin,
      };

      next();
    } catch (error) {
      console.log(error);
      next(createHttpError(401, "Token not valid!"));
    }
  }
};

// verify token and Admin
export const adminOnlyMiddleware = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    next(createHttpError(403, "Admin only endpoint!"));
  }
};
