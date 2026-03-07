# Convex Flow

**Enterprise AI workflow automation with full explainability.**

Convex Flow is a modern, enterprise-grade AI workflow automation platform designed to give you complete visibility and control over your automated processes. Built with cutting-edge technologies, it provides a robust architecture for designing, executing, and auditing complex AI-driven workflows.

## Features

- **Intuitive Workflow Builder**: Design complex AI workflows effortlessly.
- **Full Explainability**: Understand exactly why and how AI decisions are made within your pipelines.
- **Enterprise-ready**: Scalable architecture built for robust performance.
- **Real-time Auditing**: Comprehensive logs and tracking for compliance and debugging.

## Tech Stack

This project is a monorepo built using Turborepo and includes:

- **Next.js 15 (App Router)**: For the core web application and MVP.
- **React 19**: Leveraging the latest React features.
- **Tailwind CSS & shadcn/ui**: For a highly customizable, accessible, and beautiful UI.
- **LangChain**: For seamless integration and orchestration of LLMs.
- **Zustand**: For lightweight, fast state management.
- **Framer Motion & GSAP**: For fluid, cinematic animations and interactions.

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/convex-flow.git
   cd convex-flow
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables based on `.env.example` in the respective apps.

4. Start the development server:
   ```bash
   pnpm run dev
   ```

This will run all apps and packages in the monorepo concurrently.

## Project Structure

```text
convex-flow/
├── apps/
│   ├── mvp/          # Core MVP Next.js application
│   └── web/          # Marketing / Landing page Next.js application
├── packages/
│   ├── database/     # Shared database configuration and schemas
│   └── ui/           # Shared UI components (shadcn/ui)
└── servers/          # Backend microservices and API servers
```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## License

This project is open-source and available under the [MIT License](LICENSE).
