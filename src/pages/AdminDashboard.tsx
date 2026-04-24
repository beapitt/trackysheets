import React from "react";
import { Link } from "react-router-dom";

const GREEN_DARK = "#2D5A27";

export default function AdminDashboard() {
  const sections = [
    {
      title: "Templates",
      desc: "Manage your spreadsheet products",
      icon: "📊",
      path: "/admin/templates",
      bgColor: "#E3F2FD",
      iconColor: "#1976D2"
    },
    {
      title: "Categories",
      desc: "Organize products by type",
      icon: "📁",
      path: "/admin/categories",
      bgColor: "#F3E5F5",
      iconColor: "#7B1FA2"
    },
    {
      title: "Site Settings",
      desc: "Logo, Title, and Intro texts",
      icon: "⚙️",
      path: "/admin/settings",
      bgColor: "#FCE4EC",
      iconColor: "#C2185B"
    },
    {
      title: "Ad Slots",
      desc: "Paste AdSense or HTML codes",
      icon: "⚡",
      path: "/admin/ads",
      bgColor: "#FFF3E0",
      iconColor: "#F57C00"
    },
    {
      title: "Legal & SEO",
      desc: "Privacy, Terms and Analytics",
      icon: "⚖️",
      path: "/admin/legal",
      bgColor: "#E0F2F1",
      iconColor: "#00796B"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-left">
      {/* Header Admin */}
      <div style={{ backgroundColor: GREEN_DARK }} className="h-14 flex items-center px-6 shadow-md">
        <h1 className="text-white font-bold text-lg">TrackySheets Admin</h1>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#2D5A27]">Dashboard</h2>
          <p className="text-gray-500 text-sm">Welcome back, Beatrice. What would you like to manage today?</p>
        </div>

        {/* Grid 5 Sezioni Manus Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s, i) => (
            <Link 
              key={i} 
              to={s.path}
              className="bg-white p-6 rounded-lg border border-[#e0e0e0] shadow-sm hover:shadow-md transition-all no-underline group"
            >
              <div className="flex items-center">
                <div 
                  style={{ backgroundColor: s.bgColor }} 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform"
                >
                  {s.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#333] text-lg">{s.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{s.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
