import z from "zod";
export const SignUpInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).optional(),
});
export type SignUpInput = z.infer<typeof SignUpInput>;
export const SignInInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type SignInInput = z.infer<typeof SignInInput>;

export const CreateBloginput = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreateBloginput = z.infer<typeof CreateBloginput>;
export const UpdateBloginput = z.object({
  title: z.string(),
  content: z.number(),
});

export type UpdateBlogInput = z.infer<typeof UpdateBloginput>;
