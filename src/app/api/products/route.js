import { NextResponse } from "next/server";
import { connectDatabase } from "../../../lib/db";
import Product from "../../../models/Product";

export const runtime = "nodejs";

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stringValue(value = "") {
  return typeof value === "string" ? value : String(value ?? "");
}

export async function GET(request) {
  try {
    await connectDatabase();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const department = searchParams.get("department")?.trim();
    const subcategory = searchParams.get("subcategory")?.trim();
    const source = searchParams.get("source")?.trim();

    const requestedLimit = Number.parseInt(
      searchParams.get("limit") || "0",
      10,
    );

    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 100)
        : 0;

    const mode = searchParams.get("mode")?.trim();

    /*
      Customers only receive products that are active.

      $ne: false also keeps legacy products visible until the migration
      writes explicit isActive: true into every existing record.
    */
    const filter = {
      isActive: {
        $ne: false,
      },
    };

    if (search) {
      const safeSearch = escapeRegex(search);

      filter.$or = [
        {
          name: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          category: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          department: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          subcategory: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    if (category && category.toLowerCase() !== "all") {
      filter.newCategory = category.toLowerCase();
    }

    const validDepartments = [
      "ALL",
      "MEN",
      "WOMEN",
      "KIDS",
      "HOME",
      "ACCESSORIES",
    ];

    const normalizedDepartment = department?.toUpperCase();

    if (
      normalizedDepartment &&
      normalizedDepartment !== "ALL" &&
      validDepartments.includes(normalizedDepartment)
    ) {
      filter.department = normalizedDepartment;
    }

    if (subcategory) {
      filter.subcategory = subcategory.toLowerCase();
    }

    if (["INVENTORY", "VENDOR", "AMAZON"].includes(source)) {
      filter.source = source;
    }

    // Build query once
    let query = Product.find(filter);

    // Stats mode: only send minimal fields
    if (mode === "stats") {
      query = query.select("department price");
    }

    if (limit > 0) {
      query = query.limit(limit);
    }

    const products = await query
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json(
      {
        products,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      {
        message: error.message || "Unable to load products.",
      },
      {
        status: 500,
      },
    );
  }
}