import prisma from "@/lib/prisma";
import { deleteOrderSchema } from "@/lib/validation/order";
import { NextResponse } from "next/server";
import { z } from "zod";
export async function DELETE(req: Request, { params } : { params: { id: string }}) {
    try {
        const { id } = deleteOrderSchema.parse({ id: params.id });
        const order = await prisma.order.update({
            where: { id },
            data: { status: "cancelled" },
        });
        return NextResponse.json({ message: "Order Cancelled", order }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                message: "Validation Failed",
                errors: error.errors
            }, {
                status: 500
            });
        }
    }
}