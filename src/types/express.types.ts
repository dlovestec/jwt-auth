import { type Request } from "express";
import { z } from "zod";

export type InferRequest<
  TBody extends z.ZodType | undefined = undefined,
  TParams extends z.ZodType | undefined = undefined,
  TQuery extends z.ZodType | undefined = undefined,
  TCookies extends z.ZodType | undefined = undefined,
> = Request<
  TParams extends z.ZodType ? z.infer<TParams> : {},
  any,
  TBody extends z.ZodType ? z.infer<TBody> : {},
  TQuery extends z.ZodType ? z.infer<TQuery> : {}
> & {
  cookies: TCookies extends z.ZodType ? z.infer<TCookies> : Request["cookies"];
};
