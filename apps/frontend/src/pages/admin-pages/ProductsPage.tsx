import React, { useState } from "react";
import { Plus, Eye, Edit2, Trash2, Save, Star, Grid, List } from "lucide-react";
import {
  Badge, Btn, Input, Select, Textarea,
  Modal, ConfirmDelete, PageHeader, SearchBar,
} from "../../components/ui/admin-ui/index";
import { useProducts, useModal } from "../../hooks/Usestore";
import { CATEGORIES, PRODUCT_EMOJIS } from "../../data/Mockdata";
import type { Product, ProductFormData, ProductStatus } from "../../types";

// ─── Status variant map ───────────────────────────────────────────────────────

const STATUS_V: Record<ProductStatus, "success" | "warning" | "danger"> = {
  "Active":       "success",
  "Low Stock":    "warning",
  "Out of Stock": "danger",
};

// ─── Product Form ─────────────────────────────────────────────────────────────

interface ProductFormProps {
  form:    ProductFormData;
  setForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

const ProductForm: React.FC<ProductFormProps> = ({ form, setForm }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-stone-600 mb-1.5">Icon</label>
      <div className="flex flex-wrap gap-2">
        {PRODUCT_EMOJIS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setForm((f) => ({ ...f, image: e }))}
            className={`text-xl p-2 rounded-lg border-2 transition-all
              ${form.image === e ? "border-amber-400 bg-amber-50" : "border-transparent hover:border-stone-200"}`}
          >
            {e}
          </button>
        ))}
      </div>
    </div>

    <Input
      label="Product Name"
      value={form.name}
      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      placeholder="e.g. Oslo Sectional Sofa"
    />

    <div className="grid grid-cols-2 gap-3">
      <Select
        label="Category"
        value={form.category}
        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        options={CATEGORIES.map((c) => ({ value: c, label: c }))}
      />
      <Select
        label="Status"
        value={form.status}
        onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProductStatus }))}
        options={(["Active", "Low Stock", "Out of Stock"] as ProductStatus[]).map((s) => ({ value: s, label: s }))}
      />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <Input
        label="Price ($)"
        type="number"
        value={form.price}
        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        placeholder="0.00"
      />
      <Input
        label="Stock"
        type="number"
        value={form.stock}
        onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
        placeholder="0"
      />
    </div>

    <Textarea
      label="Description"
      value={form.description}
      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
      placeholder="Product description..."
    />
  </div>
);

// ─── Product Table Row ────────────────────────────────────────────────────────

interface ProductRowProps {
  product:  Product;
  onView:   (p: Product) => void;
  onEdit:   (p: Product) => void;
  onDelete: (p: Product) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, onView, onEdit, onDelete }) => (
  <tr className="border-b border-stone-50 hover:bg-amber-50/30 transition-colors">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{product.image}</span>
        <span className="font-medium text-stone-800">{product.name}</span>
      </div>
    </td>
    <td className="px-4 py-3 text-stone-500">{product.category}</td>
    <td className="px-4 py-3 font-semibold text-stone-800">${product.price.toLocaleString()}</td>
    <td className="px-4 py-3 text-stone-600">{product.stock}</td>
    <td className="px-4 py-3 text-stone-600">{product.sales}</td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-1">
        <Star size={12} className="text-amber-400 fill-amber-400" />
        <span className="text-stone-600">{product.rating}</span>
      </div>
    </td>
    <td className="px-4 py-3"><Badge variant={STATUS_V[product.status]}>{product.status}</Badge></td>
    <td className="px-4 py-3">
      <div className="flex gap-1.5">
        <button onClick={() => onView(product)}   className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600"><Eye    size={14} /></button>
        <button onClick={() => onEdit(product)}   className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-600"><Edit2  size={14} /></button>
        <button onClick={() => onDelete(product)} className="p-1.5 rounded-lg hover:bg-red-50   text-stone-400 hover:text-red-500">  <Trash2 size={14} /></button>
      </div>
    </td>
  </tr>
);

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product:  Product;
  onEdit:   (p: Product) => void;
  onDelete: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
    <div className="text-4xl mb-3 text-center bg-stone-50 rounded-xl py-4">{product.image}</div>
    <div className="space-y-1">
      <div className="font-semibold text-stone-800 text-sm">{product.name}</div>
      <div className="text-xs text-stone-400">{product.category}</div>
      <div className="flex items-center justify-between mt-2">
        <span className="font-bold text-amber-600">${product.price.toLocaleString()}</span>
        <Badge variant={STATUS_V[product.status]}>{product.status}</Badge>
      </div>
      <div className="flex gap-1.5 mt-3">
        <button onClick={() => onEdit(product)}   className="flex-1 py-1.5 text-xs rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 font-medium">Edit</button>
        <button onClick={() => onDelete(product)} className="px-2.5 py-1.5 text-xs rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={12} /></button>
      </div>
    </div>
  </div>
);

// ─── View Product Modal ───────────────────────────────────────────────────────

interface ViewProductModalProps {
  open:     boolean;
  onClose:  () => void;
  product:  Product | null;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ open, onClose, product }) => (
  <Modal open={open} onClose={onClose} title="Product Details" size="sm">
    {product && (
      <div className="space-y-4">
        <div className="text-center text-6xl py-6 bg-stone-50 rounded-xl">{product.image}</div>
        <div>
          <div className="text-xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            {product.name}
          </div>
          <div className="text-stone-500 text-sm mt-1">{product.category}</div>
          {product.description && <p className="text-stone-400 text-sm mt-2">{product.description}</p>}
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {([["Price", `$${product.price.toLocaleString()}`], ["Stock", product.stock], ["Sales", product.sales]] as [string, string | number][]).map(([l, v]) => (
            <div key={l} className="bg-stone-50 rounded-xl p-3">
              <div className="font-bold text-stone-800">{v}</div>
              <div className="text-xs text-stone-400">{l}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={STATUS_V[product.status]}>{product.status}</Badge>
          <div className="flex items-center gap-1 ml-auto">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="font-semibold text-stone-700">{product.rating}</span>
          </div>
        </div>
      </div>
    )}
  </Modal>
);

// ─── Products Page ────────────────────────────────────────────────────────────

const EMPTY_FORM: ProductFormData = {
  name: "", category: "Sofa", price: "", stock: "",
  status: "Active", description: "", image: "🛋️",
};

const ProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { modal, selected, open, close }                       = useModal<Product>();
  const [search,    setSearch]    = useState<string>("");
  const [filterCat, setFilterCat] = useState<string>("All");
  const [viewMode,  setViewMode]  = useState<"table" | "grid">("table");
  const [form,      setForm]      = useState<ProductFormData>(EMPTY_FORM);

  const filtered = products.filter(
    (p) =>
      (filterCat === "All" || p.category === filterCat) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd  = (): void => { setForm(EMPTY_FORM); open("add"); };
  const handleOpenEdit = (p: Product): void => { setForm({ ...p, price: String(p.price), stock: String(p.stock) }); open("edit", p); };
  const handleOpenView = (p: Product): void => open("view", p);
  const handleOpenDel  = (p: Product): void => open("delete", p);

  const handleSave = (): void => {
    if (modal === "add") addProduct(form);
    else if (selected) updateProduct(selected.id, form);
    close();
  };
  const handleDelete = (): void => {
    if (selected) deleteProduct(selected.id);
    close();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products"
        subtitle={`${products.length} total products`}
        action={<Btn onClick={handleOpenAdd}><Plus size={16} />Add Product</Btn>}
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-wrap gap-3 items-center">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="flex-1 min-w-[200px]"
        />
        <div className="flex gap-1.5 flex-wrap">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${filterCat === c ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 ml-auto">
          <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg ${viewMode === "table" ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-500"}`}><List size={15} /></button>
          <button onClick={() => setViewMode("grid")}  className={`p-2 rounded-lg ${viewMode === "grid"  ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-500"}`}><Grid size={15} /></button>
        </div>
      </div>

      {/* Table */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {["Product","Category","Price","Stock","Sales","Rating","Status","Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-stone-400 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <ProductRow key={p.id} product={p} onView={handleOpenView} onEdit={handleOpenEdit} onDelete={handleOpenDel} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onEdit={handleOpenEdit} onDelete={handleOpenDel} />
          ))}
        </div>
      )}

      <Modal open={modal === "add" || modal === "edit"} onClose={close} title={modal === "add" ? "Add New Product" : "Edit Product"}>
        <ProductForm form={form} setForm={setForm} />
        <div className="flex justify-end gap-2 mt-6">
          <Btn variant="secondary" onClick={close}>Cancel</Btn>
          <Btn onClick={handleSave}><Save size={15} />{modal === "add" ? "Add Product" : "Save Changes"}</Btn>
        </div>
      </Modal>

      <ViewProductModal open={modal === "view"} onClose={close} product={selected} />

      <ConfirmDelete open={modal === "delete"} onClose={close} onConfirm={handleDelete} title="Delete Product">
        <div className="text-5xl mb-2">{selected?.image}</div>
        <p className="text-stone-600">Delete <strong>{selected?.name}</strong>? This cannot be undone.</p>
      </ConfirmDelete>
    </div>
  );
};

export default ProductsPage;