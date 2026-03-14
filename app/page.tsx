'use client';
// Removed CSS module
import StatCard from "../components/StatCard/StatCard";
import QuickAction from "../components/QuickAction/QuickAction";
import ActivityItem from "../components/ActivityItem/ActivityItem";
import TopProductItem from "../components/TopProductItem/TopProductItem";
import BottomStatCard from "../components/BottomStatCard/BottomStatCard";
import { SVGProps } from "react";
import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboardService";

export default function Home() {
  const [stats, setStats] = useState({
    categories: 0,
    subcategories: 0,
    products: 0,
    warehouses: 0,
    b2bOrders: 0,
    b2cOrders: 0,
    activeBuyers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await dashboardService.getStats();
        if (result) {
          setStats(result);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <header className="mb-2">
        <div>
          <h2 className="text-2xl font-bold text-[#111827] m-0 mb-1">Dashboard</h2>
          <p className="text-sm text-[#6b7280] m-0">Welcome back! Here's what's happening with your marketplace.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Categories" value={stats.categories.toString()} subtext="+3 this month" theme="blue"
          icon={<TagIcon />}
        />
        <StatCard
          title="Sub Categories" value={stats.subcategories.toString()} subtext="+12 this month" theme="purple"
          icon={<TagsIcon />}
        />
        <StatCard
          title="Total Products" value={stats.products.toString()} subtext="+48 this week" theme="green"
          icon={<BoxIcon />}
        />
        <StatCard
          title="Ware Houses" value={stats.warehouses.toString()} subtext="+1 this month" theme="orange"
          icon={<WarehouseIcon />}
        />
      </section>

      <section className="bg-white border border-[#f3f4f6] rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#111827] m-0 mb-4">Quick Actions</h3>
        <div className="flex gap-4 flex-wrap">
          <QuickAction label="Add Category" icon={<TagIcon />} theme="blue" href="/categories" />
          <QuickAction label="Add Subcategory" icon={<TagsIcon />} theme="purple" href="/subcategories" />
          <QuickAction label="Add Product" icon={<BoxIcon />} theme="green" href="/products" />
          <QuickAction label="Add Warehouse" icon={<WarehouseIcon />} theme="orange" href="/warehouses" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-[#f3f4f6] rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#111827] m-0 mb-4">Recent Activity</h3>
          </div>
          <div className="flex flex-col">
            <ActivityItem
              title="New product added" description="Organic Basmati Rice 5kg" time="2 min ago" dotColor="green"
            />
            <ActivityItem
              title="Category updated" description="Grains & Cereals" time="15 min ago" dotColor="blue"
            />
            <ActivityItem
              title="Warehouse added" description="Mumbai Central Warehouse" time="1 hr ago" dotColor="orange"
            />
            <ActivityItem
              title="Subcategory created" description="Basmati Rice under Grains" time="2 hr ago" dotColor="purple"
            />
            <ActivityItem
              title="Product status changed" description="Turmeric Powder - Active" time="3 hr ago" dotColor="green"
            />
          </div>
        </section>

        <section className="bg-white border border-[#f3f4f6] rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#111827] m-0 mb-4">Top Products</h3>
          </div>
          <div className="flex flex-col">
            <TopProductItem name="Organic Basmati Rice" details="Grains · B2C: ₹120 · B2B: ₹95/kg" status="Active" />
            <TopProductItem name="Fresh Turmeric Powder" details="Spices · B2C: ₹85 · B2B: ₹68/kg" status="Active" />
            <TopProductItem name="Red Chilli Whole" details="Spices · B2C: ₹110 · B2B: ₹88/kg" status="Active" />
            <TopProductItem name="Green Moong Dal" details="Pulses · B2C: ₹95 · B2B: ₹78/kg" status="Inactive" />
            <TopProductItem name="Organic Wheat Flour" details="Grains · B2C: ₹55 · B2B: ₹42/kg" status="Active" />
          </div>
        </section>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BottomStatCard title="B2B Orders This Month" value={`₹${stats.b2bOrders.toLocaleString()}`} theme="blue" icon={<TrendingUpIcon />} />
        <BottomStatCard title="B2C Orders This Month" value={`₹${stats.b2cOrders.toLocaleString()}`} theme="green" icon={<CartIcon />} />
        <BottomStatCard title="Active Buyers" value={stats.activeBuyers.toLocaleString()} theme="purple" icon={<UsersIcon />} />
      </section>
    </div>
  );
}

function TagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
  );
}
function TagsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 7h.01" /><path d="M2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82l-7.17 7.17a2 2 0 0 1-2.83 0L2 12z" /><path d="M22 17l-3-3" /></svg>
  );
}
function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
  );
}
function WarehouseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 21V9l9-6 9 6v12" /><path d="M9 21v-6h6v6" /></svg>
  );
}
function TrendingUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
  );
}
function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
  );
}
function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  );
}
