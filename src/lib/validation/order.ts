import { z } from "zod";

export const CreateOrderSchema = z.object({
    asset: z.string().min(3, "Asset name is too short ... "),
    type: z.enum(["buy", "sell"]),
    price: z.number().positive("Price must be positive."),
    quantity: z.number().positive("Quantity must be greater than 0"),
    expiration: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invallid date format",
    }),
});

