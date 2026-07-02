import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authFetch } from "../../utils/api";
function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebaropen, setsidebar] = useState<boolean>(false);

  const sideBarItems = [
    {
      name: "Dashboard",
      icon: "/images/dashboard.png",
      path: "/seller/dashboard",
    },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Category", icon: "/images/category.png", path: "/category" },

    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    { name: "Repair", icon: "/images/service.png", path: "/repairs" },
    {
      name: "Customer Details",
      icon: "/images/Details.png",
      path: "/customers",
    },

    { name: "notification", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png", path: "/profile" },
  ];

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
    discountType: "",
    discountValue: "",
    startDate: "",
    endDate: "",
    categoryDiscountId: null as any,
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  useEffect(() => {
    // CATEGORY
    authFetch(`http://localhost:8080/api/categories/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          isActive: data.isActive ?? true,
        }));
      });

    // CATEGORY DISCOUNT
    authFetch("http://localhost:8080/api/seller/category-discounts")
      .then((res) => res.json())
      .then((list) => {
        const discount = list.find((d: any) => d.category.id == id);

        if (discount) {
          setForm((prev) => ({
            ...prev,
            categoryDiscountId: discount.id,
            discountType: discount.discountType || "",
            discountValue: discount.value || "",
            startDate: discount.startDate?.slice(0, 16) || "",
            endDate: discount.endDate?.slice(0, 16) || "",
          }));
        }
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    await authFetch(`http://localhost:8080/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description,
        isActive: form.isActive,
      }),
    });

    if (form.discountType && form.discountValue) {
      const method = form.categoryDiscountId ? "PUT" : "POST";

      const url = form.categoryDiscountId
        ? `http://localhost:8080/api/seller/category-discounts/${form.categoryDiscountId}`
        : "http://localhost:8080/api/seller/category-discounts";

      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: id,
          discountType: form.discountType,
          value: Number(form.discountValue),
          startDate: form.startDate,
          endDate: form.endDate,
        }),
      });
    }
    alert("Category updated successfully");
    navigate("/category");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex font-sans overflow-y-auto ">
      <aside
        className={`bg-gray-900 w-70 h-screen fixed shadow-lg z-20 ${
          sidebaropen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 lg:static transition-all flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-white">
          <img src="/images/leemalogo.jpg" className="h-6 w-18" />
          <span className="font-bold text-white ">Seller Dashboard</span>
        </div>

        <nav className="flex-1 mt-6">
          {sideBarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path!}
              className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-500 hover:rounded-md"
            >
              <img src={item.icon} className="w-6 h-6" />
              <span className="text-white font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="w-full flex items-center justify-center p-6 overflow-y-auto">
        <form
          onSubmit={handleUpdate}
          className="bg-white w-full max-w-md p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Edit Category #{id}
          </h2>

          <label className="text-gray-700 font-semibold">Category Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4 text-gray-700 border-gray-300"
          />

          <label className="text-gray-700 font-semibold">Slug</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4 text-gray-700 border-gray-300"
          />

          <label className="text-gray-700 font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4 text-gray-700 border-gray-300"
          />

          <label className="text-gray-700 font-semibold">Status</label>
          <select
            name="isActive"
            value={form.isActive ? "true" : "false"}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.value === "true" })
            }
            className="w-full border px-3 py-2 rounded mb-4 text-gray-700 border-gray-300"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* DISCOUNT SECTION */}
          <label className="text-gray-700 font-semibold">Discount Type</label>
          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4 text-gray-700 border-gray-300"
          >
            <option value="">No Discount</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed</option>
          </select>

          <label className="text-gray-700 font-semibold">Discount Value</label>
          <input
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4 text-gray-700 border-gray-300"
          />

          <label className="text-gray-700 font-semibold">Start Date</label>
          <input
            type="datetime-local"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4 text-gray-700 border-gray-300"
          />

          <label className="text-gray-700 font-semibold">End Date</label>
          <input
            type="datetime-local"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4 text-gray-700 border-gray-300"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Update
            </button>

            <button
              type="button"
              onClick={() => navigate("/category")}
              className="bg-gray-400 text-white px-4 py-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditCategory;
