export const roleTheme = {
  brand: {
    shell: 'theme-brand',
    accent: 'Brand',
    tagline: 'Campaign HQ',
    gradient: 'from-stone-50 to-amber-50/80',
    pill: 'bg-stone-900 text-white',
  },
  creator: {
    shell: 'theme-creator',
    accent: 'Creator',
    tagline: 'Studio',
    gradient: 'from-violet-50/90 to-fuchsia-50/50',
    pill: 'bg-violet-600 text-white',
  },
  agency: {
    shell: 'theme-agency',
    accent: 'Agency',
    tagline: 'Hub',
    gradient: 'from-slate-50 to-sky-50/80',
    pill: 'bg-sky-700 text-white',
  },
  admin: {
    shell: 'theme-admin',
    accent: 'Admin',
    tagline: 'Command',
    gradient: 'from-zinc-50 to-neutral-100',
    pill: 'bg-black text-white',
  },
};

export function getTheme(role) {
  return roleTheme[role] || roleTheme.brand;
}
