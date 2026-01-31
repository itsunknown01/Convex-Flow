"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const products = [
  {
    id: "workflow",
    title: "Workflow Builder",
    description:
      "Visually design AI agent workflows with our intuitive drag-and-drop interface.",
    image: "/images/products/workflow-builder.png",
  },
  {
    id: "dashboard",
    title: "Analytics Dashboard",
    description:
      "Monitor workflow performance, execution metrics, and system health in real-time.",
    image: "/images/products/dashboard.png",
  },
  {
    id: "policy",
    title: "Policy Editor",
    description:
      "Define and enforce compliance rules with our powerful policy configuration system.",
    image: "/images/products/policy-editor.png",
  },
];

export function ProductSection() {
  const [activeProduct, setActiveProduct] = useState(0);

  return (
    <section className="relative py-24 lg:py-32 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">
            Product
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Built for enterprise teams
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            A complete platform designed for scale, security, and collaboration.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Tab Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/3 space-y-4"
          >
            {products.map((product, index) => (
              <button
                key={product.id}
                onClick={() => setActiveProduct(index)}
                className={`w-full text-left p-6 rounded-xl border transition-all ${
                  activeProduct === index
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                }`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    activeProduct === index ? "text-white" : "text-slate-300"
                  }`}
                >
                  {product.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {product.description}
                </p>
              </button>
            ))}
          </motion.div>

          {/* Product Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-2/3"
          >
            <motion.div
              key={activeProduct}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-video rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-2xl"
            >
              <Image
                src={products[activeProduct].image}
                alt={products[activeProduct].title}
                fill
                className="object-cover"
                priority
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
