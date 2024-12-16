import prisma from "@/lib/prisma";
import { CreateOrderSchema } from "@/lib/validation/order";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = CreateOrderSchema.parse(body);
        // inserting into database
        const order = await prisma.order.create({
            data: {
                asset: data.asset,
                type: data.type,
                price: data.price,
                quantity: data.quantity,
                expirationDate: new Date(data.expiration),
            }
        });
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    message: "Validation Failed", 
                    errors: error.errors,
                },
                {
                    status: 400,
                }
            );
        }
        console.error("Error creating order:", error);
        return NextResponse.json({
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}



export async function GET(req: Request) {
    try {
        //@ts-ignore
        const { serachParams } = new URL(req.url);
        const asset = serachParams.get("asset");
        const type = serachParams.get("type");

        const orders = await prisma.order.findMany({
            where: {
                status: "active",
                ...(asset ? { asset } : {}),
                ...(type ? { type } : {}),
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(orders, { status: 200 });

    } catch (error) {
        console.error("Error fetching orders ... ", error);
        return NextResponse.json({
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}


