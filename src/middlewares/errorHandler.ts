import AppError from "#src/errors/AppError.js";
import { getErrorMessage } from "#src/helpers.js";
import type { ErrorRequestHandler } from "express";
import {
  ForeignKeyConstraintError,
  ValidationError as SequelizeValidationError,
  UniqueConstraintError,
} from "sequelize";
import { flattenError, ZodError } from "zod";

type CustomInputValidationError = {
  error: {
    message: string;
    errors: {
      formErrors: string[];
      fieldErrors: Record<string, string[]>;
    };
  };
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    const validationError: CustomInputValidationError = {
      error: {
        message: "Validation error",
        errors: flattenError(error),
      },
    };

    return res.status(422).json(validationError);
  }

  if (error instanceof SequelizeValidationError) {
    return res.status(422).json({
      error: {
        message: "Validation error",
        errors: error.errors.map((item) => ({
          field: item.path,
          message: item.message,
        })),
      },
    });
  }

  if (error instanceof ForeignKeyConstraintError) {
    return res.status(409).json({
      error: {
        message: "One or more referenced resources do not exist",
      },
    });
  }

  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({
      error: {
        message: "Duplicate value found",
      },
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }

  res.status(500).json({
    error: {
      message: getErrorMessage(error) || "An error occurred",
    },
  });
};

export default errorHandler;
