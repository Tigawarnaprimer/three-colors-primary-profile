"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

type ProductStatus = "Aktif" | "Nonaktif";

type UploadedFile = {
  name: string;
  size: number;
  url: string;
  file?: File;
};

type Variant = {
  id: number;
  productId: number;
  code: string;
  color: string;
  colorHex: string;
  image: UploadedFile | null;
  status: ProductStatus;
  bestSeller: boolean;
  bestSellerOrder: number | null;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: UploadedFile | null;
  pdf: UploadedFile | null;
  status: ProductStatus;
  nomor: string | null;
  variants: Variant[];
};

type ProductForm = {
  name: string;
  description: string;
  image: UploadedFile | null;
  pdf: UploadedFile | null;
  status: ProductStatus;
};

type VariantForm = {
  productId: number;
  code: string;
  color: string;
  colorHex: string;
  image: UploadedFile | null;
  status: ProductStatus;
  bestSeller: boolean;
  bestSellerOrder: string;
};

const PRODUCT_BUCKET = "produk";
const VARIANT_BUCKET = "varian-produk";
const PDF_BUCKET = "dokumen-produk";

export default function AdminProduk() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProductId, setSelectedProductId] =
    useState<number | null>(null);

  const [showProductForm, setShowProductForm] =
    useState(false);

  const [showVariantForm, setShowVariantForm] =
    useState(false);

  const [editingProductId, setEditingProductId] =
    useState<number | null>(null);

  const [editingVariantId, setEditingVariantId] =
    useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  const [saving, setSaving] = useState(false);

  const [productForm, setProductForm] =
    useState<ProductForm>({
      name: "",
      description: "",
      image: null,
      pdf: null,
      status: "Aktif",
    });

  const [variantForm, setVariantForm] =
    useState<VariantForm>({
      productId: 0,
      code: "",
      color: "",
      colorHex: "#2563EB",
      image: null,
      status: "Aktif",
      bestSeller: false,
      bestSellerOrder: "",
    });

  useEffect(() => {
    loadProducts();
  }, []);

  /*
  =========================================================
  MESSAGE
  =========================================================
  */

  const showMessage = (
    text: string,
    type: "success" | "error" = "success"
  ) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  /*
  =========================================================
  LOAD PRODUCTS
  =========================================================
  */

  async function loadProducts() {
    setLoading(true);

    try {
      /*
      Ambil produk secara terpisah.
      Tidak menggunakan nested relation agar lebih aman
      jika relasi Supabase belum terdeteksi.
      */

      const {
        data: productData,
        error: productError,
      } = await supabase
        .from("produk")
        .select(
          `
            id,
            nama,
            slug,
            deskripsi,
            gambar_url,
            pdf_url,
            nomor,
            status
          `
        )
        .order("id", {
          ascending: true,
        });

      if (productError) {
        console.error(
          "Gagal mengambil data produk:",
          productError
        );

        showMessage(
          productError.message ||
            "Gagal mengambil data produk.",
          "error"
        );

        setProducts([]);
        return;
      }

      /*
      Ambil semua varian secara terpisah.
      */

      const {
        data: variantData,
        error: variantError,
      } = await supabase
        .from("varian_produk")
        .select(
          `
            id,
            produk_id,
            kode,
            warna,
            warna_hex,
            gambar_url,
            status,
            best_seller,
            urutan_best_seller
          `
        )
        .order("id", {
          ascending: true,
        });

      if (variantError) {
        console.error(
          "Gagal mengambil data varian:",
          variantError
        );

        showMessage(
          variantError.message ||
            "Gagal mengambil data varian.",
          "error"
        );

        setProducts([]);
        return;
      }

      /*
      Gabungkan produk dan varian di frontend.
      */

      const mappedProducts: Product[] = (
        productData ?? []
      ).map((product, index) => {
        const productVariants = (
          variantData ?? []
        ).filter(
          (variant) =>
            variant.produk_id === product.id
        );

        return {
          id: product.id,
          name: product.nama,
          slug: product.slug,
          description: product.deskripsi,

          image: product.gambar_url
            ? {
                name:
                  product.gambar_url
                    .split("/")
                    .pop() ||
                  "product-image.jpg",
                size: 0,
                url: product.gambar_url,
              }
            : null,

          pdf: product.pdf_url
            ? {
                name:
                  product.pdf_url
                    .split("/")
                    .pop() ||
                  "product.pdf",
                size: 0,
                url: product.pdf_url,
              }
            : null,

          status:
            product.status as ProductStatus,

          nomor:
            product.nomor ??
            String(index + 1).padStart(2, "0"),

          variants:
            productVariants.map(
              (variant) => ({
                id: variant.id,
                productId:
                  variant.produk_id,

                code: variant.kode,

                color:
                  variant.warna ?? "",

                colorHex:
                  variant.warna_hex ??
                  "#2563EB",

                image:
                  variant.gambar_url
                    ? {
                        name:
                          variant.gambar_url
                            .split("/")
                            .pop() ||
                          "variant-image.jpg",
                        size: 0,
                        url: variant.gambar_url,
                      }
                    : null,

                status:
                  variant.status as ProductStatus,

                bestSeller:
                  Boolean(
                    variant.best_seller
                  ),

                bestSellerOrder:
                  variant.urutan_best_seller,
              })
            ),
        };
      });

      setProducts(mappedProducts);
    } catch (error) {
      console.error(
        "Terjadi kesalahan saat mengambil produk:",
        error
      );

      showMessage(
        "Terjadi kesalahan saat mengambil data produk.",
        "error"
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  /*
  =========================================================
  SELECTED PRODUCT
  =========================================================
  */

  const selectedProduct = products.find(
    (product) =>
      product.id === selectedProductId
  );

  /*
  =========================================================
  BEST SELLER
  =========================================================
  */

  const bestSellerVariants = products
    .flatMap((product) =>
      product.variants.map((variant) => ({
        ...variant,
        productName: product.name,
      }))
    )
    .filter(
      (variant) =>
        variant.bestSeller &&
        variant.status === "Aktif" &&
        variant.bestSellerOrder !== null
    )
    .sort(
      (a, b) =>
        (a.bestSellerOrder ?? 999) -
        (b.bestSellerOrder ?? 999)
    );

  /*
  =========================================================
  RESET FORM
  =========================================================
  */

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      image: null,
      pdf: null,
      status: "Aktif",
    });

    setEditingProductId(null);
  };

  const resetVariantForm = () => {
    setVariantForm({
      productId:
        selectedProductId ?? 0,
      code: "",
      color: "",
      colorHex: "#2563EB",
      image: null,
      status: "Aktif",
      bestSeller: false,
      bestSellerOrder: "",
    });

    setEditingVariantId(null);
  };

  /*
  =========================================================
  OPEN FORM
  =========================================================
  */

  const openAddProduct = () => {
    resetProductForm();
    setShowProductForm(true);
    setShowVariantForm(false);
  };

  const openEditProduct = (
    product: Product
  ) => {
    setProductForm({
      name: product.name,
      description: product.description,
      image: product.image,
      pdf: product.pdf,
      status: product.status,
    });

    setEditingProductId(product.id);

    setShowProductForm(true);
    setShowVariantForm(false);
  };

  const openAddVariant = (
    productId: number
  ) => {
    setSelectedProductId(productId);

    setVariantForm({
      productId,
      code: "",
      color: "",
      colorHex: "#2563EB",
      image: null,
      status: "Aktif",
      bestSeller: false,
      bestSellerOrder: "",
    });

    setEditingVariantId(null);

    setShowVariantForm(true);
    setShowProductForm(false);
  };

  const openEditVariant = (
    variant: Variant
  ) => {
    setVariantForm({
      productId: variant.productId,
      code: variant.code,
      color: variant.color,
      colorHex: variant.colorHex,
      image: variant.image,
      status: variant.status,
      bestSeller: variant.bestSeller,
      bestSellerOrder:
        variant.bestSellerOrder !== null
          ? String(
              variant.bestSellerOrder
            )
          : "",
    });

    setSelectedProductId(
      variant.productId
    );

    setEditingVariantId(
      variant.id
    );

    setShowVariantForm(true);
    setShowProductForm(false);
  };

  /*
  =========================================================
  SLUG
  =========================================================
  */

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  /*
  =========================================================
  UPLOAD FILE
  =========================================================
  */

  async function uploadFile(
    file: File,
    bucket: string,
    folder: string
  ) {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "file";

    const safeName =
      file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(
          /^-+|-+$/g,
          ""
        ) || "file";

    const filePath =
      `${folder}/${Date.now()}-${safeName}.${extension}`;

    const {
      error,
    } = await supabase.storage
      .from(bucket)
      .upload(
        filePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    if (error) {
      console.error(
        "Upload gagal:",
        error
      );

      throw new Error(
        error.message
      );
    }

    const {
      data,
    } = supabase.storage
      .from(bucket)
      .getPublicUrl(
        filePath
      );

    return {
      name: file.name,
      size: file.size,
      url: data.publicUrl,
      path: filePath,
    };
  }

  /*
  =========================================================
  DELETE STORAGE FILE
  =========================================================
  */

  async function deleteStorageFile(
    bucket: string,
    publicUrl: string
  ) {
    if (!publicUrl) return;

    try {
      const marker =
        `/storage/v1/object/public/${bucket}/`;

      const index =
        publicUrl.indexOf(marker);

      if (index === -1) {
        return;
      }

      const path =
        decodeURIComponent(
          publicUrl.substring(
            index + marker.length
          )
        );

      const {
        error,
      } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        console.error(
          "Gagal menghapus file:",
          error
        );
      }
    } catch (error) {
      console.error(
        "Gagal menghapus file storage:",
        error
      );
    }
  }

  /*
  =========================================================
  PRODUCT SUBMIT
  =========================================================
  */

  async function handleProductSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !productForm.name.trim()
    ) {
      showMessage(
        "Nama produk wajib diisi.",
        "error"
      );
      return;
    }

    if (
      !productForm.description.trim()
    ) {
      showMessage(
        "Deskripsi produk wajib diisi.",
        "error"
      );
      return;
    }

    setSaving(true);

    let newUploadedImageUrl:
      string | null = null;

    let newUploadedPdfUrl:
      string | null = null;

    try {
      const oldProduct =
        editingProductId !== null
          ? products.find(
              (product) =>
                product.id ===
                editingProductId
            )
          : null;

      let imageUrl =
        productForm.image?.url ??
        null;

      let pdfUrl =
        productForm.pdf?.url ??
        null;

      /*
      Upload gambar baru
      */

      if (
        productForm.image?.file
      ) {
        const uploaded =
          await uploadFile(
            productForm.image.file,
            PRODUCT_BUCKET,
            "produk"
          );

        imageUrl =
          uploaded.url;

        newUploadedImageUrl =
          uploaded.url;
      }

      /*
      Upload PDF baru
      */

      if (
        productForm.pdf?.file
      ) {
        const uploaded =
          await uploadFile(
            productForm.pdf.file,
            PDF_BUCKET,
            "dokumen"
          );

        pdfUrl =
          uploaded.url;

        newUploadedPdfUrl =
          uploaded.url;
      }

      /*
      EDIT PRODUK
      */

      if (
        editingProductId !== null
      ) {
        const {
          error,
        } = await supabase
          .from("produk")
          .update({
            nama:
              productForm.name.trim(),

            slug: slugify(
              productForm.name
            ),

            deskripsi:
              productForm.description.trim(),

            gambar_url:
              imageUrl,

            pdf_url:
              pdfUrl,

            status:
              productForm.status,

            diperbarui_pada:
              new Date().toISOString(),
          })
          .eq(
            "id",
            editingProductId
          );

        if (error) {
          throw new Error(
            error.message
          );
        }

        /*
        Hapus gambar lama
        jika diganti/dihapus
        */

        if (
          oldProduct?.image?.url &&
          oldProduct.image.url !==
            imageUrl
        ) {
          await deleteStorageFile(
            PRODUCT_BUCKET,
            oldProduct.image.url
          );
        }

        /*
        Hapus PDF lama
        jika diganti/dihapus
        */

        if (
          oldProduct?.pdf?.url &&
          oldProduct.pdf.url !==
            pdfUrl
        ) {
          await deleteStorageFile(
            PDF_BUCKET,
            oldProduct.pdf.url
          );
        }

        showMessage(
          "Data produk berhasil diperbarui."
        );
      }

      /*
      TAMBAH PRODUK
      */

      else {
        const nomor =
          String(
            products.length + 1
          ).padStart(2, "0");

        const {
          error,
        } = await supabase
          .from("produk")
          .insert({
            nama:
              productForm.name.trim(),

            slug: slugify(
              productForm.name
            ),

            deskripsi:
              productForm.description.trim(),

            gambar_url:
              imageUrl,

            pdf_url:
              pdfUrl,

            nomor,

            status:
              productForm.status,
          });

        if (error) {
          throw new Error(
            error.message
          );
        }

        showMessage(
          "Produk berhasil ditambahkan."
        );
      }

      resetProductForm();
      setShowProductForm(false);

      await loadProducts();
    } catch (error) {
      console.error(
        "Gagal menyimpan produk:",
        error
      );

      /*
      Jika database gagal,
      hapus file yang baru saja
      berhasil di-upload.
      */

      if (
        newUploadedImageUrl
      ) {
        await deleteStorageFile(
          PRODUCT_BUCKET,
          newUploadedImageUrl
        );
      }

      if (
        newUploadedPdfUrl
      ) {
        await deleteStorageFile(
          PDF_BUCKET,
          newUploadedPdfUrl
        );
      }

      showMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan produk.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  =========================================================
  VARIANT SUBMIT
  =========================================================
  */

  async function handleVariantSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !variantForm.productId
    ) {
      showMessage(
        "Pilih produk terlebih dahulu.",
        "error"
      );
      return;
    }

    if (
      !variantForm.code.trim()
    ) {
      showMessage(
        "Kode produk wajib diisi.",
        "error"
      );
      return;
    }

    setSaving(true);

    let newUploadedImageUrl:
      string | null = null;

    try {
      let imageUrl =
        variantForm.image?.url ??
        null;

      const oldVariant =
        editingVariantId !== null
          ? products
              .flatMap(
                (product) =>
                  product.variants
              )
              .find(
                (variant) =>
                  variant.id ===
                  editingVariantId
              )
          : null;

      /*
      Upload gambar varian
      */

      if (
        variantForm.image?.file
      ) {
        const uploaded =
          await uploadFile(
            variantForm.image.file,
            VARIANT_BUCKET,
            "varian"
          );

        imageUrl =
          uploaded.url;

        newUploadedImageUrl =
          uploaded.url;
      }

      /*
      Best Seller
      */

      const bestSellerOrder =
        variantForm.bestSeller
          ? Number(
              variantForm.bestSellerOrder
            ) || 1
          : null;

      /*
      EDIT VARIAN
      */

      if (
        editingVariantId !== null
      ) {
        const {
          error,
        } = await supabase
          .from("varian_produk")
          .update({
            produk_id:
              variantForm.productId,

            kode:
              variantForm.code.trim(),

            warna:
              variantForm.color.trim(),

            warna_hex:
              variantForm.colorHex,

            gambar_url:
              imageUrl,

            status:
              variantForm.status,

            best_seller:
              variantForm.bestSeller,

            urutan_best_seller:
              bestSellerOrder,

            diperbarui_pada:
              new Date().toISOString(),
          })
          .eq(
            "id",
            editingVariantId
          );

        if (error) {
          throw new Error(
            error.message
          );
        }

        /*
        Hapus gambar lama
        jika diganti/dihapus
        */

        if (
          oldVariant?.image?.url &&
          oldVariant.image.url !==
            imageUrl
        ) {
          await deleteStorageFile(
            VARIANT_BUCKET,
            oldVariant.image.url
          );
        }

        showMessage(
          "Varian produk berhasil diperbarui."
        );
      }

      /*
      TAMBAH VARIAN
      */

      else {
        const {
          error,
        } = await supabase
          .from("varian_produk")
          .insert({
            produk_id:
              variantForm.productId,

            kode:
              variantForm.code.trim(),

            warna:
              variantForm.color.trim(),

            warna_hex:
              variantForm.colorHex,

            gambar_url:
              imageUrl,

            status:
              variantForm.status,

            best_seller:
              variantForm.bestSeller,

            urutan_best_seller:
              bestSellerOrder,
          });

        if (error) {
          throw new Error(
            error.message
          );
        }

        showMessage(
          "Varian produk berhasil ditambahkan."
        );
      }

      resetVariantForm();
      setShowVariantForm(false);

      await loadProducts();
    } catch (error) {
      console.error(
        "Gagal menyimpan varian:",
        error
      );

      if (
        newUploadedImageUrl
      ) {
        await deleteStorageFile(
          VARIANT_BUCKET,
          newUploadedImageUrl
        );
      }

      showMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan varian.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  =========================================================
  DELETE PRODUCT
  =========================================================
  */

  async function deleteProduct(
    id: number
  ) {
    const product =
      products.find(
        (item) =>
          item.id === id
      );

    if (!product) {
      return;
    }

    const confirmed =
      window.confirm(
        `Hapus produk "${product.name}" beserta seluruh variannya?`
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);

    try {
      const {
        error,
      } = await supabase
        .from("produk")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(
          error.message
        );
      }

      /*
      Hapus gambar produk
      */

      if (
        product.image?.url
      ) {
        await deleteStorageFile(
          PRODUCT_BUCKET,
          product.image.url
        );
      }

      /*
      Hapus PDF
      */

      if (
        product.pdf?.url
      ) {
        await deleteStorageFile(
          PDF_BUCKET,
          product.pdf.url
        );
      }

      /*
      Hapus gambar semua varian
      */

      for (
        const variant of
        product.variants
      ) {
        if (
          variant.image?.url
        ) {
          await deleteStorageFile(
            VARIANT_BUCKET,
            variant.image.url
          );
        }
      }

      if (
        selectedProductId === id
      ) {
        setSelectedProductId(
          null
        );
      }

      showMessage(
        "Produk berhasil dihapus."
      );

      await loadProducts();
    } catch (error) {
      console.error(
        "Gagal menghapus produk:",
        error
      );

      showMessage(
        error instanceof Error
          ? error.message
          : "Gagal menghapus produk.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  =========================================================
  DELETE VARIANT
  =========================================================
  */

  async function deleteVariant(
    productId: number,
    variantId: number
  ) {
    const product =
      products.find(
        (item) =>
          item.id === productId
      );

    const variant =
      product?.variants.find(
        (item) =>
          item.id === variantId
      );

    if (!variant) {
      return;
    }

    const confirmed =
      window.confirm(
        `Hapus varian "${variant.code}"?`
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);

    try {
      const {
        error,
      } = await supabase
        .from("varian_produk")
        .delete()
        .eq(
          "id",
          variantId
        );

      if (error) {
        throw new Error(
          error.message
        );
      }

      if (
        variant.image?.url
      ) {
        await deleteStorageFile(
          VARIANT_BUCKET,
          variant.image.url
        );
      }

      showMessage(
        "Varian produk berhasil dihapus."
      );

      await loadProducts();
    } catch (error) {
      console.error(
        "Gagal menghapus varian:",
        error
      );

      showMessage(
        error instanceof Error
          ? error.message
          : "Gagal menghapus varian.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  =========================================================
  PRODUCT IMAGE
  =========================================================
  */

  const handleProductImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      showMessage(
        "File harus berupa gambar.",
        "error"
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      showMessage(
        "Ukuran gambar maksimal 5 MB.",
        "error"
      );
      return;
    }

    const url =
      URL.createObjectURL(
        file
      );

    setProductForm(
      (current) => ({
        ...current,

        image: {
          name: file.name,
          size: file.size,
          url,
          file,
        },
      })
    );
  };

  /*
  =========================================================
  VARIANT IMAGE
  =========================================================
  */

  const handleVariantImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      showMessage(
        "File harus berupa gambar.",
        "error"
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      showMessage(
        "Ukuran gambar maksimal 5 MB.",
        "error"
      );
      return;
    }

    const url =
      URL.createObjectURL(
        file
      );

    setVariantForm(
      (current) => ({
        ...current,

        image: {
          name: file.name,
          size: file.size,
          url,
          file,
        },
      })
    );
  };

  /*
  =========================================================
  PDF
  =========================================================
  */

  const handlePdfChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      showMessage(
        "File yang dipilih harus berformat PDF.",
        "error"
      );
      return;
    }

    if (
      file.size >
      20 * 1024 * 1024
    ) {
      showMessage(
        "Ukuran PDF maksimal 20 MB.",
        "error"
      );
      return;
    }

    const url =
      URL.createObjectURL(
        file
      );

    setProductForm(
      (current) => ({
        ...current,

        pdf: {
          name: file.name,
          size: file.size,
          url,
          file,
        },
      })
    );
  };

  /*
  =========================================================
  REMOVE FILE
  =========================================================
  */

  const removeProductImage =
    () => {
      setProductForm(
        (current) => ({
          ...current,
          image: null,
        })
      );
    };

  const removeProductPdf =
    () => {
      setProductForm(
        (current) => ({
          ...current,
          pdf: null,
        })
      );
    };

  const removeVariantImage =
    () => {
      setVariantForm(
        (current) => ({
          ...current,
          image: null,
        })
      );
    };

  /*
  =========================================================
  RETURN
  =========================================================
  */

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        {/* HEADER */}

        <header className="h-20 bg-white border-b border-gray-200">
          <div className="h-full px-6 lg:px-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
                Admin Panel
              </p>

              <h1 className="mt-1 text-lg font-bold text-blue-950">
                Kelola Produk
              </h1>
            </div>

            
          </div>
        </header>

        <section className="px-6 lg:px-8 py-8 max-w-7xl">
          {/* INTRO */}
<div className="mb-7 relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm">
  {/* Decorative background */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
  <div className="absolute bottom-0 right-24 w-32 h-32 bg-yellow-50 rounded-full blur-2xl translate-y-1/2" />

  <div className="relative px-6 md:px-8 py-7">
    <div className="flex items-start gap-4">
      {/* Accent */}
      <div className="hidden sm:block w-1.5 min-h-[90px] rounded-full bg-blue-700 shrink-0" />

      <div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[11px] font-bold tracking-[0.15em] text-blue-700 uppercase">
            Produk Website
          </span>

          <span className="hidden sm:block h-1 w-1 rounded-full bg-yellow-400" />
          <span className="hidden sm:block text-xs text-gray-400">
            Manajemen Konten
          </span>
        </div>

        <h2 className="mt-3 text-2xl md:text-3xl font-bold text-blue-950 tracking-tight">
          Produk & Varian
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500 max-w-2xl">
          Kelola informasi produk, gambar, dokumen PDF,
          varian, serta produk Best Seller yang ditampilkan
          pada website.
        </p>
      </div>
    </div>
  </div>
</div>

          {/* MESSAGE */}

          {message && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 ${
                messageType ===
                "success"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  messageType ===
                  "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {messageType ===
                "success"
                  ? "✓"
                  : "!"}
              </div>

              <p
                className={`text-sm font-semibold ${
                  messageType ===
                  "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {message}
              </p>
            </div>
          )}

          {/* LOADING */}

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <div className="w-8 h-8 border-2 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto" />

              <p className="mt-4 text-sm font-semibold text-gray-500">
                Memuat data produk...
              </p>
            </div>
          ) : (
            <>
              {/* SUMMARY */}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
                <SummaryCard
                  label="Total Produk"
                  value={
                    products.length
                  }
                  description="Kategori produk"
                  type="blue"
                />

                <SummaryCard
                  label="Total Varian"
                  value={products.reduce(
                    (
                      total,
                      product
                    ) =>
                      total +
                      product
                        .variants
                        .length,
                    0
                  )}
                  description="Varian produk"
                  type="yellow"
                />

                <SummaryCard
                  label="Best Seller"
                  value={
                    bestSellerVariants.length
                  }
                  description="Varian ditampilkan"
                  type="red"
                />

                <SummaryCard
                  label="Produk Aktif"
                  value={
                    products.filter(
                      (
                        product
                      ) =>
                        product.status ===
                        "Aktif"
                    ).length
                  }
                  description="Status aktif"
                  type="navy"
                />
              </div>

{/* ACTION */}
<div className="flex justify-end mb-7">
  <button
    type="button"
    onClick={openAddProduct}
    className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
  >
    <span className="text-lg leading-none">
      +
    </span>
    Tambah Produk
  </button>
</div>
              {/* PRODUCT FORM */}

              {showProductForm && (
                <div className="mb-7 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 md:px-8 py-5 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
                        {editingProductId
                          ? "Edit Produk"
                          : "Produk Baru"}
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-blue-950">
                        {editingProductId
                          ? "Edit Informasi Produk"
                          : "Tambah Produk"}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        resetProductForm();
                        setShowProductForm(
                          false
                        );
                      }}
                      className="text-sm font-semibold text-gray-500 hover:text-red-500"
                    >
                      Tutup
                    </button>
                  </div>

                  <form
                    onSubmit={
                      handleProductSubmit
                    }
                    className="p-6 md:p-8"
                  >
                    <div className="grid lg:grid-cols-[1fr_300px] gap-7">
                      <div>
                        <div className="grid md:grid-cols-2 gap-5">
                          <Input
                            label="Nama Produk"
                            value={
                              productForm.name
                            }
                            onChange={(
                              value
                            ) =>
                              setProductForm(
                                (
                                  current
                                ) => ({
                                  ...current,
                                  name: value,
                                })
                              )
                            }
                            placeholder="Contoh: Reactive Dye"
                          />

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Status
                            </label>

                            <select
                              value={
                                productForm.status
                              }
                              onChange={(
                                e
                              ) =>
                                setProductForm(
                                  (
                                    current
                                  ) => ({
                                    ...current,
                                    status:
                                      e.target
                                        .value as ProductStatus,
                                  })
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                            >
                              <option value="Aktif">
                                Aktif
                              </option>

                              <option value="Nonaktif">
                                Nonaktif
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-5">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Deskripsi Produk
                          </label>

                          <textarea
                            value={
                              productForm.description
                            }
                            onChange={(
                              e
                            ) =>
                              setProductForm(
                                (
                                  current
                                ) => ({
                                  ...current,
                                  description:
                                    e.target
                                      .value,
                                })
                              )
                            }
                            rows={6}
                            placeholder="Masukkan deskripsi produk..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        <div className="mt-6">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Dokumen Produk
                          </label>

                          <PdfUpload
                            file={
                              productForm.pdf
                            }
                            onChange={
                              handlePdfChange
                            }
                            onRemove={
                              removeProductPdf
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Gambar Produk
                        </label>

                        <ImageUpload
                          file={
                            productForm.image
                          }
                          onChange={
                            handleProductImageChange
                          }
                          onRemove={
                            removeProductImage
                          }
                          height="h-[280px]"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          resetProductForm();
                          setShowProductForm(
                            false
                          );
                        }}
                        className="px-5 py-3 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        Batal
                      </button>

                      <button
                        type="submit"
                        disabled={
                          saving
                        }
                        className="px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold disabled:opacity-60"
                      >
                        {saving
                          ? "Menyimpan..."
                          : editingProductId
                          ? "Simpan Perubahan"
                          : "Tambah Produk"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* PRODUCT LIST */}

              {products.length ===
              0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <ImageIcon />
                  </div>

                  <p className="mt-4 text-sm font-bold text-blue-950">
                    Belum ada produk
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Tambahkan produk
                    pertama untuk
                    ditampilkan pada
                    website.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {products.map(
                    (
                      product,
                      index
                    ) => {
                      const isOpen =
                        selectedProductId ===
                        product.id;

                      return (
                        <div
                          key={
                            product.id
                          }
                          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                        >
                          {/* PRODUCT HEADER */}

                          <div className="p-5 md:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                              <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                {product.image ? (
                                  <img
                                    src={
                                      product
                                        .image
                                        .url
                                    }
                                    alt={
                                      product.name
                                    }
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                    <ImageIcon />

                                    <span className="text-[10px] mt-1">
                                      Belum
                                      ada
                                      gambar
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-bold text-blue-700">
                                    {product.nomor ??
                                      String(
                                        index +
                                          1
                                      ).padStart(
                                        2,
                                        "0"
                                      )}
                                  </span>

                                  <h3 className="text-lg font-bold text-blue-950">
                                    {
                                      product.name
                                    }
                                  </h3>

                                  <StatusBadge
                                    status={
                                      product.status
                                    }
                                  />
                                </div>

                                <p className="mt-2 text-sm text-gray-500 leading-6 max-w-3xl">
                                  {
                                    product.description
                                  }
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                                  <span className="text-gray-500">
                                    {
                                      product
                                        .variants
                                        .length
                                    }{" "}
                                    varian
                                  </span>

                                  <span className="text-gray-300">
                                    |
                                  </span>

                                  <span className="text-gray-500">
                                    PDF:{" "}
                                    <span className="font-semibold text-blue-700">
                                      {product.pdf
                                        ? product
                                            .pdf
                                            .name
                                        : "Belum tersedia"}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedProductId(
                                      isOpen
                                        ? null
                                        : product.id
                                    )
                                  }
                                  className="px-4 py-2.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100"
                                >
                                  {isOpen
                                    ? "Tutup Varian"
                                    : "Kelola Varian"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditProduct(
                                      product
                                    )
                                  }
                                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteProduct(
                                      product.id
                                    )
                                  }
                                  disabled={
                                    saving
                                  }
                                  className="px-3 py-2.5 rounded-lg text-red-500 text-sm font-semibold hover:bg-red-50 disabled:opacity-50"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* VARIANT AREA */}

                          {isOpen && (
                            <div className="border-t border-gray-200 bg-gray-50/70">
                              <div className="px-5 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                  <p className="text-xs font-bold tracking-[0.15em] text-blue-700 uppercase">
                                    Varian Produk
                                  </p>

                                  <h4 className="mt-1 text-base font-bold text-blue-950">
                                    {
                                      product.name
                                    }
                                  </h4>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    openAddVariant(
                                      product.id
                                    )
                                  }
                                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-blue-950 text-sm font-bold"
                                >
                                  <span className="text-lg leading-none">
                                    +
                                  </span>

                                  Tambah Varian
                                </button>
                              </div>

                              {product
                                .variants
                                .length ===
                              0 ? (
                                <div className="px-5 md:px-6 pb-6">
                                  <div className="bg-white border border-dashed border-gray-300 rounded-xl px-5 py-8 text-center">
                                    <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                                      <LayersIcon />
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-gray-600">
                                      Belum ada
                                      varian
                                      produk.
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                      Tambahkan
                                      varian
                                      untuk
                                      mengelola
                                      warna dan
                                      Best
                                      Seller.
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="px-5 md:px-6 pb-6 space-y-3">
                                  {product.variants.map(
                                    (
                                      variant,
                                      variantIndex
                                    ) => (
                                      <div
                                        key={
                                          variant.id
                                        }
                                        className="bg-white border border-gray-200 rounded-xl p-4"
                                      >
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                          <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                                            {variant.image ? (
                                              <img
                                                src={
                                                  variant
                                                    .image
                                                    .url
                                                }
                                                alt={
                                                  variant.color
                                                }
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center">
                                                <div
                                                  className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                                                  style={{
                                                    backgroundColor:
                                                      variant.colorHex,
                                                  }}
                                                />
                                              </div>
                                            )}
                                          </div>

                                          <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                              <span className="text-xs font-bold text-gray-400">
                                                {String(
                                                  variantIndex +
                                                    1
                                                ).padStart(
                                                  2,
                                                  "0"
                                                )}
                                              </span>

                                              <h5 className="font-bold text-blue-950">
                                                {variant.color ||
                                                  "Warna belum diisi"}
                                              </h5>

                                              <span className="text-xs font-semibold text-gray-500">
                                                {
                                                  variant.code
                                                }
                                              </span>

                                              <StatusBadge
                                                status={
                                                  variant.status
                                                }
                                              />

                                              {variant.bestSeller && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[11px] font-bold">
                                                  Best
                                                  Seller
                                                  #
                                                  {
                                                    variant.bestSellerOrder
                                                  }
                                                </span>
                                              )}
                                            </div>

                                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                                              <span>
                                                Warna:{" "}
                                                <span className="font-semibold">
                                                  {
                                                    variant.colorHex
                                                  }
                                                </span>
                                              </span>

                                              <span className="text-gray-300">
                                                |
                                              </span>

                                              <span>
                                                Gambar:{" "}
                                                <span className="font-semibold">
                                                  {variant.image
                                                    ? "Ada"
                                                    : "Belum ada"}
                                                </span>
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                openEditVariant(
                                                  variant
                                                )
                                              }
                                              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                                            >
                                              Edit
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() =>
                                                deleteVariant(
                                                  product.id,
                                                  variant.id
                                                )
                                              }
                                              disabled={
                                                saving
                                              }
                                              className="px-3 py-2 rounded-lg text-red-500 text-sm font-semibold hover:bg-red-50 disabled:opacity-50"
                                            >
                                              Hapus
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              )}

              {/* VARIANT FORM */}

              {showVariantForm && (
                <div className="mt-7 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 md:px-8 py-5 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold tracking-[0.18em] text-yellow-600 uppercase">
                        {editingVariantId
                          ? "Edit Varian"
                          : "Varian Baru"}
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-blue-950">
                        {editingVariantId
                          ? "Edit Varian Produk"
                          : "Tambah Varian Produk"}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        resetVariantForm();
                        setShowVariantForm(
                          false
                        );
                      }}
                      className="text-sm font-semibold text-gray-500 hover:text-red-500"
                    >
                      Tutup
                    </button>
                  </div>

                  <form
                    onSubmit={
                      handleVariantSubmit
                    }
                    className="p-6 md:p-8"
                  >
                    <div className="grid lg:grid-cols-[1fr_280px] gap-7">
                      <div>
                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Produk
                            </label>

                            <select
                              value={
                                variantForm.productId
                              }
                              onChange={(
                                e
                              ) =>
                                setVariantForm(
                                  (
                                    current
                                  ) => ({
                                    ...current,
                                    productId:
                                      Number(
                                        e.target
                                          .value
                                      ),
                                  })
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                            >
                              <option value={0}>
                                Pilih Produk
                              </option>

                              {products.map(
                                (
                                  product
                                ) => (
                                  <option
                                    key={
                                      product.id
                                    }
                                    value={
                                      product.id
                                    }
                                  >
                                    {
                                      product.name
                                    }
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          <Input
                            label="Kode Produk"
                            value={
                              variantForm.code
                            }
                            onChange={(
                              value
                            ) =>
                              setVariantForm(
                                (
                                  current
                                ) => ({
                                  ...current,
                                  code: value,
                                })
                              )
                            }
                            placeholder="Contoh: TSE-4G 211#"
                          />

                          <Input
                            label="Nama / Warna"
                            value={
                              variantForm.color
                            }
                            onChange={(
                              value
                            ) =>
                              setVariantForm(
                                (
                                  current
                                ) => ({
                                  ...current,
                                  color: value,
                                })
                              )
                            }
                            placeholder="Contoh: Yellow"
                          />

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Kode Warna
                            </label>

                            <div className="flex gap-3">
                              <input
                                type="color"
                                value={
                                  variantForm.colorHex
                                }
                                onChange={(
                                  e
                                ) =>
                                  setVariantForm(
                                    (
                                      current
                                    ) => ({
                                      ...current,
                                      colorHex:
                                        e.target
                                          .value,
                                    })
                                  )
                                }
                                className="w-14 h-12 p-1 border border-gray-300 rounded-lg bg-white cursor-pointer"
                              />

                              <input
                                type="text"
                                value={
                                  variantForm.colorHex
                                }
                                onChange={(
                                  e
                                ) =>
                                  setVariantForm(
                                    (
                                      current
                                    ) => ({
                                      ...current,
                                      colorHex:
                                        e.target
                                          .value,
                                    })
                                  )
                                }
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                                placeholder="#2563EB"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Status
                            </label>

                            <select
                              value={
                                variantForm.status
                              }
                              onChange={(
                                e
                              ) =>
                                setVariantForm(
                                  (
                                    current
                                  ) => ({
                                    ...current,
                                    status:
                                      e.target
                                        .value as ProductStatus,
                                  })
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                            >
                              <option value="Aktif">
                                Aktif
                              </option>

                              <option value="Nonaktif">
                                Nonaktif
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* BEST SELLER */}

                        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-5">
                          <div className="flex items-start gap-3">
                            <input
                              id="bestSeller"
                              type="checkbox"
                              checked={
                                variantForm.bestSeller
                              }
                              onChange={(
                                e
                              ) =>
                                setVariantForm(
                                  (
                                    current
                                  ) => ({
                                    ...current,
                                    bestSeller:
                                      e.target
                                        .checked,
                                    bestSellerOrder:
                                      e.target
                                        .checked
                                        ? current.bestSellerOrder ||
                                          "1"
                                        : "",
                                  })
                                )
                              }
                              className="mt-1 w-4 h-4 accent-blue-700"
                            />

                            <div className="flex-1">
                              <label
                                htmlFor="bestSeller"
                                className="block text-sm font-bold text-blue-950 cursor-pointer"
                              >
                                Tampilkan sebagai Best
                                Seller
                              </label>

                              <p className="mt-1 text-xs text-gray-500">
                                Varian ini akan
                                ditampilkan pada
                                bagian Best Seller
                                di halaman Beranda.
                              </p>
                            </div>
                          </div>

                          {variantForm.bestSeller && (
                            <div className="mt-4 pl-7">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Urutan Best Seller
                              </label>

                              <input
                                type="number"
                                min="1"
                                value={
                                  variantForm.bestSellerOrder
                                }
                                onChange={(
                                  e
                                ) =>
                                  setVariantForm(
                                    (
                                      current
                                    ) => ({
                                      ...current,
                                      bestSellerOrder:
                                        e.target
                                          .value,
                                    })
                                  )
                                }
                                className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                                placeholder="Contoh: 1"
                              />

                              <p className="mt-2 text-xs text-gray-400">
                                Angka lebih kecil akan
                                tampil lebih dahulu.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Gambar Varian
                        </label>

                        <ImageUpload
                          file={
                            variantForm.image
                          }
                          onChange={
                            handleVariantImageChange
                          }
                          onRemove={
                            removeVariantImage
                          }
                          height="h-[260px]"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          resetVariantForm();
                          setShowVariantForm(
                            false
                          );
                        }}
                        className="px-5 py-3 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        Batal
                      </button>

                      <button
                        type="submit"
                        disabled={
                          saving
                        }
                        className="px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold disabled:opacity-60"
                      >
                        {saving
                          ? "Menyimpan..."
                          : editingVariantId
                          ? "Simpan Perubahan"
                          : "Tambah Varian"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* BEST SELLER PREVIEW */}

              <div className="mt-10">
                <div className="mb-4">
                  <p className="text-xs font-bold tracking-[0.18em] text-red-500 uppercase">
                    Preview
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-blue-950">
                    Best Seller Beranda
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Daftar varian yang saat ini
                    ditampilkan sebagai Best Seller.
                  </p>
                </div>

                {bestSellerVariants.length ===
                0 ? (
                  <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center">
                    <p className="text-sm font-semibold text-gray-600">
                      Belum ada produk Best Seller.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {bestSellerVariants.map(
                      (variant) => (
                        <div
                          key={
                            variant.id
                          }
                          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                        >
                          <div className="relative h-36 bg-gray-50">
                            {variant.image ? (
                              <img
                                src={
                                  variant
                                    .image
                                    .url
                                }
                                alt={
                                  variant.color
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div
                                  className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                                  style={{
                                    backgroundColor:
                                      variant.colorHex,
                                  }}
                                />
                              </div>
                            )}

                            <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center text-xs font-bold">
                              {
                                variant.bestSellerOrder
                              }
                            </span>
                          </div>

                          <div className="p-4">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                              {
                                variant.productName
                              }
                            </p>

                            <h4 className="mt-1 font-bold text-blue-950">
                              {
                                variant.color
                              }
                            </h4>

                            <p className="mt-1 text-xs text-gray-500">
                              {
                                variant.code
                              }
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* STORAGE NOTE */}

              <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5">
                <p className="text-sm font-bold text-blue-950">
                  Penyimpanan file
                </p>

                <p className="mt-1 text-xs text-blue-800 leading-6">
                  Gambar produk, gambar varian,
                  dan dokumen PDF disimpan secara
                  permanen pada Supabase Storage.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center gap-1">
                <span className="w-12 h-1 rounded-full bg-red-500" />
                <span className="w-12 h-1 rounded-full bg-yellow-400" />
                <span className="w-12 h-1 rounded-full bg-blue-700" />
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

/*
=========================================================
INPUT
=========================================================
*/

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition"
      />
    </div>
  );
}

/*
=========================================================
IMAGE UPLOAD
=========================================================
*/

function ImageUpload({
  file,
  onChange,
  onRemove,
  height = "h-[280px]",
}: {
  file:
    | UploadedFile
    | null;

  onChange: (
    e: ChangeEvent<HTMLInputElement>
  ) => void;

  onRemove: () => void;

  height?: string;
}) {
  return (
    <div
      className={`relative ${height} rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden`}
    >
      {file ? (
        <>
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
            <p className="text-xs font-semibold text-white truncate">
              {file.name}
            </p>

            {file.size >
              0 && (
              <p className="mt-1 text-[10px] text-white/70">
                {formatFileSize(
                  file.size
                )}
              </p>
            )}
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <label className="cursor-pointer w-9 h-9 rounded-lg bg-white/95 shadow flex items-center justify-center text-blue-700 hover:bg-white">
              <EditIcon />

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  onChange
                }
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={
                onRemove
              }
              className="w-9 h-9 rounded-lg bg-white/95 shadow flex items-center justify-center text-red-500 hover:bg-white"
            >
              <TrashIcon />
            </button>
          </div>
        </>
      ) : (
        <label className="cursor-pointer absolute inset-0 flex flex-col items-center justify-center px-5 text-center hover:bg-blue-50/40 transition">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <ImageIcon />
          </div>

          <p className="mt-4 text-sm font-bold text-blue-950">
            Upload Gambar
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Klik untuk memilih gambar
          </p>

          <p className="mt-3 text-[11px] text-gray-400">
            JPG, PNG atau WEBP • Maks. 5 MB
          </p>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={
              onChange
            }
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

/*
=========================================================
PDF UPLOAD
=========================================================
*/

function PdfUpload({
  file,
  onChange,
  onRemove,
}: {
  file:
    | UploadedFile
    | null;

  onChange: (
    e: ChangeEvent<HTMLInputElement>
  ) => void;

  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      {file ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <PdfIcon />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-blue-950 truncate">
              {file.name}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Dokumen PDF
              {file.size >
                0 &&
                ` • ${formatFileSize(
                  file.size
                )}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={
                file.url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100"
            >
              Lihat
            </a>

            <label className="cursor-pointer px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50">
              Ganti

              <input
                type="file"
                accept="application/pdf"
                onChange={
                  onChange
                }
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={
                onRemove
              }
              className="px-3 py-2 rounded-lg text-red-500 text-xs font-semibold hover:bg-red-50"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <label className="cursor-pointer flex items-center gap-4 p-5 hover:bg-gray-50 transition">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <PdfIcon />
          </div>

          <div className="flex-1">
            <p className="text-sm font-bold text-blue-950">
              Upload PDF Produk
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Pilih dokumen PDF untuk produk ini.
            </p>

            <p className="mt-2 text-[11px] text-gray-400">
              PDF • Maks. 20 MB
            </p>
          </div>

          <span className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
            Pilih File
          </span>

          <input
            type="file"
            accept="application/pdf"
            onChange={
              onChange
            }
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

/*
=========================================================
STATUS
=========================================================
*/

function StatusBadge({
  status,
}: {
  status: ProductStatus;
}) {
  const active =
    status === "Aktif";

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
        active
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}

/*
=========================================================
SUMMARY
=========================================================
*/

function SummaryCard({
  label,
  value,
  description,
  type,
}: {
  label: string;
  value: number;
  description: string;
  type:
    | "blue"
    | "yellow"
    | "red"
    | "navy";
}) {
  const styles = {
    blue: {
      wrapper:
        "bg-blue-50 border-blue-100",
      icon:
        "bg-blue-100 text-blue-700",
    },

    yellow: {
      wrapper:
        "bg-yellow-50 border-yellow-100",
      icon:
        "bg-yellow-100 text-yellow-700",
    },

    red: {
      wrapper:
        "bg-red-50 border-red-100",
      icon:
        "bg-red-100 text-red-600",
    },

    navy: {
      wrapper:
        "bg-blue-950 border-blue-900",
      icon:
        "bg-blue-900 text-yellow-400",
    },
  };

  const style =
    styles[type];

  return (
    <div
      className={`rounded-2xl border p-5 ${style.wrapper}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-xs font-semibold ${
              type === "navy"
                ? "text-blue-200"
                : "text-gray-500"
            }`}
          >
            {label}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${
              type === "navy"
                ? "text-white"
                : "text-blue-950"
            }`}
          >
            {value}
          </p>

          <p
            className={`mt-1 text-xs ${
              type === "navy"
                ? "text-blue-300"
                : "text-gray-400"
            }`}
          >
            {description}
          </p>
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${style.icon}`}
        >
          {type ===
          "yellow"
            ? "V"
            : type === "red"
            ? "BS"
            : type ===
              "navy"
            ? "A"
            : "P"}
        </div>
      </div>
    </div>
  );
}

/*
=========================================================
ICONS
=========================================================
*/

function ImageIcon() {
  return (
    <svg
      className="w-7 h-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
      />

      <circle
        cx="8.5"
        cy="9"
        r="1.5"
      />

      <path
        d="m5 17 4.5-4 3.2 3 2.3-2 4 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        strokeLinejoin="round"
      />

      <path
        d="M14 3v5h5"
        strokeLinejoin="round"
      />

      <path
        d="M8 16h8M8 12h5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="m12 3 9 5-9 5-9-5 9-5Z"
        strokeLinejoin="round"
      />

      <path
        d="m3 12 9 5 9-5M3 16l9 5 9-5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"
        strokeLinejoin="round"
      />

      <path
        d="m13.5 7.5 3 3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M4 7h16M10 11v6M14 11v6"
        strokeLinecap="round"
      />

      <path
        d="M6 7l1 14h10l1-14M9 7V4h6v3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/*
=========================================================
FILE SIZE
=========================================================
*/

function formatFileSize(
  bytes: number
) {
  if (bytes === 0) {
    return "Ukuran tidak tersedia";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const index =
    Math.floor(
      Math.log(bytes) /
        Math.log(1024)
    );

  return `${(
    bytes /
    Math.pow(
      1024,
      index
    )
  ).toFixed(
    index === 0
      ? 0
      : 1
  )} ${
    units[index]
  }`;
}