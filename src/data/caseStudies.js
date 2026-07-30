export const caseStudies = {
  grouphead: {
    problem:
      'Espresso machine owners buying replacement parts (gaskets, filters, portafilters) have to guess whether a part actually fits their exact brand and model — most retailers just list parts, not compatibility.',
    approach: [
      'Built a brand/model compatibility finder as the core product, backed by Supabase for the machine and parts catalog.',
      'Used Next.js 14 (App Router) for SSR/ISR on catalog pages, Clerk for auth on the admin side.',
      'Designed a partner program alongside the product: sponsored finder placements, affiliate commissions on parts, and qualified repair leads sold to local technicians — so the catalog itself becomes the acquisition channel.',
      'Shipped an internal admin panel for managing machines, brands, and incoming machine/correction requests without touching the database directly.',
    ],
    stack: ['Next.js 14', 'TypeScript', 'Supabase', 'Clerk', 'Tailwind CSS', 'Zod'],
    outcome:
      'Live at grouphead.co with a working finder, partner inquiry flow, and admin tooling. Still actively adding brands/models and refining the partner program.',
    links: [
      { label: 'Live site', href: 'https://grouphead.co' },
      { label: 'Source', href: 'https://github.com/SirNotEthan/grouphead-app' },
    ],
  },
  homelab: {
    problem:
      'Needed a self-hosted platform for personal services and future local AI workloads that could be rebuilt from scratch without relying on memory or shell history — infrastructure as an afterthought doesn’t survive a hardware failure.',
    approach: [
      'Chose k3s over kubeadm for the control plane — less component overhead on modest ThinkCentre hardware, documented in ADR-0001.',
      'Automated the Ubuntu host baseline with Ansible and remote access with Tailscale, so no manual SSH-and-hope setup steps.',
      'Set up Argo CD so the cluster reconciles from `main` — Git is the single source of truth for desired state, not the live cluster.',
      'Layered in Traefik ingress, cert-manager for wildcard TLS, Longhorn for distributed storage, and Authentik for SSO — each with an explicit backup/recovery plan, not just a working demo.',
      'Wrote every non-trivial decision as an ADR (architecture decision record) so the "why" survives even if the "how" changes later.',
    ],
    stack: ['Kubernetes (k3s)', 'Argo CD', 'Terraform', 'Ansible', 'Traefik', 'cert-manager', 'Longhorn', 'Authentik', 'Prometheus / Grafana / Loki'],
    outcome:
      'Version 0.2.0: a running cluster with private DNS, HTTPS ingress, GitOps-managed applications, and full observability. Independent off-site backups and a local AI platform are the next milestones.',
    links: [
      { label: 'Source', href: 'https://github.com/SirNotEthan/Homelab' },
    ],
  },
};
