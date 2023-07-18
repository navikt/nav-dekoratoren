import z from "zod";

const paramsSchema = z.object({
  context: z
    .enum(["privatperson", "arbeidsgiver", "samarbeidspartner"])
    .default("privatperson"),
});

export function parseParams(params: any) {
  return paramsSchema.parse(params);
}
