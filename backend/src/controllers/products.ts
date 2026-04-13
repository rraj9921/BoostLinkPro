import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { supabase } from "../config/supabase.ts";
import multer from "multer";
import * as z from "zod";

// Store file in memory so we can upload to Supabase Storage
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
});

const createSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).default(""),
  price_cents: z.coerce.number().int().min(99), // min $0.99
  type: z.enum(["pdf", "video", "audio", "course", "template", "other"]),
});

export async function getAll(req: AuthRequest, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,description,price_cents,type,sales_count,is_active,file_url,created_at",
    )
    .eq("user_id", req.userId!)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ success: true, data });
}

export async function getPublic(req: Request, res: Response): Promise<void> {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price_cents,type,file_url,is_active,user_id")
    .eq("id", req.params.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    res.status(404).json({ error: "Product not found or inactive" });
    return;
  }

  res.json({ success: true, data });
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.flatten());
      res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
      return;
    }

    let file_url: string | null = null;

    // Upload file to Supabase Storage if provided
    const file = (req as any).file as Express.Multer.File | undefined;
    if (file) {
      const ext = file.originalname.split(".").pop() ?? "bin";
      const path = `${req.userId}/${Date.now()}.${ext}`;

      console.log("Uploading file to storage:", path);
      const { error: uploadError } = await supabase.storage
        .from("product-files")
        .upload(path, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        res.status(500).json({
          error: "File upload failed: " + uploadError.message,
        });
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-files")
        .getPublicUrl(path);
      file_url = urlData.publicUrl;
      console.log("File uploaded successfully:", file_url);
    }

    console.log("Creating product with data:", {
      ...parsed.data,
      user_id: req.userId,
      file_url,
    });

    const { data, error } = await supabase
      .from("products")
      .insert({
        ...parsed.data,
        user_id: req.userId,
        file_url,
        is_active: true,
        sales_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      res.status(500).json({
        error: "Failed to create product: " + error.message,
        details: error,
      });
      return;
    }

    console.log("Product created successfully:", data);
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    console.error("Unexpected error in create:", err);
    res.status(500).json({
      error: "An unexpected error occurred: " + err.message,
    });
  }
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  const parsed = createSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  // Check if product exists and belongs to user
  const { data: existing } = await supabase
    .from("products")
    .select("*")
    .eq("id", req.params.id)
    .eq("user_id", req.userId!)
    .maybeSingle();

  if (!existing) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  let file_url = existing.file_url;

  // Upload new file if provided
  const file = (req as any).file as Express.Multer.File | undefined;
  if (file) {
    // Delete old file if exists
    if (existing.file_url) {
      const oldPath = existing.file_url.split("/product-files/")[1];
      if (oldPath)
        await supabase.storage.from("product-files").remove([oldPath]);
    }

    const ext = file.originalname.split(".").pop() ?? "bin";
    const path = `${req.userId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("product-files")
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

    if (uploadError) {
      res
        .status(500)
        .json({ error: "File upload failed: " + uploadError.message });
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-files")
      .getPublicUrl(path);
    file_url = urlData.publicUrl;
  }

  const { data, error } = await supabase
    .from("products")
    .update({ ...parsed.data, file_url })
    .eq("id", req.params.id)
    .eq("user_id", req.userId!)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ success: true, data });
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  // Get file_url before deleting so we can clean up storage
  const { data: product } = await supabase
    .from("products")
    .select("file_url")
    .eq("id", req.params.id)
    .eq("user_id", req.userId!)
    .maybeSingle();

  if (!product) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  // Delete from storage if there's a file
  if (product.file_url) {
    const path = product.file_url.split("/product-files/")[1];
    if (path) await supabase.storage.from("product-files").remove([path]);
  }

  await supabase
    .from("products")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", req.userId!);
  res.json({ success: true });
}

export async function toggleActive(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const { data: cur } = await supabase
    .from("products")
    .select("is_active")
    .eq("id", req.params.id)
    .eq("user_id", req.userId!)
    .single();
  if (!cur) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const { data, error } = await supabase
    .from("products")
    .update({ is_active: !(cur.is_active as boolean) })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ success: true, data });
}
